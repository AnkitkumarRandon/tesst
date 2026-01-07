import { Bell, User, Phone } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Phone className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">AI Call Center</span>
            </div>

            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Documents
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Calls
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Billing
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Settings
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
            </button>
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
