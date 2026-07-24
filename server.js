const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const app = express();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tu-contraseña-app'
  }
});

const RECIPIENT_EMAIL = 'josemanuelpruebas1981@gmail.com';
const APP_URL = 'https://udlpa23.github.io/academia-francesa';

async function sendLessonReminder() {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'academia-francesa@gmail.com',
    to: RECIPIENT_EMAIL,
    subject: '🎓 Academia Francesa - Tu lección de hoy está lista',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #378ADD 0%, #2563eb 100%); padding: 40px; border-radius: 10px; color: white; text-align: center;">
        <h1 style="font-size: 32px; margin-bottom: 20px;">🎓 Academia Francesa</h1>
        <p style="font-size: 20px; margin-bottom: 30px;">¡Es hora de tu lección!</p>
        <p style="font-size: 16px; margin-bottom: 40px;">Hoy a las 6:00 AM es el momento perfecto para aprender francés.</p>
        
        <a href="${APP_URL}" style="display: inline-block; background: white; color: #378ADD; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; margin-bottom: 30px;">
          ▶️ ABRIR MI LECCIÓN
        </a>
        
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 30px 0;">
        
        <p style="font-size: 14px; opacity: 0.9;">
          Curso de francés A2 - Para emprendedores en Senegal<br>
          Profesor: Especialista en educación y negocios
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${RECIPIENT_EMAIL}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

cron.schedule('0 6 * * *', () => {
  console.log('🔔 Enviando recordatorio...');
  sendLessonReminder();
}, {
  timezone: 'Atlantic/Canary'
});

app.get('/test-email', async (req, res) => {
  await sendLessonReminder();
  res.json({ message: 'Email de prueba enviado' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🔔 Recordatorios a las 6:00 AM (Canarias)`);
  console.log(`📧 Emails a: ${RECIPIENT_EMAIL}`);
});
