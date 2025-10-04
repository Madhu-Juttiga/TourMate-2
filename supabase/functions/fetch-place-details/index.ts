import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { placeId } = await req.json();
    
    console.log('Fetching place details for:', placeId);

    // Google Places Details API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,website,rating,reviews,photos,geometry,types&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google API error:', data);
      throw new Error(`Google API error: ${data.status}`);
    }

    const place = data.result;

    // Generate photo URLs
    const photos = place.photos?.slice(0, 5).map((photo: any) => 
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
    ) || [];

    // Format opening hours
    let timings = 'Hours not available';
    if (place.opening_hours?.weekday_text) {
      timings = place.opening_hours.weekday_text.join(', ');
    } else if (place.opening_hours?.open_now !== undefined) {
      timings = place.opening_hours.open_now ? 'Open Now' : 'Closed';
    }

    const details = {
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number || 'Not available',
      website: place.website || null,
      rating: place.rating || 0,
      reviews: place.reviews?.slice(0, 3).map((review: any) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
      })) || [],
      photos,
      timings,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    };

    console.log('Place details fetched successfully');

    return new Response(JSON.stringify(details), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-place-details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
