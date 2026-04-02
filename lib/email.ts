import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@smartkos.com'; // fallback if env is missing

interface PaymentNotificationProps {
  userName: string;
  userEmail: string;
  kamarNomor: string;
  durasiSewa: number;
  totalHarga: number;
}

export async function sendAdminPaymentNotification(data: PaymentNotificationProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipped sending email notification.");
    return false;
  }

  const { userName, userEmail, kamarNomor, durasiSewa, totalHarga } = data;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4F46E5; border-bottom: 2px solid #eee; padding-bottom: 10px;">Pesanan & Pembayaran Baru 🔔</h2>
      <p style="font-size: 16px; color: #333;">Halo Admin,</p>
      <p style="font-size: 16px; color: #333;">Ada calon penghuni baru yang telah melakukan pemesanan kamar dan mengunggah bukti pembayaran.</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #111;">Detail Pesanan:</h3>
        <table style="width: 100%; text-align: left; border-collapse: collapse;">
          <tr>
            <th style="padding: 8px 0; border-bottom: 1px solid #ddd; width: 35%;">Nama Penghuni</th>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">${userName}</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; border-bottom: 1px solid #ddd;">Email Penghuni</th>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${userEmail}</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; border-bottom: 1px solid #ddd;">Kamar</th>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #0284c7;">${kamarNomor}</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; border-bottom: 1px solid #ddd;">Durasi Sewa</th>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${durasiSewa} Bulan</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; border-bottom: 1px solid #ddd;">Total Tagihan</th>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd; color: #e11d48; font-weight: bold;">
              Rp ${totalHarga.toLocaleString("id-ID")}
            </td>
          </tr>
        </table>
      </div>

      <p style="font-size: 16px; color: #333;">
        Silakan login ke panel admin Smart-Kos untuk segera memeriksa bukti transfer dan menyetujui atau menolak pesanan ini.
      </p>

      <div style="margin-top: 30px; text-align: center;">
        <a href="https://smart-kos.vercel.app/admin/verifikasi" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Masuk ke Panel Verifikasi</a>
      </div>
      
      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 40px;">
        Email otomatis dari Sistem Smart-Kos
      </p>
    </div>
  `;

  try {
    const receiverEmails = ADMIN_EMAIL.split(",").map((e) => e.trim());

    const data = await resend.emails.send({
      from: 'Smart-Kos Notifikasi <onboarding@resend.dev>', // You can change this to a custom domain later
      to: receiverEmails,
      subject: `Konfirmasi Pembayaran: Kamar ${kamarNomor} - ${userName}`,
      html: htmlTemplate,
    });

    return data;
  } catch (error) {
    console.error("Resend Email Error:", error);
    return false;
  }
}
