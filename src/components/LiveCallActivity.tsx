import { Phone, Clock, PhoneOff, Activity } from 'lucide-react';

interface CallActivity {
  id: string;
  message: string;
  time: string;
  type: 'incoming' | 'answered' | 'ended';
}

interface LiveCallActivityProps {
  metrics: {
    currentCalls: number;
    totalCallsToday: number;
    missedCalls: number;
    avgDuration: string;
  };
  activities: CallActivity[];
}

export function LiveCallActivity({ metrics, activities }: LiveCallActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <Phone className="w-4 h-4 text-cyan-400" />;
      case 'answered': return <Activity className="w-4 h-4 text-green-400" />;
      case 'ended': return <PhoneOff className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6">Live Call Activity</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Calls</p>
                <p className="text-2xl font-bold text-white">{metrics.currentCalls}</p>
              </div>
              <Phone className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Calls Today</p>
                <p className="text-2xl font-bold text-white">{metrics.totalCallsToday}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Missed Calls</p>
                <p className="text-2xl font-bold text-white">{metrics.missedCalls}</p>
              </div>
              <PhoneOff className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg. Duration</p>
                <p className="text-2xl font-bold text-white">{metrics.avgDuration}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Recent Activity
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
