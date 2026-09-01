// Email sending helper with EmailJS primary and SMTP fallback (nodemailer)
import nodemailer from 'nodemailer';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PRIVATE_KEY;
const OTP_TEMPLATE = process.env.EMAILJS_OTP_TEMPLATE_ID || 'otp_template';
const RESET_TEMPLATE = process.env.EMAILJS_RESET_TEMPLATE_ID || 'reset_template';
const ORDER_CONFIRM_TEMPLATE = process.env.EMAILJS_ORDER_CONFIRM_TEMPLATE_ID || OTP_TEMPLATE;
const ORDER_DELIVERED_TEMPLATE = process.env.EMAILJS_ORDER_DELIVERED_TEMPLATE_ID || OTP_TEMPLATE;

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || `no-reply@${(process.env.NEXT_PUBLIC_SITE_URL || 'localhost').replace(/https?:\/\//, '')}`;

async function sendEmailjs(body: Record<string, unknown>) {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('EmailJS send failed', res.status, txt);
      return { ok: false, status: res.status, error: txt };
    }

    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('EmailJS request error', message);
    return { ok: false, error: message };
  }
}

function generateOtpHtml(otp: string, to: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const accent = '#F97316';
  const brand = 'Ditvi Crochet';
  const support = process.env.SUPPORT_EMAIL || 'support@ditvicrochet.example';
  const logoUrl = `${siteUrl.replace(/\/$/, '')}/logo/favicon_io/favicon-32x32.png`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${brand} — Your OTP</title>
    <style>
      body{font-family:Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f6f7fb; margin:0; padding:20px}
      .card{max-width:680px;margin:20px auto;background:#fff;border-radius:12px;padding:28px;box-shadow:0 8px 30px rgba(15,23,42,0.06)}
      .brand{display:flex;align-items:center;gap:12px;color:${accent};font-weight:700;font-size:20px}
      .otp{font-size:28px;letter-spacing:8px;font-weight:800;margin:18px 0;color:#111;background:linear-gradient(90deg,#fff,#fff);padding:12px 18px;border-radius:8px;display:inline-block}
      .muted{color:#6b7280}
      .cta{display:inline-block;margin-top:16px;padding:10px 14px;background:${accent};color:#fff;border-radius:8px;text-decoration:none}
      .footer{margin-top:20px;color:#9ca3af;font-size:12px}
      img.logo{width:40px;height:40px;border-radius:6px}
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand"><img class="logo" src="${logoUrl}" alt="logo" />${brand}</div>
      <p class="muted">Hi ${to},</p>
      <p>Use the OTP below to verify your email and complete your account setup on <strong>${brand}</strong>:</p>
      <div class="otp">${otp}</div>
      <p class="muted">This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.</p>
      <p>If you did not request this, please ignore this message or contact us at ${support}.</p>
      <div class="footer">${brand} • <a href="${siteUrl}">${siteUrl}</a></div>
    </div>
  </body>
</html>`;
}

function generateOtpHtmlInlined(otp: string, to: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const brand = process.env.NEXT_PUBLIC_SITE_TITLE || 'Ditvi Crochet';
  const support = process.env.SUPPORT_EMAIL || 'support@ditvicrochet.example';
  const logoUrl = `${siteUrl.replace(/\/$/, '')}/logo/favicon_io/favicon-32x32.png`;

  // Inline styles for maximum email client compatibility (values from globals.css)
  const bg = '#FFF9FB';
  const white = '#FFFFFF';
  const primary = '#F8BBD0';
  const accent = '#E8A0B5';
  const darkText = '#4A3A40';
  const mediumGray = '#D5C2C9';

  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="margin:0;padding:20px;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${darkText};-webkit-font-smoothing:antialiased;">` +
    `<div style="max-width:680px;margin:18px auto;background:${white};border-radius:14px;padding:26px;box-shadow:0 10px 30px rgba(74,58,64,0.08);border:1px solid ${mediumGray};">` +
    `<div style="display:flex;align-items:center;gap:12px">` +
    `<img src="${logoUrl}" alt="${brand} logo" style="width:48px;height:48px;border-radius:10px;object-fit:cover"/>` +
    `<div style="font-weight:700;font-size:18px;color:${darkText}">${brand}</div>` +
    `</div>` +
    `<p style="margin-top:14px;color:#59484a;font-size:15px;line-height:1.5">Hello ${to},</p>` +
    `<p style="color:#59484a;font-size:15px;line-height:1.5">Use the verification code below to complete your sign in or sign up on <strong>${brand}</strong>.</p>` +
    `<div style="display:inline-block;margin:18px 0;padding:12px 18px;border-radius:10px;background:linear-gradient(180deg,${primary},${white});border:1px solid ${accent};font-weight:800;font-size:28px;letter-spacing:8px;color:${darkText}">${otp}</div>` +
    `<p style="color:#746161;font-size:13px;margin-top:8px">This code expires in 10 minutes. Never share this code with anyone.</p>` +
    `<a href="${siteUrl}" style="display:inline-block;margin-top:16px;padding:10px 14px;background:${accent};color:${white};text-decoration:none;border-radius:8px;font-weight:600">Return to site</a>` +
    `<p style="margin-top:20px;color:#9b858a;font-size:13px">If you didn't request this, ignore this email or contact us at <a href="mailto:${support}" style="color:#9b858a">${support}</a>.</p>` +
    `<p style="font-size:11px;color:#c9b6b9;margin-top:8px">© ${brand} • <a href="${siteUrl}" style="color:#c9b6b9;text-decoration:none">${siteUrl}</a></p>` +
    `</div></body></html>`;
}

async function sendViaSmtp(to: string, subject: string, html: string, text?: string) {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return { ok: false, error: 'smtp-not-configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      text: text || `Your OTP is ${html.replace(/<[^>]+>/g, '')}`,
      html,
    });

    console.log('SMTP send success', info.messageId);
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('SMTP send error', message);
    return { ok: false, error: message };
  }
}

export async function sendOtpEmail(to: string, otp: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const html = generateOtpHtml(otp, to);
  const inlinedHtml = generateOtpHtmlInlined(otp, to);

  // Try EmailJS first if configured
  if (EMAILJS_SERVICE_ID && EMAILJS_USER_ID) {
    // Provide a rich set of template parameters to let EmailJS render the themed HTML
    const res = await sendEmailjs({
      service_id: EMAILJS_SERVICE_ID,
      template_id: OTP_TEMPLATE,
      user_id: EMAILJS_USER_ID,
      template_params: {
        to_email: to,
        otp,
        site_url: siteUrl,
        support_email: process.env.SUPPORT_EMAIL || 'support@ditvicrochet.example',
        brand_name: process.env.NEXT_PUBLIC_SITE_TITLE || 'Ditvi Crochet',
        logo_url: `${siteUrl.replace(/\/$/, '')}/logo/favicon_io/favicon-32x32.png`,
        html: inlinedHtml,
      },
    });
    if (res.ok) return { ok: true };
    console.warn('EmailJS failed for OTP, falling back to SMTP if configured', res.error || res);
  } else {
    console.warn('EmailJS not configured — will attempt SMTP fallback');
  }

  // Fallback: try SMTP
  const smtpRes = await sendViaSmtp(to, `Your ${process.env.NEXT_PUBLIC_SITE_URL || 'Ditvi Crochet'} verification code`, inlinedHtml, `Your OTP is ${otp}`);
  if (smtpRes.ok) return { ok: true, via: 'smtp' };

  return { ok: false, error: 'all-mail-methods-failed', details: { emailjs: EMAILJS_SERVICE_ID ? 'attempted' : 'skipped', smtp: smtpRes } };
}

export async function sendResetEmail(to: string, resetLink: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const html = `<p>Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request this, ignore.</p>`;

  if (EMAILJS_SERVICE_ID && EMAILJS_USER_ID) {
    const res = await sendEmailjs({ service_id: EMAILJS_SERVICE_ID, template_id: RESET_TEMPLATE, user_id: EMAILJS_USER_ID, template_params: { to_email: to, reset_link: resetLink, site_url: siteUrl } });
    if (res.ok) return { ok: true };
    console.warn('EmailJS reset failed, falling back to SMTP', res.error || res);
  }

  return sendViaSmtp(to, 'Reset your password', html, `Reset link: ${resetLink}`);
}

export async function sendOrderConfirmEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  itemsSummary: string;
  receiptUrl: string;
}) {
  const html = `<h3>Order Confirmed</h3><p>Hi ${params.customerName},</p><p>Your order <strong>${params.orderNumber}</strong> has been confirmed. Total: ₹${params.totalAmount.toFixed(2)}</p><p>Items: ${params.itemsSummary}</p><p><a href="${params.receiptUrl}">View receipt</a></p>`;
  if (EMAILJS_SERVICE_ID && EMAILJS_USER_ID) {
    const res = await sendEmailjs({ service_id: EMAILJS_SERVICE_ID, template_id: ORDER_CONFIRM_TEMPLATE, user_id: EMAILJS_USER_ID, template_params: { to_email: params.to, customer_name: params.customerName, order_number: params.orderNumber, total_amount: `₹${params.totalAmount.toFixed(2)}`, items_summary: params.itemsSummary, receipt_url: params.receiptUrl } });
    if (res.ok) return { ok: true };
    console.warn('EmailJS order confirm failed, falling back to SMTP', res.error || res);
  }

  return sendViaSmtp(params.to, `Order ${params.orderNumber} Confirmed`, html, `Your order ${params.orderNumber} confirmed. Total: ₹${params.totalAmount.toFixed(2)}`);
}

export async function sendOrderDeliveredEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
}) {
  const html = `<h3>Your order has been delivered</h3><p>Hi ${params.customerName},</p><p>Your order <strong>${params.orderNumber}</strong> has been marked as delivered. Thank you!</p>`;
  if (EMAILJS_SERVICE_ID && EMAILJS_USER_ID) {
    const res = await sendEmailjs({ service_id: EMAILJS_SERVICE_ID, template_id: ORDER_DELIVERED_TEMPLATE, user_id: EMAILJS_USER_ID, template_params: { to_email: params.to, customer_name: params.customerName, order_number: params.orderNumber } });
    if (res.ok) return { ok: true };
    console.warn('EmailJS delivered failed, falling back to SMTP', res.error || res);
  }

  return sendViaSmtp(params.to, `Order ${params.orderNumber} Delivered`, html, `Your order ${params.orderNumber} has been delivered.`);
}
