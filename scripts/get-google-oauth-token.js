/**
 * Google OAuth Token Generator
 *
 * This script helps you get a refresh token with Gmail + Calendar scopes.
 *
 * Prerequisites:
 * 1. Go to Google Cloud Console > APIs & Services > Credentials
 * 2. Create OAuth 2.0 Client ID (type: Web application)
 * 3. Add "http://localhost:3333/callback" to Authorized redirect URIs
 * 4. Enable Gmail API and Google Calendar API in APIs & Services > Library
 *
 * Usage:
 * 1. Set your credentials below
 * 2. Run: node scripts/get-google-oauth-token.js
 * 3. Open the URL in your browser
 * 4. Authorize with your Google account (ryan@firstserveseattle.com)
 * 5. Copy the refresh token to your Vercel environment variables
 */

const http = require('http');
const { google } = require('googleapis');
const url = require('url');

// ============================================
// SET YOUR CREDENTIALS HERE
// ============================================
const CLIENT_ID = process.env.GMAIL_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3333/api/auth/gmail/callback';

// Scopes for both Gmail sending and Calendar access
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar'
];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate the auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n========================================');
console.log('Google OAuth Token Generator');
console.log('========================================\n');

if (CLIENT_ID === 'YOUR_CLIENT_ID') {
  console.log('ERROR: Please set your CLIENT_ID and CLIENT_SECRET');
  console.log('\nYou can either:');
  console.log('1. Edit this file and replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET');
  console.log('2. Or run with env vars: GMAIL_CLIENT_ID=xxx GMAIL_CLIENT_SECRET=xxx node scripts/get-google-oauth-token.js\n');
  process.exit(1);
}

console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with ryan@firstserveseattle.com');
console.log('3. Click "Allow" to grant permissions');
console.log('4. You\'ll be redirected - the token will appear below\n');
console.log('Waiting for authorization...\n');

// Start a simple server to catch the callback
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/api/auth/gmail/callback') {
    const code = parsedUrl.query.code;

    if (code) {
      try {
        const { tokens } = await oauth2Client.getToken(code);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a472a;">Success!</h1>
              <p>Your refresh token has been generated. Check your terminal.</p>
              <p>You can close this window.</p>
            </body>
          </html>
        `);

        console.log('========================================');
        console.log('SUCCESS! Here are your tokens:');
        console.log('========================================\n');
        console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('\n========================================');
        console.log('\nAdd this to your Vercel environment variables:');
        console.log('1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables');
        console.log('2. Update GMAIL_REFRESH_TOKEN with the value above');
        console.log('3. Also add: GOOGLE_CALENDAR_ID=ryan@firstserveseattle.com');
        console.log('4. Redeploy your app');
        console.log('========================================\n');

        // Close server after a delay
        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1000);

      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error getting tokens: ' + error.message);
        console.error('Error:', error.message);
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('No authorization code received');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(3333, () => {
  console.log('Server listening on http://localhost:3333');
});
