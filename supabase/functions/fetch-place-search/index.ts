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
    const { query, latitude, longitude, radius = 50000 } = await req.json();
    
    console.log('Searching places for query:', { query, latitude, longitude, radius });

    if (!query || !latitude || !longitude) {
      throw new Error('Query, latitude, and longitude are required');
    }

    const location = `${latitude},${longitude}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google API error:', data);
      throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const getCategoryFromTypes = (types: string[]): string => {
      if (types.includes('hindu_temple') || types.includes('church') || types.includes('mosque') || types.includes('place_of_worship')) {
        return 'Temple';
      }
      if (types.includes('museum')) return 'Museum';
      if (types.includes('park')) return 'Park';
      if (types.includes('monument')) return 'Monument';
      return 'Tourist Spot';
    };

    const places = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      category: getCategoryFromTypes(place.types || []),
      description: place.formatted_address || '',
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      distance: calculateDistance(
        latitude,
        longitude,
        place.geometry.location.lat,
        place.geometry.location.lng
      ),
      image: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
      thumbnail: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
      rating: place.rating || 4.0,
      timings: place.opening_hours?.open_now !== undefined 
        ? (place.opening_hours.open_now ? 'Open Now' : 'Closed')
        : 'Hours not available',
      entryFee: 'Contact for details',
    }));

    console.log(`Found ${places.length} places for query: ${query}`);

    return new Response(
      JSON.stringify({ places }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-place-search:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
