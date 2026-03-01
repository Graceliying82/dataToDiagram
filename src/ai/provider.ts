import type { LLMMessage } from './types';

export type { LLMMessage };

export interface LLMProvider {
  name: string;
  chat(messages: LLMMessage[]): Promise<string>;
}

export class ClaudeProvider implements LLMProvider {
  name = 'Claude';
  apiKey: string;
  model: string;

  constructor(apiKey: string, model: string = 'claude-sonnet-4-20250514') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<string> {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        system: messages.filter(m => m.role === 'system').map(m => m.content).join('\n'),
        messages: messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Claude API error: ${err}`);
    }

    const data = await resp.json();
    return data.content[0].text;
  }
}

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI';
  apiKey: string;
  model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<string> {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`OpenAI API error: ${err}`);
    }

    const data = await resp.json();
    return data.choices[0].message.content;
  }
}

export class GeminiProvider implements LLMProvider {
  name = 'Gemini';
  apiKey: string;
  model: string;

  constructor(apiKey: string, model: string = 'gemini-2.0-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(messages: LLMMessage[]): Promise<string> {
    // Gemini uses a different format: system instruction + contents
    const systemParts = messages.filter(m => m.role === 'system').map(m => m.content);
    const contents = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: systemParts.length > 0
            ? { parts: [{ text: systemParts.join('\n') }] }
            : undefined,
          contents,
          generationConfig: { maxOutputTokens: 4096 },
        }),
      },
    );

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Gemini API error: ${err}`);
    }

    const data = await resp.json();
    return data.candidates[0].content.parts[0].text;
  }
}

export type ProviderType = 'claude' | 'openai' | 'gemini';

export function createProvider(type: ProviderType, apiKey: string): LLMProvider {
  switch (type) {
    case 'claude': return new ClaudeProvider(apiKey);
    case 'openai': return new OpenAIProvider(apiKey);
    case 'gemini': return new GeminiProvider(apiKey);
  }
}
