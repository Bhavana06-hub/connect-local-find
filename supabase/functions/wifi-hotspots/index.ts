
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WigleResponse {
  success: boolean;
  totalResults: number;
  search: Array<{
    trilat: number;
    trilong: number;
    ssid: string;
    netid: string;
    type: string;
    comment: string;
    wep: string;
    bcninterval: number;
    freenet: string;
    dhcp: string;
    paynet: string;
    userfound: boolean;
    channel: number;
    encryption: string;
    lasttime: string;
    lastupdt: string;
    nettype: string;
    qos: number;
    transid: string;
    firsttime: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the WiGLE API key from Supabase secrets
    const wigleApiKey = Deno.env.get('WIGLE_API_KEY')
    if (!wigleApiKey) {
      throw new Error('WiGLE API key not configured')
    }

    // Parse query parameters
    const url = new URL(req.url)
    const latitude = parseFloat(url.searchParams.get('latitude') || '0')
    const longitude = parseFloat(url.searchParams.get('longitude') || '0')
    const radius = parseFloat(url.searchParams.get('radius') || '0.01')

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Missing latitude or longitude' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Fetching WiFi hotspots for lat: ${latitude}, lng: ${longitude}, radius: ${radius}`)

    // Build WiGLE API request
    const wigleUrl = `https://api.wigle.net/api/v2/network/search`
    const params = new URLSearchParams({
      latrange1: (latitude - radius).toString(),
      latrange2: (latitude + radius).toString(),
      longrange1: (longitude - radius).toString(),
      longrange2: (longitude + radius).toString(),
      freenet: 'true',
      paynet: 'false',
      resultCount: '100'
    })

    // Parse username:token format
    const [username, token] = wigleApiKey.includes(':') 
      ? wigleApiKey.split(':') 
      : [wigleApiKey, '']
    
    const credentials = btoa(`${username}:${token}`)

    // Call WiGLE API
    const wigleResponse = await fetch(`${wigleUrl}?${params}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
        'User-Agent': 'WiFi-Locator-Supabase/1.0'
      }
    })

    console.log(`WiGLE API response status: ${wigleResponse.status}`)

    if (!wigleResponse.ok) {
      const errorText = await wigleResponse.text()
      console.error('WiGLE API error:', errorText)
      throw new Error(`WiGLE API error: ${wigleResponse.status} - ${errorText}`)
    }

    const data: WigleResponse = await wigleResponse.json()
    console.log(`WiGLE returned ${data.search?.length || 0} hotspots`)

    // Transform data for frontend
    const hotspots = data.search?.map(hotspot => ({
      ssid: hotspot.ssid || 'Unknown Network',
      bssid: hotspot.netid,
      latitude: hotspot.trilat,
      longitude: hotspot.trilong,
      encryption: hotspot.encryption || hotspot.wep,
      signal: hotspot.qos || 0,
      lastSeen: hotspot.lasttime,
      source: 'wigle',
      venue: hotspot.comment || undefined,
      address: `${hotspot.trilat.toFixed(6)}, ${hotspot.trilong.toFixed(6)}`
    })) || []

    return new Response(
      JSON.stringify({ 
        success: true, 
        hotspots,
        count: hotspots.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in wifi-hotspots function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
