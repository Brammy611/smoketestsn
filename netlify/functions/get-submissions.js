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
    const [mainSubmissions] = await sql`
      SELECT id, email, subscribed_at as timestamp, 'main' as source 
      FROM email_subscribers 
      ORDER BY subscribed_at DESC
    `;
    
    const [sh2Submissions] = await sql`
      SELECT id, email, submitted_at as timestamp, 'sh2' as source 
      FROM sh2_submissions 
      ORDER BY submitted_at DESC
    `;
    
    const [sh3Submissions] = await sql`
      SELECT id, email, submitted_at as timestamp, 'sh3' as source 
      FROM sh3_submissions 
      ORDER BY submitted_at DESC
    `;

    // Get counts
    const [mainCount] = await sql`SELECT COUNT(*) as count FROM email_subscribers`;
    const [sh2Count] = await sql`SELECT COUNT(*) as count FROM sh2_submissions`;
    const [sh3Count] = await sql`SELECT COUNT(*) as count FROM sh3_submissions`;

    return new Response(JSON.stringify({
      success: true,
      data: {
        submissions: {
          main: mainSubmissions || [],
          sh2: sh2Submissions || [],
          sh3: sh3Submissions || []
        },
        counts: {
          main: mainCount?.count || 0,
          sh2: sh2Count?.count || 0,
          sh3: sh3Count?.count || 0,
          total: (mainCount?.count || 0) + (sh2Count?.count || 0) + (sh3Count?.count || 0)
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
