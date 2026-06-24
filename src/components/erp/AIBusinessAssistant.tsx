import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Bot, Send, Brain, ChevronRight, BarChart3, 
  TrendingUp, AlertTriangle, FileSpreadsheet, Loader2, RefreshCw 
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Props {
  isAr: boolean;
  erpData?: {
    revenueToday?: number;
    revenueMonth?: number;
    revenueYear?: number;
    netProfit?: number;
    projectsCount?: number;
    inquiriesCount?: number;
    inventoryAlerts?: number;
    outstandingCustomers?: number;
    outstandingSuppliers?: number;
  };
}

export default function AIBusinessAssistant({ isAr, erpData }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isAr 
        ? 'أهلاً بك في المساعد الذكي لمجلس إدارة "يافطة". أنا جاهز لتحليل التدفقات النقدية، مبيعات المشاريع، التنبؤ بحركة الخامات وتقديم تقارير جدوى متقدمة. اختر أحد التحليلات السريعة في الأسفل أو اكتب سؤالك مخصصاً!'
        : 'Welcome to YAFTA Executive Control Copilot. I am initialized with real-time sales pipelines, profit ledgers, and raw material warehouse catalogs. Select a diagnostic below or query me directly.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzingAction, setAnalyzingAction] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Contextual Signage manufacturing metrics to feed the prompt
  const baseERPContext = erpData || {
    revenueToday: 18500,
    revenueMonth: 142000,
    revenueYear: 1680000,
    netProfit: 55300,
    projectsCount: 14,
    inquiriesCount: 38,
    inventoryAlerts: 3,
    outstandingCustomers: 39000,
    outstandingSuppliers: 45700
  };

  const executeActionAnalysis = async (action: 'sales' | 'profits' | 'inventory' | 'summary') => {
    setLoading(true);
    setAnalyzingAction(action);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action,
          data: baseERPContext
        })
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'Unknown Error');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isAr 
            ? 'عذراً، حدث خطأ أثناء تشغيل خوارزميات الذكاء الاصطناعي. يرجى التحقق من اتصال الإنترنت ومفاتيح الرموز السرية.' 
            : `AI diagnostic routing failed: ${err.message || 'Check connection status.'}`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
      setAnalyzingAction(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue;
    setInputValue('');
    setLoading(true);

    // Append user query
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: userText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          data: {
            userPrompt: userText,
            erpContext: baseERPContext
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isAr ? 'خطأ في الاتصال بالخادم الذكي.' : `Error: ${err.message}`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      
      {/* QUICK LAUNCH AI ACTIONS */}
      <div className="bg-neutral-950 border border-gold-500/10 p-5 rounded-2xl space-y-4">
        <h4 className="text-xs font-black text-white flex items-center gap-2 justify-end">
          <span>{isAr ? 'تقارير وتحليلات الأعمال الذكية بنقرة واحدة (Gemini 3.5)' : 'One-Tap AI Executive Synthesizers'}</span>
          <Brain className="w-4 h-4 text-gold-505" />
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          
          <button
            onClick={() => executeActionAnalysis('summary')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-gold-505 text-white font-bold flex flex-row-reverse items-center justify-between transition-all cursor-pointer"
          >
            <Bot className="w-5 h-5 text-gold-505 shrink-0" />
            <div className="text-right">
              <span>{isAr ? 'تقرير الأداء العام للمجلس' : 'C-Level Summary'}</span>
              <span className="block text-[10px] text-zinc-500 font-semibold mt-0.5">{isAr ? 'دمج الإيرادات والمطالبات المعلقة' : 'Outstanding ledger risk check'}</span>
            </div>
          </button>

          <button
            onClick={() => executeActionAnalysis('sales')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-gold-505 text-white font-bold flex flex-row-reverse items-center justify-between transition-all cursor-pointer"
          >
            <BarChart3 className="w-5 h-5 text-gold-505 shrink-0" />
            <div className="text-right">
              <span>{isAr ? 'تحليل مسار المبيعات والطلبات' : 'Sales Pipeline Audit'}</span>
              <span className="block text-[10px] text-zinc-500 font-semibold mt-0.5">{isAr ? 'تحليل تدفقات وعقود المشاريع' : 'Evaluate active lead conversions'}</span>
            </div>
          </button>

          <button
            onClick={() => executeActionAnalysis('profits')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-gold-505 text-white font-bold flex flex-row-reverse items-center justify-between transition-all cursor-pointer"
          >
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-right">
              <span>{isAr ? 'تقييم هوامش وصافي الأرباح' : 'Profit Margin Audit'}</span>
              <span className="block text-[10px] text-zinc-500 font-semibold mt-0.5">{isAr ? 'رصد تسريب وهوامش التكاليف' : 'Identify pricing leakages'}</span>
            </div>
          </button>

          <button
            onClick={() => executeActionAnalysis('inventory')}
            disabled={loading}
            className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-gold-505 text-white font-bold flex flex-row-reverse items-center justify-between transition-all cursor-pointer"
          >
            <AlertTriangle className="w-5 h-5 text-gold-505 shrink-0" />
            <div className="text-right">
              <span>{isAr ? 'التنبؤ باستهلاك المخزون والمواد' : 'Warehouse Forecaster'}</span>
              <span className="block text-[10px] text-zinc-500 font-semibold mt-0.5">{isAr ? 'جدولة مستويات الأمان للخامات' : 'Forecast safety restocking days'}</span>
            </div>
          </button>

        </div>
      </div>

      {/* ACTIVE CHAT WORKSPACE */}
      <div className="bg-neutral-950 border border-gold-500/10 rounded-2xl flex flex-col h-[500px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-neutral-900 p-4 border-b border-neutral-950 flex justify-between items-center flex-row-reverse text-right">
          <div className="flex gap-2.5 items-center flex-row-reverse">
            <div className="w-9 h-9 rounded-full bg-gold-950 border border-gold-505/30 flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-gold-505 animate-pulse" />
            </div>
            <div>
              <h5 className="text-xs font-black text-white">{isAr ? 'المستشار الذكي يافطة (مدعوم بـ Gemini 3.5)' : 'YAFTA Advisory Board Copilot'}</h5>
              <span className="text-[9px] text-emerald-400 block font-bold mt-0.5">● متصل وجاهز للتحليل</span>
            </div>
          </div>
          
          <button 
            onClick={() => setMessages([
              {
                role: 'assistant',
                content: isAr ? 'تمت إعادة تهيئة الذاكرة والسياق. كيف يمكنني مساعدتك الآن؟' : 'Memory reset. How can I assist you in your manufacturing metrics today?',
                timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
              }
            ])}
            className="p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-850 text-zinc-500 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Reset Context"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Chat Message Box */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-[85%] text-right ${
                msg.role === 'user' ? 'mr-auto flex-row' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Bot Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gold-950 border border-gold-505/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-gold-505" />
                </div>
              )}

              {/* Text Bubble */}
              <div className="space-y-1 text-right">
                <div 
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap font-semibold border ${
                    msg.role === 'user' 
                      ? 'bg-gold-505 text-black border-gold-505 rounded-tr-none' 
                      : 'bg-neutral-900 text-neutral-200 border-neutral-850 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="block text-[9px] text-zinc-500 mr-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
              <div className="w-7 h-7 rounded-full bg-gold-950 border border-gold-505/20 flex items-center justify-center shrink-0 mt-1">
                <Loader2 className="w-3.5 h-3.5 text-gold-505 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900 text-zinc-400 border border-neutral-850 rounded-tl-none flex items-center gap-2">
                <span className="animate-pulse font-black text-gold-505">
                  {analyzingAction 
                    ? (isAr ? 'جاري قراءة لوحات البيانات وإصدار التقرير...' : 'Running predictive business analytics...') 
                    : (isAr ? 'جاري استدعاء المعرفة التشغيلية الفنية...' : 'Consulting sign board catalog ledger...')}
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Form Sender */}
        <form onSubmit={handleSendMessage} className="p-4 bg-neutral-900 border-t border-neutral-950 flex gap-2">
          <input
            type="text"
            required
            disabled={loading}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isAr ? "اسأل المستشار عن الخامات، أسعار التوريد، وهوامش الأرباح..." : "Query copilot on margins, acrylic sourcing, or cladding cost offsets..."}
            className="flex-1 px-4 py-2.5 bg-neutral-950 border border-neutral-850 focus:border-gold-505 focus:outline-none rounded-xl text-xs text-white font-bold placeholder-zinc-600"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="p-2.5 bg-gold-505 text-black rounded-xl hover:bg-gold-400 disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </form>

      </div>

    </div>
  );
}
