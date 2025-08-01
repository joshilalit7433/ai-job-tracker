import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Type for Groq LLM API response
 */
interface GroqLLMResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Calls the Groq LLM with a given prompt and returns the content.
 * @param prompt The input prompt for the LLM
 * @returns The response content from the model
 */
export async function callGroqLLM(prompt: string): Promise<string> {
  try {
    const response = await axios.post<GroqLLMResponse>(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'qwen/qwen3-32b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("Groq API call failed:", error.message);
    throw new Error("Failed to call Groq LLM");
  }
}
