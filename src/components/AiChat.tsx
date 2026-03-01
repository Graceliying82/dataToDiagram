import { useState, useRef, useEffect } from 'react';
import type { DiagramSpec } from '../types/diagram';
import type { DataSet } from '../types/data';
import type { ProviderType } from '../ai/provider';
import { createProvider } from '../ai/provider';
import { refineSpec } from '../ai/specAgent';

interface AiChatProps {
  data: DataSet;
  spec: DiagramSpec;
  onSpecChange: (spec: DiagramSpec) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY_API = 'dataToDiagram_apiKey';
const STORAGE_KEY_PROVIDER = 'dataToDiagram_provider';

export function AiChat({ data, spec, onSpecChange }: AiChatProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY_API) || '');
  const [providerType, setProviderType] = useState<ProviderType>(
    () => (localStorage.getItem(STORAGE_KEY_PROVIDER) as ProviderType) || 'claude',
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(!apiKey);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveConfig = () => {
    localStorage.setItem(STORAGE_KEY_API, apiKey);
    localStorage.setItem(STORAGE_KEY_PROVIDER, providerType);
    setShowConfig(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !apiKey || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const provider = createProvider(providerType, apiKey);
      const result = await refineSpec(provider, data, spec, userMsg);

      if (result.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Could not apply change: ${result.error}` }]);
      } else {
        onSpecChange(result.spec);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Done! I updated the diagram.' }]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : String(err)}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 flex flex-col h-80">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 text-sm">AI Assistant</h3>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          {showConfig ? 'Hide' : 'Settings'}
        </button>
      </div>

      {showConfig && (
        <div className="p-3 border-b border-gray-200 space-y-2 bg-white">
          <div className="flex gap-2">
            <select
              value={providerType}
              onChange={(e) => setProviderType(e.target.value as ProviderType)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="claude">Claude</option>
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
            </select>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button onClick={saveConfig} className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600">
              Save
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-6">
            Ask the AI to refine your diagram. For example:<br />
            "Change the colors to a warm palette"<br />
            "Switch to a treemap to show hierarchy"<br />
            "Make the font larger and hide the legend"
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-indigo-500 text-white'
                : 'bg-white border border-gray-200 text-gray-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 text-gray-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-2 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={apiKey ? 'Describe what to change...' : 'Set your API key first'}
            disabled={!apiKey || loading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={!apiKey || loading || !input.trim()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 disabled:opacity-50 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
