import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

interface CheckCreditsResponse {
  hasCredits: boolean;
  sessionsAvailable: number;
  customerName?: string;
  error?: string;
}

/**
 * GET /api/booking/check-credits?email=xxx
 * Check if a customer has available session credits
 */
export async function GET(req: NextRequest): Promise<NextResponse<CheckCreditsResponse>> {
  if (!supabaseAdmin) {
    return NextResponse.json({
      hasCredits: false,
      sessionsAvailable: 0,
      error: 'Database not configured'
    }, { status: 500 });
  }

  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({
      hasCredits: false,
      sessionsAvailable: 0,
      error: 'Email parameter required'
    }, { status: 400 });
  }

  try {
    // Find customer by email
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, name')
      .eq('email', email)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({
        hasCredits: false,
        sessionsAvailable: 0,
        error: 'No account found. Please purchase a session pack first.'
      });
    }

    // Check available sessions (non-expired with remaining sessions)
    const { data: credits } = await supabaseAdmin
      .from('session_credits')
      .select('sessions_remaining')
      .eq('customer_id', customer.id)
      .gt('sessions_remaining', 0)
      .gt('expires_at', new Date().toISOString());

    const totalSessions = credits?.reduce((sum, c) => sum + c.sessions_remaining, 0) || 0;

    return NextResponse.json({
      hasCredits: totalSessions > 0,
      sessionsAvailable: totalSessions,
      customerName: customer.name || undefined
    });

  } catch (error) {
    console.error('Check credits error:', error);
    return NextResponse.json({
      hasCredits: false,
      sessionsAvailable: 0,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
