import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.name || data.name.trim() === '') {
            return new Response(JSON.stringify({ message: "Name is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

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
                        formType: "contact",
                        name: data.name,
                        email: data.email,
                        budget: data.budget || "Not specified",
                        message: data.message || "",
                        honeypot: data.honeypot || ""
                    }),
                });

                if (!response.ok) {
                    console.error("Google Script Error", response.statusText);
                }
            } catch (fetchError) {
                console.error("Fetch Error:", fetchError);
            }
        } else {
            console.warn("WAITLIST_GOOGLE_SCRIPT_URL is not set. Logging to console only.");
            console.log(`[CONTACT] New inquiry from: ${data.name} <${data.email}>`);
        }

        return new Response(JSON.stringify({ message: "Success" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Contact API Error:", error);
        return new Response(JSON.stringify({ message: "Server Error", details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
