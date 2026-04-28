import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const resend = new Resend(process.env.RESEND_API_KEY);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESOURCES = {
  'brand-voice-framework': {
    file: 'brand-voice-framework.pdf',
    name: 'Brand Voice Framework',
    subject: 'Your Brand Voice Framework is here',
    preview: 'The 3-pillar system to build a brand AI can\'t replicate.',
  },
  'brand-audit-checklist': {
    file: 'brand-audit-checklist.pdf',
    name: 'Brand Audit Checklist',
    subject: 'Your Brand Audit Checklist is here',
    preview: 'Find out if AI would classify your brand as signal — or noise.',
  },
  'content-pillars-template': {
    file: 'content-pillars-template.pdf',
    name: 'Content Pillars Template',
    subject: 'Your Content Pillars Template is here',
    preview: 'Map out the topics your brand owns. Stop posting randomly.',
  },
  'ai-brand-voice-prompts': {
    file: 'ai-brand-voice-prompts.pdf',
    name: 'AI Brand Voice Prompt Pack',
    subject: 'Your AI Brand Voice Prompt Pack is here',
    preview: '15 prompts to make AI write in your voice — not a generic AI voice.',
  },
  'instagram-carousel-formula': {
    file: 'instagram-carousel-formula.pdf',
    name: 'Instagram Carousel Formula',
    subject: 'Your Instagram Carousel Formula is here',
    preview: 'The exact 7-slide structure behind every carousel that compounds.',
  },
  'positioning-swipe-file': {
    file: 'positioning-swipe-file.pdf',
    name: 'Brand Positioning Swipe File',
    subject: 'Your Brand Positioning Swipe File is here',
    preview: 'Real positioning statements that work. Steal the structure, not the words.',
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, resource } = req.body;

  if (!email || !resource) return res.status(400).json({ error: 'Missing email or resource' });

  const meta = RESOURCES[resource];
  if (!meta) return res.status(400).json({ error: 'Unknown resource' });

  // Load PDF
  const pdfPath = path.join(__dirname, '..', 'public', 'pdfs', meta.file);
  let pdfBuffer;
  try {
    pdfBuffer = fs.readFileSync(pdfPath);
  } catch (e) {
    console.error('PDF not found:', pdfPath);
    return res.status(500).json({ error: 'Resource file not found' });
  }

  // Send email via Resend
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Isaac @ Rewire Your Brand <hello@rewireyourbrand.com>',
      to: email,
      subject: meta.subject,
      html: emailHTML(meta),
      attachments: [{
        filename: meta.file,
        content: pdfBuffer,
      }],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function emailHTML(meta) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#080C18;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080C18;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#0D1326;border-radius:12px 12px 0 0;border-bottom:3px solid #3B82F6;padding:28px 36px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#3B82F6;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="font-family:Helvetica,Arial,sans-serif;font-weight:900;font-size:18px;color:#fff;line-height:36px;">R</span>
              </td>
              <td style="padding-left:12px;font-size:13px;font-weight:600;color:#fff;letter-spacing:0.05em;">REWIRE YOUR BRAND</td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#0D1326;padding:36px 36px 28px;border-radius:0 0 12px 12px;border:1px solid #1A2442;border-top:none;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#3B82F6;letter-spacing:0.1em;text-transform:uppercase;">Your free resource</p>
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#fff;line-height:1.2;">${meta.name}</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#8C9BB4;line-height:1.7;">${meta.preview}</p>
          <p style="margin:0 0 24px;font-size:15px;color:#8C9BB4;line-height:1.7;">
            It's attached to this email as a PDF. Open it, use it, and if you have questions — just reply here.
          </p>

          <table cellpadding="0" cellspacing="0" style="background:#111827;border-radius:10px;border:1px solid #1A2442;padding:20px 24px;width:100%;margin-bottom:28px;">
            <tr><td>
              <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#3B82F6;letter-spacing:0.08em;text-transform:uppercase;">While you're here</p>
              <p style="margin:0;font-size:14px;color:#8C9BB4;line-height:1.65;">
                If you want to go deeper — book a free 45-minute Brand Strategy Call. I'll audit your brand, identify the gaps, and leave you with a clear direction.
              </p>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px;">
            <tr><td align="center">
              <a href="https://api.leadconnectorhq.com/widget/bookings/rewireyourbrand"
                 style="display:inline-block;background:#3B82F6;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:8px;">
                Book a Free Strategy Call →
              </a>
            </td></tr>
          </table>

          <hr style="border:none;border-top:1px solid #1A2442;margin:0 0 20px;" />
          <p style="margin:0;font-size:12px;color:#4A5568;line-height:1.6;">
            Sent by Isaac De Persig · Rewire Your Brand<br />
            <a href="https://instagram.com/isaacdpersig" style="color:#3B82F6;text-decoration:none;">@isaacdpersig</a> on Instagram
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
