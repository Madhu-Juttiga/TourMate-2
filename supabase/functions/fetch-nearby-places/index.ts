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
    const { latitude, longitude, radius = 50000 } = await req.json();
    
    console.log('Fetching nearby places for:', { latitude, longitude, radius });

    // Google Places Nearby Search API
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=tourist_attraction|hindu_temple|museum|monument&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google API error:', data);
      throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    // Transform Google Places data to our Place type
    const places = data.results.map((place: any) => {
      // Calculate distance using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = (place.geometry.location.lat - latitude) * Math.PI / 180;
      const dLng = (place.geometry.location.lng - longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(latitude * Math.PI / 180) * Math.cos(place.geometry.location.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Determine category based on types
      let category = 'Tourist Spot';
      if (place.types.includes('hindu_temple')) category = 'Temple';
      else if (place.types.includes('museum')) category = 'Museum';
      else if (place.types.includes('monument')) category = 'Monument';
      else if (place.types.includes('park')) category = 'Park';

      // Generate photo URL if available
      const photoReference = place.photos?.[0]?.photo_reference;
      const photoUrl = photoReference 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`
        : '/placeholder.svg';
      
      const thumbnailUrl = photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`
        : '/placeholder.svg';

      return {
        id: place.place_id,
        name: place.name,
        category,
        description: place.vicinity || 'No description available',
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        distance: Math.round(distance * 10) / 10,
        image: photoUrl,
        thumbnail: thumbnailUrl,
        rating: place.rating || 0,
        timings: place.opening_hours?.open_now ? 'Open Now' : 'Closed',
        entryFee: 'Contact for details',
      };
    });

    console.log(`Found ${places.length} places`);

    return new Response(JSON.stringify({ places }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-nearby-places:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
