const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

// Configurer OAuth2
const oauth2Client = new google.auth.OAuth2(
  '247289513383-8aee7278b1atk4svh80cajcddsirjhjl.apps.googleusercontent.com', // Remplacez par votre CLIENT_ID
  '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', // Remplacez par votre CLIENT_SECRET
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: '1//047y5py-6eU-OCgYIARAAGAQSNwF-L9IrwgM0JwFoZ9kKL6Qr-uUPtpE-RnF_myktMn4zAbP2cWJAu-ALAgK6eXx-Fhw3iLTr3Ks', // Remplacez par votre REFRESH_TOKEN
});

// Route pour envoyer un email de confirmation
router.post('/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email du destinataire requis' });
  }

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'malekfeki18@gmail.com',
        clientId: '247289513383-8aee7278b1atk4svh80cajcddsirjhjl.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//047y5py-6eU-OCgYIARAAGAQSNwF-L9IrwgM0JwFoZ9kKL6Qr-uUPtpE-RnF_myktMn4zAbP2cWJAu-ALAgK6eXx-Fhw3iLTr3Ks',
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'malekfeki18@gmail.com',
      to: email,
      subject: 'Candidature envoyée',
      text: 'Votre candidature a bien été envoyée ! Bonne chance.',
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email:', error);
    res.status(500).json({ error: 'Erreur lors de l’envoi de l’email' });
  }
});

module.exports = router;
