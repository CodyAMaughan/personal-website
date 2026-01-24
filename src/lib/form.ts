/**
 * Shared form submission utilities for client-side form handling.
 * Posts to internal API routes which forward to Google Scripts.
 */

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface WaitlistFormData {
    email: string;
    product?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    budget: string;
    message: string;
}

interface SubmitResult {
    success: boolean;
    message?: string;
}

/**
 * Submit a waitlist signup form
 */
export async function submitWaitlistForm(data: WaitlistFormData): Promise<SubmitResult> {
    try {
        const res = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            return { success: true };
        } else {
            const errorData = await res.json().catch(() => ({}));
            return { success: false, message: errorData.message || 'Something went wrong' };
        }
    } catch (error) {
        return { success: false, message: 'Network error. Please try again.' };
    }
}

/**
 * Submit a contact/inquiry form
 */
export async function submitContactForm(data: ContactFormData): Promise<SubmitResult> {
    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            return { success: true };
        } else {
            const errorData = await res.json().catch(() => ({}));
            return { success: false, message: errorData.message || 'Something went wrong' };
        }
    } catch (error) {
        return { success: false, message: 'Network error. Please try again.' };
    }
}
