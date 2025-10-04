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
    const { latitude, longitude } = await req.json();
    
    console.log('Fetching location name for:', { latitude, longitude });

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Geocoding API error:', data);
      throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    // Extract city, state, country from address components
    let city = '';
    let state = '';
    let country = '';

    if (data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      
      for (const component of addressComponents) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_2') && !city) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        } else if (component.types.includes('country')) {
          country = component.short_name;
        }
      }
    }

    const locationName = city 
      ? `${city}, ${state || country}` 
      : data.results[0]?.formatted_address || 'Unknown location';

    console.log('Location name:', locationName);

    return new Response(
      JSON.stringify({ locationName, fullAddress: data.results[0]?.formatted_address }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-location-name:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
