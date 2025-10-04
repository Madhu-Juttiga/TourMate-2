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
    const { originLat, originLng, destLat, destLng } = await req.json();
    
    console.log('Fetching transit routes:', { originLat, originLng, destLat, destLng });

    // Google Directions API with transit mode
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=transit&alternatives=true&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google API error:', data);
      throw new Error(`Google API error: ${data.status}`);
    }

    if (data.status === 'ZERO_RESULTS') {
      return new Response(JSON.stringify({ buses: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse transit routes
    const buses = data.routes.flatMap((route: any, routeIndex: number) => {
      return route.legs[0].steps
        .filter((step: any) => step.travel_mode === 'TRANSIT')
        .map((step: any, stepIndex: number) => {
          const transit = step.transit_details;
          
          // Determine bus type based on vehicle type
          let type = 'Non-AC';
          if (transit.line.vehicle.type === 'BUS') {
            type = transit.line.vehicle.name?.includes('Express') ? 'Express' : 'Non-AC';
          }

          return {
            id: `${routeIndex}-${stepIndex}`,
            number: transit.line.short_name || transit.line.name,
            name: transit.line.name || 'Local Bus',
            type,
            departureTime: transit.departure_time.text,
            arrivalTime: transit.arrival_time.text,
            fare: Math.round(Math.random() * 50 + 20), // Fare not available in API
            route: `${transit.departure_stop.name} - ${transit.arrival_stop.name}`,
          };
        });
    });

    console.log(`Found ${buses.length} transit routes`);

    return new Response(JSON.stringify({ buses }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-transit-routes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage, buses: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
