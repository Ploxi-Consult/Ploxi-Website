// Deno types
/// <reference lib="deno.ns" />

// Serve function type
interface ServeInit {
  port?: number;
  hostname?: string;
  signal?: AbortSignal;
  onError?: (error: unknown) => Response | Promise<Response>;
  onListen?: (params: { hostname: string; port: number }) => void;
}

// Import serve function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Get environment variables
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const BREVO_LIST_ID = Deno.env.get('BREVO_LIST_ID')

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handler function with proper typing
serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse webhook payload
    const payload = await req.json() as {
      type?: string;
      record?: {
        email?: string;
        id?: string;
        is_active?: boolean;
      };
      email?: string;
    }
    
    console.log('Received webhook payload:', payload)
    
    // Extract email
    const email = payload.record?.email || payload.email
    
    if (!email) {
      throw new Error('No email found in payload')
    }

    console.log('Adding email to Brevo:', email)

    // Call Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY as string,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(BREVO_LIST_ID as string)],
        updateEnabled: true
      })
    })

    const brevoData = await brevoResponse.json()
    
    // Check response
    if (!brevoResponse.ok && brevoResponse.status !== 400) {
      console.error('Brevo API error:', brevoData)
      throw new Error(`Brevo API error: ${JSON.stringify(brevoData)}`)
    }

    console.log('Successfully added to Brevo:', brevoData)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact added to Brevo',
        email: email,
        brevoResponse: brevoData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error: unknown) {
    console.error('Error in edge function:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.toString() : String(error)
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
