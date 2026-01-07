import { Building2 } from 'lucide-react';

interface BusinessInfoProps {
  formData: {
    companyName: string;
    businessCategory: string;
    supportPhone: string;
    businessEmail: string;
    operatingHoursStart: string;
    operatingHoursEnd: string;
  };
  onChange: (field: string, value: string) => void;
}

export function BusinessInfo({ formData, onChange }: BusinessInfoProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        <Building2 className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Business Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            placeholder="ABC Insurance Company"
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Category
          </label>
          <select
            value={formData.businessCategory}
            onChange={(e) => onChange('businessCategory', e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          >
            <option value="">Select a category</option>
            <option value="Insurance">Insurance</option>
            <option value="Real Estate">Real Estate</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Support Phone Number
            </label>
            <input
              type="tel"
              value={formData.supportPhone}
              onChange={(e) => onChange('supportPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Email
            </label>
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(e) => onChange('businessEmail', e.target.value)}
              placeholder="support@company.com"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Operating Hours
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              value={formData.operatingHoursStart}
              onChange={(e) => onChange('operatingHoursStart', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            <input
              type="time"
              value={formData.operatingHoursEnd}
              onChange={(e) => onChange('operatingHoursEnd', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">
            This information is used by the AI agent to introduce your business on calls.
          </p>
        </div>
      </div>
    </div>
  );
}
