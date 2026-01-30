import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Get all submissions from all three tables
    const mainSubmissions = await sql`
      SELECT id, email, subscribed_at as timestamp, 'main' as source 
      FROM email_subscribers 
      ORDER BY subscribed_at DESC
    `;
    
    const sh2Submissions = await sql`
      SELECT id, email, submitted_at as timestamp, 'sh2' as source 
      FROM sh2_submissions 
      ORDER BY submitted_at DESC
    `;
    
    const sh3Submissions = await sql`
      SELECT id, email, submitted_at as timestamp, 'sh3' as source 
      FROM sh3_submissions 
      ORDER BY submitted_at DESC
    `;

    // Get counts
    const mainCountResult = await sql`SELECT COUNT(*) as count FROM email_subscribers`;
    const sh2CountResult = await sql`SELECT COUNT(*) as count FROM sh2_submissions`;
    const sh3CountResult = await sql`SELECT COUNT(*) as count FROM sh3_submissions`;
    
    const mainCount = mainCountResult[0]?.count || 0;
    const sh2Count = sh2CountResult[0]?.count || 0;
    const sh3Count = sh3CountResult[0]?.count || 0;

    return new Response(JSON.stringify({
      success: true,
      data: {
        submissions: {
          main: mainSubmissions || [],
          sh2: sh2Submissions || [],
          sh3: sh3Submissions || []
        },
        counts: {
          main: Number(mainCount),
          sh2: Number(sh2Count),
          sh3: Number(sh3Count),
          total: Number(mainCount) + Number(sh2Count) + Number(sh3Count)
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch submissions',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/api/get-submissions"
};
