import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.DATABASE_URL); // uses DATABASE_URL from Netlify env
    const { email } = await req.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert email into database
    // Create table if not exists (run this manually first in your database):
    // CREATE TABLE IF NOT EXISTS email_subscribers (
    //   id SERIAL PRIMARY KEY,
    //   email VARCHAR(255) UNIQUE NOT NULL,
    //   subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    // );
    
    await sql`
      INSERT INTO email_subscribers (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `;

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you! We will notify you.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error saving email:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save email. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/save-email"
};
