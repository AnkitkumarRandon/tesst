import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentActivationProps {
  onActivate: () => Promise<void>;
  isActivated: boolean;
}

export function PaymentActivation({ onActivate, isActivated }: PaymentActivationProps) {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleActivate = async () => {
    if (!cardHolder || !cardNumber || !expiry || !cvv) {
      return;
    }

    setProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    setSuccess(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    await onActivate();
  };

  if (isActivated) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
        <div className="flex items-center justify-center space-x-2 text-green-400 mb-4">
          <CheckCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">AI Agent Activated</h2>
        </div>
        <p className="text-center text-gray-400">
          Your AI call center is now active and ready to handle customer calls.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Payment & Activation</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, '');
              if (value.length <= 16 && /^\d*$/.test(value)) {
                setCardNumber(value.replace(/(\d{4})/g, '$1 ').trim());
              }
            }}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) {
                  if (value.length >= 2) {
                    setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
                  } else {
                    setExpiry(value);
                  }
                }
              }}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVV
            </label>
            <input
              type="password"
              value={cvv}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 3 && /^\d*$/.test(value)) {
                  setCvv(value);
                }
              }}
              placeholder="123"
              maxLength={3}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleActivate}
          disabled={processing || success || !cardHolder || !cardNumber || !expiry || !cvv}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          {processing ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying payment...</span>
            </span>
          ) : success ? (
            <span className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Payment Successful – AI Agent Activated</span>
            </span>
          ) : (
            'Verify & Activate AI Call Agent'
          )}
        </button>
      </div>
    </div>
  );
}
