import { Phone, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PhoneNumberDisplayProps {
  phoneNumber: string;
}

export function PhoneNumberDisplay({ phoneNumber }: PhoneNumberDisplayProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const displayNumber = '+12706337678';

  const handleGenerateNumber = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50 rounded-lg p-8 shadow-xl">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Phone className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">Your AI Call Center Number</h2>
        </div>

        <div className="mt-6 mb-6">
          {!isGenerated ? (
            <button
              onClick={handleGenerateNumber}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg inline-flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  <span>Generate Phone Number</span>
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center space-x-4 bg-gray-900 px-8 py-4 rounded-lg border border-gray-700 animate-in fade-in">
              <span className="text-3xl font-bold text-white tracking-wider">
                {displayNumber}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-400">
          Share this number with your customers. All calls will be handled by your AI agent.
        </p>
      </div>
    </div>
  );
}
