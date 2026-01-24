import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // Simple validation
        if (!data.email || !data.email.includes('@')) {
            return new Response(JSON.stringify({ message: "Invalid email" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Connect to Google Sheets via Apps Script
        const SCRIPT_URL = import.meta.env.WAITLIST_GOOGLE_SCRIPT_URL;

        if (SCRIPT_URL) {
            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8'
                    },
                    body: JSON.stringify({
                        formType: "waitlist",
                        email: data.email,
                        product: data.product || "General",
                        honeypot: data.honeypot || ""
                    }),
                });

                if (!response.ok) {
                    console.error("Google Script Error", response.statusText);
                    // We still return success to the user so they don't see a backend error
                }
            } catch (fetchError) {
                console.error("Fetch Error:", fetchError);
            }
        } else {
            console.warn("WAITLIST_GOOGLE_SCRIPT_URL is not set. Logging to console only.");
            console.log(`[WAITLIST] New signup: ${data.email}`);
        }

        return new Response(JSON.stringify({ message: "Success" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
