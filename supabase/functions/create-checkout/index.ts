import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CheckoutItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface BuyNowItem {
  id: string;
  quantity: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-11-20.acacia',
    });

    const { items, customer_email, customization } = await req.json();

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No items in cart' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173';

    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const looksLikeBuyNow = typeof items[0] === 'object' && items[0] && 'id' in items[0];

    if (looksLikeBuyNow) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      if (!supabaseUrl || !supabaseServiceKey) {
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const buyNowItems = items as BuyNowItem[];
      const ids = buyNowItems.map(i => i.id);

      interface DBProduct {
        id: string;
        name: string;
        short_description: string | null;
        price: number;
        image_url: string | null;
        is_available: boolean;
      }

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id,name,short_description,price,image_url,is_available')
        .in('id', ids);

      if (productsError) {
        throw productsError;
      }

      const typedProducts = (products ?? []) as DBProduct[];
      const productMap = new Map<string, DBProduct>(typedProducts.map(p => [p.id, p]));

      line_items = buyNowItems.map((i): Stripe.Checkout.SessionCreateParams.LineItem => {
        const p = productMap.get(i.id);
        if (!p || !p.is_available) {
          throw new Error('Product unavailable');
        }
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: p.name,
              description: p.short_description || '',
              images: p.image_url ? [p.image_url] : [],
              metadata: { product_id: p.id },
            },
            unit_amount: Math.round(p.price * 100),
          },
          quantity: Math.max(1, i.quantity || 1),
        };
      });
    } else {
      // Legacy cart payload from client with name/price
      line_items = (items as CheckoutItem[]).map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
    }

    const sessionMetadataItems = looksLikeBuyNow
      ? (items as BuyNowItem[]).map(i => ({ id: i.id, quantity: i.quantity }))
      : (items as CheckoutItem[]).map(i => ({ name: i.name, quantity: i.quantity }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}?success=true`,
      cancel_url: `${origin}`,
      customer_email: customer_email || undefined,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        customization: customization || '',
        items: JSON.stringify(sessionMetadataItems),
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});