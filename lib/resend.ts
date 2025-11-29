import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
    to,
    subject,
    html,
    from = 'Authentic Furniture <onboarding@resend.dev>', // Update this to your verified domain later
}: {
    to: string;
    subject: string;
    html: string;
    from?: string;
}) => {
    try {
        const data = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
};
