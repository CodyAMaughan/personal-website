import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const { type, data } = await request.json();

        if (type !== 'run_complete' || !data) {
            return new Response(JSON.stringify({ message: 'Invalid payload' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const SUPABASE_URL = import.meta.env.SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.warn('Supabase env vars not set. Logging analytics to console.');
            console.log('[ANALYTICS]', JSON.stringify(data).slice(0, 500));
            return new Response(JSON.stringify({ message: 'Logged (no DB)' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const headers = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=representation',
        };

        const run = data.run || {};
        const cardEvents: any[] = data.card_events || [];

        // Insert the run record.
        const runPayload = {
            session_id: data.session_id || 'unknown',
            won: run.won ?? false,
            floor_reached: run.floor_reached ?? 0,
            chosen_elements: run.chosen_elements || [],
            final_deck: run.final_deck || [],
            final_deck_size: run.final_deck_size ?? 0,
            battles_fought: run.battles_fought ?? 0,
            cards_played: run.cards_played ?? 0,
            boss_name: run.boss_name || '',
        };

        const runRes = await fetch(`${SUPABASE_URL}/rest/v1/runs`, {
            method: 'POST',
            headers,
            body: JSON.stringify(runPayload),
        });

        if (!runRes.ok) {
            const errText = await runRes.text();
            console.error('Supabase runs insert error:', errText);
            return new Response(JSON.stringify({ message: 'DB error (runs)', detail: errText }), {
                status: 502,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract the inserted run ID.
        const runRows = await runRes.json();
        const runId = runRows?.[0]?.id;

        if (runId && cardEvents.length > 0) {
            // Bulk insert card events linked to this run.
            const cePayload = cardEvents.map((ce: any) => ({
                run_id: runId,
                card_id: ce.card_id || '',
                times_played: ce.times_played ?? 0,
                total_damage: ce.total_damage ?? 0,
                was_picked: ce.was_picked ?? false,
                was_offered: ce.was_offered ?? false,
                in_final_deck: ce.in_final_deck ?? false,
            }));

            const ceRes = await fetch(`${SUPABASE_URL}/rest/v1/card_events`, {
                method: 'POST',
                headers: { ...headers, 'Prefer': 'return=minimal' },
                body: JSON.stringify(cePayload),
            });

            if (!ceRes.ok) {
                const errText = await ceRes.text();
                console.error('Supabase card_events insert error:', errText);
                // Non-fatal: run was already saved.
            }
        }

        return new Response(JSON.stringify({ message: 'OK', run_id: runId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Analytics API Error:', error);
        return new Response(
            JSON.stringify({
                message: 'Server Error',
                details: error instanceof Error ? error.message : String(error),
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
