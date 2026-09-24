import "server-only";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "ArtBlush <hello.artblush@gmail.com>";
const STUDIO_NOTIFY_EMAIL = process.env.ARTBLUSH_STUDIO_NOTIFY_EMAIL;

export function isEmailConfigured(): boolean {
  return resend !== null;
}

export interface OrderEmailLine {
  title: string;
  quantity: number;
  pricePaise: number;
}

export interface OrderEmailAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

function formatINR(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function renderOrderSummary(lines: OrderEmailLine[], totalPaise: number) {
  const rows = lines
    .map(
      (line) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8e2d3;font-size:14px;color:#1f1b15;">
            ${line.title}${line.quantity > 1 ? ` × ${line.quantity}` : ""}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e2d3;font-size:14px;color:#1f1b15;text-align:right;">
            ${formatINR(line.pricePaise * line.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      ${rows}
      <tr>
        <td style="padding:12px 0;font-size:14px;color:#1f1b15;"><strong>Total (incl. shipping)</strong></td>
        <td style="padding:12px 0;font-size:14px;color:#1f1b15;text-align:right;"><strong>${formatINR(totalPaise)}</strong></td>
      </tr>
    </table>`;
}

function renderShell(title: string, inner: string) {
  return `
    <div style="background:#f4efe6;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:560px;margin:0 auto;background:#fffdf9;border:1px solid #e8e2d3;padding:32px;">
        <p style="margin:0 0 4px;font-size:20px;color:#9b6b43;">ArtBlush</p>
        <p style="margin:0 0 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9b6b43;">Art, drawn with feeling</p>
        <h1 style="margin:0 0 16px;font-size:22px;color:#1f1b15;font-weight:400;">${title}</h1>
        ${inner}
      </div>
    </div>`;
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderReference,
  lines,
  totalPaise,
  address,
}: {
  to: string;
  customerName: string;
  orderReference: string;
  lines: OrderEmailLine[];
  totalPaise: number;
  address: OrderEmailAddress;
}): Promise<boolean> {
  if (!resend) return false;
  const addressHtml = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postalCode}`,
  ]
    .filter(Boolean)
    .join("<br/>");

  const html = renderShell(
    `Thank you, ${customerName}.`,
    `
      <p style="font-size:14px;line-height:1.7;color:#1f1b15;margin:0 0 24px;">
        Your order is confirmed and paid for. Each piece is one-of-one, drawn by
        hand and signed at the studio — it will ship framed within 7–10 days with a
        certificate of authenticity.
      </p>
      ${renderOrderSummary(lines, totalPaise)}
      <p style="font-size:14px;color:#1f1b15;margin:24px 0 4px;"><strong>Shipping to</strong></p>
      <p style="font-size:14px;line-height:1.6;color:#1f1b15;margin:0 0 24px;">${addressHtml}</p>
      <p style="font-size:14px;color:#1f1b15;margin:0 0 8px;">
        Order reference: <strong>${orderReference}</strong>
      </p>
      <p style="font-size:13px;line-height:1.7;color:#5f584c;margin:0;">
        We will email you tracking details as soon as your piece leaves the studio.
        Questions? Just reply to this email.
      </p>
    `,
  );

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || "hello.artblush@gmail.com",
      subject: `Your ArtBlush order ${orderReference} is confirmed`,
      html,
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<boolean> {
  if (!resend) return false;

  const html = renderShell(
    "Reset your password",
    `
      <p style="font-size:14px;line-height:1.7;color:#1f1b15;margin:0 0 16px;">
        Hello ${name},
      </p>
      <p style="font-size:14px;line-height:1.7;color:#1f1b15;margin:0 0 24px;">
        A request was received to reset your ArtBlush password. This link is
        valid for 30 minutes and can only be used once.
      </p>
      <p style="margin:0 0 24px;">
        <a href="${resetUrl}" style="display:inline-block;background:#9b6b43;color:#fffdf9;padding:12px 20px;text-decoration:none;border-radius:2px;">
          Reset password
        </a>
      </p>
      <p style="font-size:13px;line-height:1.7;color:#5f584c;margin:0;">
        If you did not ask for this, ignore this email — your password stays
        exactly as it is. If you need help, reply to this email and the studio
        will assist.
      </p>
    `,
  );

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || "hello.artblush@gmail.com",
      subject: "Reset your ArtBlush password",
      html,
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendShipmentNotification({
  to,
  customerName,
  orderReference,
  trackingNumber,
  trackingCarrier,
}: {
  to: string;
  customerName: string;
  orderReference: string;
  trackingNumber?: string;
  trackingCarrier?: string;
}): Promise<boolean> {
  if (!resend) return false;
  const tracking = trackingNumber
    ? `
      <p style="font-size:14px;color:#1f1b15;margin:16px 0 4px;"><strong>Tracking</strong></p>
      <p style="font-size:14px;color:#1f1b15;margin:0;">
        ${trackingCarrier ? `${trackingCarrier} · ` : ""}${trackingNumber}
      </p>`
    : "";

  const html = renderShell(
    `On its way, ${customerName}.`,
    `
      <p style="font-size:14px;line-height:1.7;color:#1f1b15;margin:0 0 24px;">
        Your artwork from order <strong>${orderReference}</strong> has left the
        studio, packed and ready. It usually arrives within a few days.
      </p>
      ${tracking}
      <p style="font-size:13px;line-height:1.7;color:#5f584c;margin:24px 0 0;">
        Thank you for trusting ArtBlush with a piece of your story. If anything
        needs attention, simply reply to this email.
      </p>
    `,
  );

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || "hello.artblush@gmail.com",
      subject: `Your ArtBlush order ${orderReference} has shipped`,
      html,
    });
    return true;
  } catch {
    return false;
  }
}

export async function notifyStudioOfCommission({
  name,
  email,
  phone,
  enquiryType,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  enquiryType: string;
  message: string;
}): Promise<boolean> {
  if (!resend || !STUDIO_NOTIFY_EMAIL) return false;

  const html = renderShell(
    `New enquiry — ${enquiryType}`,
    `
      <p style="font-size:14px;line-height:1.6;color:#1f1b15;margin:0 0 16px;">
        <strong>${name}</strong> · ${email}${phone ? ` · ${phone}` : ""}
      </p>
      <p style="font-size:14px;line-height:1.7;color:#1f1b15;margin:0;white-space:pre-wrap;">
        ${message}
      </p>
      <p style="font-size:13px;color:#5f584c;margin:24px 0 0;">
        Tracked in the admin Commissions tab
        (https://www.artblush.in/admin/commissions).
      </p>
    `,
  );

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: STUDIO_NOTIFY_EMAIL,
      subject: `ArtBlush: new enquiry — ${enquiryType}`,
      html,
    });
    return true;
  } catch {
    return false;
  }
}

export async function notifyStudioOfPaidOrder({
  customerName,
  customerEmail,
  orderReference,
  lines,
  totalPaise,
  address,
}: {
  customerName: string;
  customerEmail: string;
  orderReference: string;
  lines: OrderEmailLine[];
  totalPaise: number;
  address: OrderEmailAddress;
}): Promise<boolean> {
  if (!resend || !STUDIO_NOTIFY_EMAIL) return false;
  const addressHtml = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postalCode}`,
  ]
    .filter(Boolean)
    .join("<br/>");

  const html = renderShell(
    `New paid order ${orderReference}`,
    `
      <p style="font-size:14px;line-height:1.6;color:#1f1b15;margin:0 0 16px;">
        ${customerName} · ${customerEmail}
      </p>
      ${renderOrderSummary(lines, totalPaise)}
      <p style="font-size:14px;color:#1f1b15;margin:24px 0 4px;"><strong>Ship to</strong></p>
      <p style="font-size:14px;line-height:1.6;color:#1f1b15;margin:0;">${addressHtml}</p>
    `,
  );

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: STUDIO_NOTIFY_EMAIL,
      subject: `ArtBlush: new paid order ${orderReference}`,
      html,
    });
    return true;
  } catch {
    return false;
  }
}