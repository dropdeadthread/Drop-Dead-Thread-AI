import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // since this is a desktop app
});

export async function askOpenAI(prompt: string) {
  const chat = await openai.chat.completions.create({
    model: "gpt-4", // or "gpt-3.5-turbo"
    messages: [{ role: "user", content: prompt }],
  });
  return chat.choices[0]?.message?.content || "No response.";
}
