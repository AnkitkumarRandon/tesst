import { Bot } from 'lucide-react';

interface AIAgentConfigProps {
  config: {
    greetingMessage: string;
    responseTone: string;
    language: string;
    maxResponseLength: string;
  };
  onChange: (field: string, value: string) => void;
}

export function AIAgentConfig({ config, onChange }: AIAgentConfigProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        <Bot className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">AI Call Agent Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Greeting Message
          </label>
          <textarea
            value={config.greetingMessage}
            onChange={(e) => onChange('greetingMessage', e.target.value)}
            placeholder="Hello, I am Rose from ABC Insurance. How can I help you today?"
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Response Tone
            </label>
            <select
              value={config.responseTone}
              onChange={(e) => onChange('responseTone', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Formal">Formal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select
              value={config.language}
              onChange={(e) => onChange('language', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Max Response Length
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={config.maxResponseLength === 'Short' ? 0 : config.maxResponseLength === 'Medium' ? 1 : 2}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                onChange('maxResponseLength', value === 0 ? 'Short' : value === 1 ? 'Medium' : 'Long');
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className={`${config.maxResponseLength === 'Short' ? 'text-cyan-400 font-medium' : 'text-gray-400'}`}>
                Short
              </span>
              <span className={`${config.maxResponseLength === 'Medium' ? 'text-cyan-400 font-medium' : 'text-gray-400'}`}>
                Medium
              </span>
              <span className={`${config.maxResponseLength === 'Long' ? 'text-cyan-400 font-medium' : 'text-gray-400'}`}>
                Long
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">
            These settings control how your AI agent speaks to customers.
          </p>
        </div>
      </div>
    </div>
  );
}
