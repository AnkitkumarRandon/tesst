import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { BusinessInfo } from './components/BusinessInfo';
import { KnowledgeUpload } from './components/KnowledgeUpload';
import { AIAgentConfig } from './components/AIAgentConfig';
import { PaymentActivation } from './components/PaymentActivation';
import { PhoneNumberDisplay } from './components/PhoneNumberDisplay';
import { LiveCallActivity } from './components/LiveCallActivity';
import { supabase } from './lib/supabase';

function App() {
  const [businessData, setBusinessData] = useState({
    companyName: '',
    businessCategory: '',
    supportPhone: '',
    businessEmail: '',
    operatingHoursStart: '09:00',
    operatingHoursEnd: '17:00',
  });

  const [agentConfig, setAgentConfig] = useState({
    greetingMessage: 'Hello, how can I assist you today?',
    responseTone: 'Professional',
    language: 'English',
    maxResponseLength: 'Medium',
  });

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    status: 'processing' | 'indexed' | 'ready';
    progress: number;
  } | null>(null);

  const [isActivated, setIsActivated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [callMetrics, setCallMetrics] = useState({
    currentCalls: 0,
    totalCallsToday: 0,
    missedCalls: 0,
    avgDuration: '0:00',
  });

  const [callActivities, setCallActivities] = useState([
    {
      id: '1',
      message: 'System initialized – Ready to receive calls',
      time: 'Just now',
      type: 'answered' as const,
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      setBusinessData({
        companyName: profile.company_name || '',
        businessCategory: profile.business_category || '',
        supportPhone: profile.support_phone || '',
        businessEmail: profile.business_email || '',
        operatingHoursStart: profile.operating_hours_start || '09:00',
        operatingHoursEnd: profile.operating_hours_end || '17:00',
      });

      const { data: config } = await supabase
        .from('ai_agent_configs')
        .select('*')
        .eq('business_id', profile.id)
        .maybeSingle();

      if (config) {
        setAgentConfig({
          greetingMessage: config.greeting_message,
          responseTone: config.response_tone,
          language: config.language,
          maxResponseLength: config.max_response_length,
        });
      }

      const { data: payment } = await supabase
        .from('payment_status')
        .select('*')
        .eq('business_id', profile.id)
        .maybeSingle();

      if (payment && payment.is_active) {
        setIsActivated(true);
        setPhoneNumber(payment.phone_number);
      }

      const { data: docs } = await supabase
        .from('knowledge_documents')
        .select('*')
        .eq('business_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (docs) {
        setUploadedFile({
          name: docs.file_name,
          status: docs.status as 'processing' | 'indexed' | 'ready',
          progress: docs.upload_progress,
        });
      }
    }
  };

  const handleBusinessChange = async (field: string, value: string) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let profile = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile.data) {
      const { data } = await supabase
        .from('business_profiles')
        .insert({ user_id: user.id })
        .select()
        .single();
      profile.data = data;
    }

    if (profile.data) {
      await supabase
        .from('business_profiles')
        .update({
          company_name: field === 'companyName' ? value : businessData.companyName,
          business_category: field === 'businessCategory' ? value : businessData.businessCategory,
          support_phone: field === 'supportPhone' ? value : businessData.supportPhone,
          business_email: field === 'businessEmail' ? value : businessData.businessEmail,
          operating_hours_start: field === 'operatingHoursStart' ? value : businessData.operatingHoursStart,
          operating_hours_end: field === 'operatingHoursEnd' ? value : businessData.operatingHoursEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.data.id);
    }
  };

  const handleAgentConfigChange = async (field: string, value: string) => {
    setAgentConfig(prev => ({ ...prev, [field]: value }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      const { data: config } = await supabase
        .from('ai_agent_configs')
        .select('*')
        .eq('business_id', profile.id)
        .maybeSingle();

      if (!config) {
        await supabase
          .from('ai_agent_configs')
          .insert({
            business_id: profile.id,
            greeting_message: field === 'greetingMessage' ? value : agentConfig.greetingMessage,
            response_tone: field === 'responseTone' ? value : agentConfig.responseTone,
            language: field === 'language' ? value : agentConfig.language,
            max_response_length: field === 'maxResponseLength' ? value : agentConfig.maxResponseLength,
          });
      } else {
        await supabase
          .from('ai_agent_configs')
          .update({
            greeting_message: field === 'greetingMessage' ? value : agentConfig.greetingMessage,
            response_tone: field === 'responseTone' ? value : agentConfig.responseTone,
            language: field === 'language' ? value : agentConfig.language,
            max_response_length: field === 'maxResponseLength' ? value : agentConfig.maxResponseLength,
            updated_at: new Date().toISOString(),
          })
          .eq('id', config.id);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      const { data } = await supabase
        .from('knowledge_documents')
        .insert({
          business_id: profile.id,
          file_name: file.name,
          status: 'processing',
          upload_progress: 0,
        })
        .select()
        .single();

      if (data) {
        setUploadedFile({
          name: file.name,
          status: 'processing',
          progress: 0,
        });

        for (let i = 0; i <= 100; i += 20) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setUploadedFile(prev => prev ? { ...prev, progress: i } : null);

          await supabase
            .from('knowledge_documents')
            .update({ upload_progress: i })
            .eq('id', data.id);
        }

        await supabase
          .from('knowledge_documents')
          .update({ status: 'indexed' })
          .eq('id', data.id);

        setUploadedFile(prev => prev ? { ...prev, status: 'indexed' } : null);

        await new Promise(resolve => setTimeout(resolve, 1500));

        await supabase
          .from('knowledge_documents')
          .update({ status: 'ready' })
          .eq('id', data.id);

        setUploadedFile(prev => prev ? { ...prev, status: 'ready' } : null);
      }
    }
  };

  const handleActivation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      const generatedNumber = `+1 437 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;

      await supabase
        .from('payment_status')
        .insert({
          business_id: profile.id,
          is_active: true,
          phone_number: generatedNumber,
          activated_at: new Date().toISOString(),
        });

      setIsActivated(true);
      setPhoneNumber(generatedNumber);

      setCallMetrics({
        currentCalls: 0,
        totalCallsToday: 0,
        missedCalls: 0,
        avgDuration: '0:00',
      });

      simulateCallActivity();
    }
  };

  const simulateCallActivity = () => {
    setTimeout(() => {
      const newActivity = {
        id: Date.now().toString(),
        message: `Incoming call from +91 ${Math.floor(10000 + Math.random() * 90000)} XXXXX – Answered by AI`,
        time: 'Just now',
        type: 'incoming' as const,
      };
      setCallActivities(prev => [newActivity, ...prev].slice(0, 10));
      setCallMetrics(prev => ({
        ...prev,
        currentCalls: 1,
        totalCallsToday: prev.totalCallsToday + 1,
      }));

      setTimeout(() => {
        const questionActivity = {
          id: (Date.now() + 1).toString(),
          message: 'User asked about service pricing – Answered from FAQ',
          time: 'Just now',
          type: 'answered' as const,
        };
        setCallActivities(prev => [questionActivity, ...prev].slice(0, 10));

        setTimeout(() => {
          const endActivity = {
            id: (Date.now() + 2).toString(),
            message: 'Call ended – Duration: 2m 15s',
            time: 'Just now',
            type: 'ended' as const,
          };
          setCallActivities(prev => [endActivity, ...prev].slice(0, 10));
          setCallMetrics(prev => ({
            ...prev,
            currentCalls: 0,
            avgDuration: '2:15',
          }));
        }, 3000);
      }, 2000);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Call Center Dashboard</h1>
          <p className="text-gray-400">Configure your AI phone agent and manage customer calls</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BusinessInfo formData={businessData} onChange={handleBusinessChange} />
          <KnowledgeUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AIAgentConfig config={agentConfig} onChange={handleAgentConfigChange} />
          <PaymentActivation onActivate={handleActivation} isActivated={isActivated} />
        </div>

        {isActivated && phoneNumber && (
          <div className="mb-6">
            <PhoneNumberDisplay phoneNumber={phoneNumber} />
          </div>
        )}

        {isActivated && (
          <LiveCallActivity metrics={callMetrics} activities={callActivities} />
        )}
      </main>
    </div>
  );
}

export default App;
