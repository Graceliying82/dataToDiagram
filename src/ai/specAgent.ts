import type { DiagramSpec } from '../types/diagram';
import type { DataSet } from '../types/data';
import type { LLMProvider, LLMMessage } from './provider';
import { buildSystemPrompt } from './promptTemplates';

export async function refineSpec(
  provider: LLMProvider,
  data: DataSet,
  currentSpec: DiagramSpec,
  userMessage: string,
): Promise<{ spec: DiagramSpec; error?: string }> {
  const systemPrompt = buildSystemPrompt(data, currentSpec);

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await provider.chat(messages);

    // Extract JSON from response (handle possible markdown wrapping)
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);

    if (parsed.error) {
      return { spec: currentSpec, error: parsed.error };
    }

    // Validate required fields
    if (!parsed.type || !parsed.mappings || !parsed.style) {
      return { spec: currentSpec, error: 'AI returned an incomplete spec.' };
    }

    return { spec: parsed as DiagramSpec };
  } catch (err) {
    return {
      spec: currentSpec,
      error: `Failed to parse AI response: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
