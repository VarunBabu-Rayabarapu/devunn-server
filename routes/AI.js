const fetch = require('node-fetch');

const AI_API_KEY = process.env.API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const generateComponentFromDescription = async (description) => {
  console.log('ai started');

  const prompt = `
You are a professional React developer.

Generate a complete standalone React functional component named **App** based on the following UI description. 

⚠️ Important constraints:
- Output only raw JSX code, wrapped in a default exported React component named "App".
- Use only **TailwindCSS** for styling. Do not include Tailwind config or CDN references — styling will be handled externally.
- Do not include \`\`\` or markdown formatting. Output only the pure JSX code.
- The component must be self-contained and runnable in an iframe.
- Avoid any dynamic imports or custom libraries — use only basic HTML elements and TailwindCSS.
- Don’t export the function explicitly (e.g. just use \`function App() {}\`, then \`export default App;\`).
- Always use \`window.location.href\` for redirects or navigations.
- Use only external image links as \`src\` for \`<img>\`.

You are allowed to assume that any required APIs already exist and are working and use,Use maximum number of api's to make page more functioning.

If the UI involves dynamic data or interactions (fetching, submitting, deleting), you must:
- Use \`fetch()\` calls for these.
- Simulate actual API interaction.

🧠 Example Output (for a simple counter with submit):

function App() {
  const [count, setCount] = React.useState(0);

  const handleSubmit = async () => {
    try {
      const res = await fetch('${process.env.HOST}/api/save-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      const data = await res.json();
      alert(data.status === 'ok' ? 'Saved!' : 'Failed to save');
    } catch (err) {
      console.error(err);
      alert('Error occurred.');
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-blue-600">Hello from App!</h1>
      <p className="mt-4">Count: {count}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded" onClick={handleSubmit}>
        Submit Count
      </button>
    </div>
  );
}

📦 This example uses a POST API called \`/api/save-count\`.

---

✍️ Output Format:

Return a valid JSON object like the following:
{
  "code": "<the full working JSX code as a string starting from function App () to the end of code>",
  "api": [
    ["<api endpoint excluding /api , example: /save-count>", <suitable method in capital letters like POST>, "This API receives a JSON payload with \`count\` and stores it in the database.Explain expected responses in different scenarios in detail and format of response data."]
  ]
}

Here’s the UI description:

---
${description}
---

Now generate the JSON response following the rules above.
Only output a valid JSON object.
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

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch (err) {
    console.error('Failed to parse AI JSON response:', content);
    throw new Error('AI response was not valid JSON.');
  }
};

module.exports = generateComponentFromDescription;
