
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurao do Transporter baseada no .env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true para 465, false para outras
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Envia e-mail de recuperação de senha
 */
export async function sendResetPasswordEmail(to: string, clientName: string, resetLink: string) {
    const mailOptions = {
        from: `"FlashCred" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Recuperação de Senha - FlashCred',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #0f172a; margin: 0;">FlashCred</h1>
                    <p style="color: #64748b; margin: 4px 0 0;">Tecnologia em Financiamento</p>
                </div>
                
                <h2 style="color: #0f172a;">Olá, ${clientName}!</h2>
                <p style="color: #475569; line-height: 1.6;">
                    Recebemos uma solicitação para redefinir a senha da sua conta no FlashCred. 
                    Se você não solicitou isso, pode ignorar este e-mail com segurança.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                        Redefinir Minha Senha
                    </a>
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 32px;">
                    Este link expira em 1 hora.<br>
                    Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:<br>
                    <span style="color: #3b82f6;">${resetLink}</span>
                </p>
                
                <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;">
                <p style="color: #cbd5e1; font-size: 10px; text-align: center;">
                     ${new Date().getFullYear()} FlashCred. Todos os direitos reservados.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return false;
    }
}

/**
 * Envia um e-mail genérico (usado para alertas e relatórios)
 */
export async function sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
        from: `"FlashCred System" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Erro ao enviar e-mail genérico:', error);
        return false;
    }
}
