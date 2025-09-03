exports.handler = async (event) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8888',
    'http://localhost:5173',
    'https://adityasuryanshiportfolio2.netlify.app',
    'https://adisuryawanshiportfolio2.netlify.app'
  ];

  const origin = event.headers.origin || '';
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { username } = event.queryStringParameters || {};
    if (!username) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'username is required' }) };
    }

    const graphQlQuery = {
      query: `
        query userProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              reputation
              contributionPoints
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username }
    };

    const resp = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://leetcode.com/',
        'Origin': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(graphQlQuery)
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return { statusCode: resp.status || 502, headers, body: JSON.stringify({ error: 'LeetCode API error', details: text }) };
    }

    const json = await resp.json();
    const user = json?.data?.matchedUser;
    if (!user) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'User not found' }) };
    }

    const counts = user.submitStatsGlobal.acSubmissionNum || [];
    const total = counts.find(c => c.difficulty === 'All')?.count || 0;
    const easy = counts.find(c => c.difficulty === 'Easy')?.count || 0;
    const medium = counts.find(c => c.difficulty === 'Medium')?.count || 0;
    const hard = counts.find(c => c.difficulty === 'Hard')?.count || 0;

    const result = {
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      ranking: user.profile?.ranking ?? 'N/A',
      contributionPoints: user.profile?.contributionPoints ?? 0,
      reputation: user.profile?.reputation ?? 0
    };

    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Server error' }) };
  }
};


