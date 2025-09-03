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
    const tryGraphQL = async () => {
      const graphQlQuery = {
        query: `
          query userProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile { ranking reputation contributionPoints }
              submitStatsGlobal { acSubmissionNum { difficulty count } }
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
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify(graphQlQuery)
      });
      if (!resp.ok) throw new Error(`GraphQL ${resp.status}`);
      const json = await resp.json();
      const user = json?.data?.matchedUser;
      if (!user) throw new Error('User not found');

      const counts = user.submitStatsGlobal.acSubmissionNum || [];
      const total = counts.find(c => c.difficulty === 'All')?.count || 0;
      const easy = counts.find(c => c.difficulty === 'Easy')?.count || 0;
      const medium = counts.find(c => c.difficulty === 'Medium')?.count || 0;
      const hard = counts.find(c => c.difficulty === 'Hard')?.count || 0;
      return {
        totalSolved: total,
        easySolved: easy,
        mediumSolved: medium,
        hardSolved: hard,
        ranking: user.profile?.ranking ?? 'N/A',
        contributionPoints: user.profile?.contributionPoints ?? 0,
        reputation: user.profile?.reputation ?? 0
      };
    };

    const tryPublicAPIs = async () => {
      const endpoints = [
        `https://alfa-leetcode-api.onrender.com/user/${encodeURIComponent(username)}`,
        `https://leetcode-badge.vercel.app/api/users/${encodeURIComponent(username)}`,
        `https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(username)}`
      ];

      let lastError;
      for (const url of endpoints) {
        try {
          const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (!r.ok) throw new Error(`${url} ${r.status}`);
          const data = await r.json();
          // Normalize various shapes
          const result = {
            totalSolved: data.totalSolved || data.totalSolvedCount || data.solved || data.totalSolvedQuestions || 0,
            easySolved: data.easySolved || data.easySolvedCount || data.easy || 0,
            mediumSolved: data.mediumSolved || data.mediumSolvedCount || data.medium || 0,
            hardSolved: data.hardSolved || data.hardSolvedCount || data.hard || 0,
            ranking: data.ranking || data.rank || 'N/A',
            contributionPoints: data.contributionPoints || 0,
            reputation: data.reputation || 0
          };
          return result;
        } catch (e) {
          lastError = e;
          continue;
        }
      }
      throw lastError || new Error('All public APIs failed');
    };

    let result;
    try {
      result = await tryGraphQL();
    } catch (e) {
      result = await tryPublicAPIs();
    }

    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Server error' }) };
  }
};


