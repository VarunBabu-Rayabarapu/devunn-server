const fetch = require('node-fetch');
const AI_API_KEY = process.env.API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const generateApiRoute = async (endpoint, type, description) => {
  const prompt = `
You are a professional Express.js backend developer.

Your task is to generate a single standalone Express route handler function in JavaScript without skipping anything, based on the provided endpoint and functional description. DB operations must be done. Use getCollection() to get collection from DB.

🧠 Output Format:
Return ONLY the handler function definition as JavaScript code, like this:

\`\`\`js
const handler = async (req, res) => {
  // your logic
};
module.exports = handler;
\`\`\`

⚠️ DO NOT:
- Use \`router.post\`, \`router.get\`, etc.
- Include markdown or comments around the code
- Export anything other than \`module.exports = handler;\`

💡 EXAMPLE:
If the description is:
"Endpoint: /signup
  API should accept email and password in req.body and return 'ok' if valid, or 400 if missing."

The expected output should be:

const handler = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  try {
    const usersCollection = getCollection('users');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: 'error', message: 'User already exists' });
    }

    await usersCollection.insertOne({ firstName, lastName, email, password });
    res.json({ status: 'ok', message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

---

Now write the handler code for:

Endpoint: ${endpoint}
Description: ${description}
Method: ${type}
  `.trim();

  const body = {
    model: 'openai/gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  return {
    endPoint: endpoint,
    type: type, // Or set dynamically if included
    code: content.trim().replace(/^```(?:js)?|```$/g, ''), // Strip markdown if present
  };
};

module.exports = generateApiRoute;
