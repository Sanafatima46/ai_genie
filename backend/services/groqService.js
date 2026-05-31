/**
 * Groq chat completions (ported from Career-Guidance-ChatBot-main/careerBot.py)
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

async function chatCompletion({
  messages,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  maxTokens = 800,
  jsonMode = false,
}) {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  if (!apiKey) {
    const err = new Error(
      'GROQ_API_KEY is not configured. Add it to backend/.env and restart the server.'
    );
    err.statusCode = 503;
    throw err;
  }

  const body = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.error?.message || 'Groq API request failed');
    err.statusCode = response.status >= 400 && response.status < 600 ? response.status : 502;
    throw err;
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    const err = new Error('Empty response from Groq');
    err.statusCode = 502;
    throw err;
  }

  return content;
}

module.exports = { chatCompletion, DEFAULT_MODEL };
