// AI.js (CommonJS version)
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
  - Donot export function.
  - Always use window.location.href for redirects or navigates.
  - Use only external image links as src for img.
  
  Here’s the UI description:
  
  ---
  ${description}
  ---
  
  🧠 Example Output (for a shopping layout):
  
  function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-blue-600">Hello from App!</h1>
      <p className="mt-4">Count: {count}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
  
  Now write the equivalent code for the description above:
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
  console.log('ai resp', content);
  return content.trim();
};

module.exports = generateComponentFromDescription;
