// Contact service — submits the contact form to Web3Forms directly from the
// browser. Web3Forms is a no-backend form backend that emails submissions to
// the site owner. The access key is public by design (it only identifies the
// destination form), so it is safe to expose client-side via NEXT_PUBLIC_*.
import { createTimeoutController, isValidEmail, isNonEmpty } from '@/utils/security';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface ContactResult {
    success: boolean;
    error?: string;
}

const REQUEST_TIMEOUT_MS = 15000;
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export const submitContactForm = async (data: ContactFormData): Promise<ContactResult> => {
    if (!ACCESS_KEY) {
        return {
            success: false,
            error: 'Contact form is not configured yet. Please reach out via the social links below.',
        };
    }

    if (!isNonEmpty(data.name) || !isNonEmpty(data.message) || !isValidEmail(data.email)) {
        return { success: false, error: 'Invalid form data. Please check all fields.' };
    }

    try {
        const { controller, timeoutId } = createTimeoutController(REQUEST_TIMEOUT_MS);

        const response = await fetch(WEB3FORMS_ENDPOINT, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                access_key: ACCESS_KEY,
                name: data.name,
                email: data.email,
                replyto: data.email,
                message: data.message,
                subject: `New portfolio message from ${data.name}`,
                from_name: 'Portfolio Contact',
            }),
        });

        clearTimeout(timeoutId);

        const payload = (await response.json().catch(() => null)) as
            | { success?: boolean; message?: string }
            | null;

        if (response.ok && payload?.success) {
            return { success: true };
        }

        return {
            success: false,
            error: payload?.message || 'Failed to send message. Please try again.',
        };
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            return { success: false, error: 'Request timeout. Please try again.' };
        }
        return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
};
