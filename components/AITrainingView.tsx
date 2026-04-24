'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Save, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck,
  Zap,
  Clock,
  ChevronRight,
  Info,
  QrCode,
  Wifi,
  WifiOff,
  LogOut,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Send,
  User,
  Settings,
  Database,
  History,
  LayoutDashboard,
  Target,
  Quote,
  AlertCircle,
  X
} from 'lucide-react';
import { aiService } from '../services/supabaseService';
import { whatsAppService, WhatsAppStatus } from '../services/whatsAppService';
import { AIAgentSettings, AIAgentLearning, AIKnowledgeItem, DiffPart } from '../types';
import { toast } from 'react-hot-toast';

type Tab = 'dashboard' | 'identity' | 'knowledge' | 'training' | 'history' | 'whatsapp';

export function AITrainingView() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [settings, setSettings] = useState<AIAgentSettings | null>(null);
  const [learnings, setLearnings] = useState<AIAgentLearning[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<AIKnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [processingCoach, setProcessingCoach] = useState(false);
  
  // Coaching State
  const [coachFeedback, setCoachFeedback] = useState('');
  const [reviewLearning, setReviewLearning] = useState<AIAgentLearning | null>(null);
  
  // Knowledge Base Form
  const [isAddingFact, setIsAddingFact] = useState(false);
  const [newFact, setNewFact] = useState({ content: '', category: 'Regra de Negócio' });

  // WhatsApp States
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Sandbox State
  const [sandboxMessages, setSandboxMessages] = useState<any[]>([]);
  const [sandboxInput, setSandboxInput] = useState('');

  useEffect(() => {
    fetchData();
    checkWhatsappConnection();
  }, []);

  // Auto-scroll para o final do simulador
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sandboxMessages, simulating]);

  const checkWhatsappConnection = async () => {
    try {
      setCheckingStatus(true);
      const status = await whatsAppService.getStatus();
      setWhatsappStatus(status);
      
      if (status.state === 'CONNECTED') {
        setQrCode(null);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão WhatsApp:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (qrCode && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (qrCode && countdown === 0) {
      handleConnectWhatsapp(); // Auto refresh
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [qrCode, countdown]);

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
    if (qrCode) {
      pollingInterval = setInterval(async () => {
        try {
          const status = await whatsAppService.getStatus();
          if (status.state === 'CONNECTED') {
            setWhatsappStatus(status);
            setQrCode(null);
            setCountdown(0);
            toast.success('Raul está agora Online!');
            if (pollingInterval) clearInterval(pollingInterval);
          }
        } catch (error) {
          console.error('Erro no polling do WhatsApp:', error);
        }
      }, 3000);
    }
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [qrCode]);

  const handleConnectWhatsapp = async () => {
    try {
      setConnecting(true);
      const response = await whatsAppService.getQrCode();
      if (response && response.base64) {
        setQrCode(response.base64);
        setCountdown(30);
        if (!qrCode) toast.success('QR Code gerado!');
      } else {
        toast.error('Erro ao gerar QR Code. Tente novamente.');
      }
    } catch (error) {
      toast.error('Falha ao iniciar conexão');
    } finally {
      setConnecting(false);
    }
  };

  const confirmDisconnect = async () => {
    try {
      setDisconnecting(true);
      await whatsAppService.logout();
      setWhatsappStatus({ state: 'DISCONNECTED', status: 'offline' });
      setQrCode(null);
      toast.success('WhatsApp desconectado!');
      setShowDisconnectModal(false);
    } catch (error) {
      toast.error('Erro ao desconectar');
    } finally {
      setDisconnecting(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, learningsData, knowledgeData] = await Promise.all([
        aiService.getSettings(),
        aiService.getLearnings(),
        aiService.getKnowledgeBase()
      ]);
      setSettings(settingsData);
      setLearnings(learningsData);
      setKnowledgeBase(knowledgeData);
    } catch (error) {
      console.error('Erro ao carregar dados da IA:', error);
      toast.error('Erro ao carregar dados do Agente');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      await aiService.saveSettings(settings);
      toast.success('Configurações atualizadas!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLearning = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await aiService.updateLearningStatus(id, status);
      toast.success(status === 'approved' ? 'Aprendizado aprovado!' : 'Aprendizado arquivado');
      fetchData();
    } catch (error) {
      toast.error('Erro ao processar aprendizado');
    }
  };

  const handleAddKnowledge = async () => {
    if (!newFact.content.trim()) return;
    try {
      setSaving(true);
      await aiService.saveKnowledgeItem({
          content: newFact.content,
          category: newFact.category,
          isActive: true
      });
      toast.success('Fato adicionado à base de conhecimento!');
      setNewFact({ content: '', category: 'Regra de Negócio' });
      setIsAddingFact(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao salvar fato');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    try {
        await aiService.deleteKnowledgeItem(id);
        toast.success('Fato removido');
        fetchData();
    } catch (error) {
        toast.error('Erro ao remover');
    }
  };

  const handleRevert = async (learningId: string) => {
    try {
      setLoading(true);
      await aiService.revertLearning(learningId);
      toast.success('Instruções revertidas com sucesso!');
      await fetchData();
    } catch (error: any) {
      toast.error('Erro ao reverter: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCoachProcess = async () => {
    if (!coachFeedback.trim() || !settings) return;
    
    try {
        setProcessingCoach(true);
        const response = await fetch('/api/ai/coach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                feedback: coachFeedback,
                currentPrompt: settings.coreInstructions
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // Save as a pending learning
        await aiService.saveLearning({
            observation: data.observation,
            suggestedRule: data.suggested_prompt,
            reasoning: data.reasoning,
            status: 'pending'
        });

        toast.success('Sugestão de melhoria gerada! Role para baixo para revisar.');
        setCoachFeedback('');
        fetchData();
    } catch (error: any) {
        toast.error('Erro ao processar treinamento: ' + error.message);
    } finally {
        setProcessingCoach(false);
    }
  };

  const handleSandboxSend = async () => {
    if (!sandboxInput.trim() || simulating) return;
    
    const userInput = sandboxInput;
    const userMsg = { role: 'user', text: userInput };
    setSandboxMessages(prev => [...prev, userMsg]);
    setSandboxInput('');
    setSimulating(true);
    
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userInput,
                history: sandboxMessages, // Envia o histórico de mensagens
                settings: settings, // Usa as configurações ATUAIS da tela (mesmo sem salvar)
                knowledgeBase: knowledgeBase
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        setSandboxMessages(prev => [...prev, { 
            role: 'ai', 
            text: data.text 
        }]);
    } catch (error: any) {
        toast.error('Erro na simulação');
        setSandboxMessages(prev => [...prev, { 
            role: 'ai', 
            text: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente em instantes.' 
        }]);
    } finally {
        setSimulating(false);
    }
  };

  const applyTemplate = (personality: string, tone: string) => {
    if (!settings) return;
    setSettings({
        ...settings,
        personality,
        toneOfVoice: tone
    });
    toast.success('Aparência de personalidade aplicada! Não esqueça de salvar.');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
        <Sparkles className="w-8 h-8 animate-pulse text-[#19727d]" />
        <p className="font-medium">Sincronizando consciência do Raul...</p>
      </div>
    );
  }

  const pendingLearnings = learnings.filter(l => l.status === 'pending');
  const historyLearnings = learnings.filter(l => l.status === 'approved' || l.status === 'rejected').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      {/* 0. WELCOME BANNER (TOP COMPACT) */}
      <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 p-4 px-8 rounded-3xl text-white shadow-lg shadow-cyan-500/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 min-h-[5rem]">
        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">Bem vindo à Mente do Raul</h2>
            <p className="text-[10px] font-bold text-cyan-200/60 uppercase tracking-widest md:hidden">GPT-4o Mini</p>
          </div>
        </div>
        
        <div className="flex-1 text-xs font-medium opacity-80 relative z-10 text-center md:text-left leading-relaxed max-w-3xl hidden sm:block">
          Raul usa tecnologia GPT-4o Mini para entender seus clientes e vender com naturalidade. Mantenha a Base de Conhecimento atualizada para obter o máximo de conversão.
        </div>

        <div className="relative z-10 shrink-0 flex items-center gap-3">
          <span className="bg-white/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">
            Potencial Máximo
          </span>
          <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 opacity-30" />
          </div>
        </div>

        {/* Decoração de fundo sutil */}
        <Bot className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 -rotate-12" />
      </div>

      {/* 1. HEADER & STATUS DASHBOARD */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner ${settings?.isActive ? 'bg-cyan-500/10' : 'bg-slate-100 dark:bg-slate-900'}`}>
              <Bot className={`w-12 h-12 ${settings?.isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
            </div>
            {settings?.isActive && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Raul <span className="text-cyan-600 font-medium">IA</span></h1>
            <div className="flex items-center gap-3 mt-1">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${settings?.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {settings?.isActive ? 'Ativo' : 'Pausado'}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5"><Clock className="w-3 h-3" /> Última atualização {new Date(settings?.updatedAt || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
             <div className="hidden lg:grid grid-cols-2 gap-4 mr-4 border-r border-slate-100 dark:border-slate-700/50 pr-8">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Regras Ativas</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{learnings.filter(l => l.status === 'approved').length + knowledgeBase.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp</p>
                    <p className={`text-xl font-black ${whatsappStatus?.state === 'CONNECTED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {whatsappStatus?.state === 'CONNECTED' ? 'ON' : 'OFF'}
                    </p>
                </div>
             </div>
             <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-2 bg-slate-900 dark:bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/10 disabled:opacity-50"
             >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                SALVAR ALTERAÇÕES
             </button>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 w-fit mx-auto md:mx-0 shadow-sm">
        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
        <TabButton active={activeTab === 'identity'} onClick={() => setActiveTab('identity')} icon={<User className="w-4 h-4" />} label="Identidade" />
        <TabButton active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} icon={<Database className="w-4 h-4" />} label="Conhecimento" />
        <TabButton active={activeTab === 'training'} onClick={() => setActiveTab('training')} icon={<Brain className="w-4 h-4" />} label="Treinamento" badge={pendingLearnings.length} />
        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History className="w-4 h-4" />} label="Histórico IA" />
        <TabButton active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} icon={<MessageSquare className="w-4 h-4" />} label="WhatsApp" color={whatsappStatus?.state === 'CONNECTED' ? 'emerald' : 'rose'} />
      </div>

      {/* 3. TAB CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center text-cyan-600 shrink-0">
                                <Target className="w-8 h-8" />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white">Objetivo Atual</h3>
                                <p className="text-slate-500 text-sm mt-1 italic">
                                    "Vendedor amigável focado em converter leads de WhatsApp em vendas de viagens internacionais."
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                           <History className="w-4 h-4" /> Resumo de Atividades Recentes
                        </h3>
                        <div className="space-y-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/50 group hover:border-cyan-500/30 transition-all cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                            {i === 1 ? <CheckCircle2 className="text-emerald-500 w-5 h-5" /> : <Brain className="text-cyan-500 w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-gray-200">
                                                {i === 1 ? 'Nova regra aplicada com sucesso' : 'Sugestão de aprendizado recebida'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium">Há {i*2} horas • {i === 1 ? 'Conhecimento' : 'IA'}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: IDENTITY */}
            {activeTab === 'identity' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-cyan-600" /> Modelos Sugeridos
                                </h3>
                                <Info className="w-4 h-4 text-slate-300" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <TemplateCard 
                                    title="Vendedor Nato" 
                                    desc="Focado em fechamento e urgência."
                                    onClick={() => applyTemplate("Vendedor focado em conversão imediata, persistente mas educado.", "Persuasivo e Entusiasmado")}
                                />
                                <TemplateCard 
                                    title="Consultor Luxo" 
                                    desc="Atendimento premium e detalhista."
                                    onClick={() => applyTemplate("Consultor de viagens de alto padrão, detalhista e elegante.", "Sofisticado e Profissional")}
                                />
                                <TabButton active={false} onClick={() => applyTemplate("Amigável, rápido e utiliza muitos emojis.", "Descontraído e Moderno")} icon={<Sparkles className="w-4 h-4" />} label="Divertido" />
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50 dark:border-slate-700/50">
                            <div className="space-y-1.5 focus-within:scale-[1.01] transition-all">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-tighter">Personalidade Global</label>
                                <textarea 
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl min-h-[160px] text-sm focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium text-slate-700 dark:text-slate-300"
                                    value={settings?.personality || ''}
                                    onChange={(e) => setSettings(s => s ? {...s, personality: e.target.value} : null)}
                                    placeholder="Ex: Vendedor focado em milhas, comunicativo e organizado..."
                                />
                            </div>
                            <div className="space-y-1.5 focus-within:scale-[1.01] transition-all">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-tighter">Tom de Voz Humano</label>
                                <textarea 
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl min-h-[160px] text-sm focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold text-slate-700 dark:text-slate-300"
                                    value={settings?.toneOfVoice || ''}
                                    onChange={(e) => setSettings(s => s ? {...s, toneOfVoice: e.target.value} : null)}
                                    placeholder="Ex: Profissional, usa gírias de viagem, educado..."
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-tighter">Prompt Mestre de Atendimento</label>
                            <textarea 
                                className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl min-h-[250px] text-xs focus:ring-4 focus:ring-cyan-500/10 transition-all font-mono text-cyan-600 dark:text-cyan-400"
                                value={settings?.coreInstructions || ''}
                                onChange={(e) => setSettings(s => s ? {...s, coreInstructions: e.target.value} : null)}
                                placeholder="Regras operacionais críticas..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: KNOWLEDGE */}
            {activeTab === 'knowledge' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                             <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Base de Conhecimento</h3>
                                <p className="text-xs text-slate-400 font-medium">Cadastre fatos e regras que o Raul deve sempre lembrar.</p>
                             </div>
                             <button 
                                onClick={() => setIsAddingFact(!isAddingFact)}
                                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] shadow-lg shadow-cyan-500/20 transition-all"
                             >
                                <Plus className="w-4 h-4" /> NOVO FATO
                             </button>
                        </div>

                        {/* FORM: ADD FACT */}
                        {isAddingFact && (
                            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                         <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Conteúdo do Fato (O que o Raul deve saber)</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border-none text-sm shadow-sm"
                                                placeholder="Ex: Nosso PIX chave email: contato@easyfly.com..."
                                                value={newFact.content}
                                                onChange={(e) => setNewFact({...newFact, content: e.target.value})}
                                            />
                                         </div>
                                         <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Categoria</label>
                                            <select 
                                                className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border-none text-sm shadow-sm"
                                                value={newFact.category}
                                                onChange={(e) => setNewFact({...newFact, category: e.target.value})}
                                            >
                                                <option>Regra de Negócio</option>
                                                <option>Informação Financeira</option>
                                                <option>Procedimento Operacional</option>
                                                <option>FAQ de Clientes</option>
                                            </select>
                                         </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button onClick={() => setIsAddingFact(false)} className="px-6 py-2 text-xs font-bold text-slate-400">Cancelar</button>
                                        <button 
                                            onClick={handleAddKnowledge}
                                            disabled={!newFact.content.trim()}
                                            className="px-8 py-2 bg-slate-900 dark:bg-cyan-600 text-white rounded-xl text-xs font-black shadow-lg disabled:opacity-50"
                                        >
                                            ADICIONAR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {knowledgeBase.length === 0 ? (
                                <div className="py-20 text-center space-y-4">
                                    <Database className="w-12 h-12 text-slate-200 mx-auto" />
                                    <p className="text-slate-400 text-sm italic font-medium">Nenhum fato cadastrado. Comece adicionando o PIX ou horário de atendimento.</p>
                                </div>
                            ) : (
                                knowledgeBase.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl group border border-transparent hover:border-cyan-500/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                                <Quote className="w-4 h-4 text-cyan-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.content}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.category}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteKnowledge(item.id)}
                                            className="p-3 text-slate-300 hover:text-rose-500 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: TRAINING */}
            {activeTab === 'training' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white">Fila de Aprendizado Ativo</h3>
                                <p className="text-xs text-slate-400 font-medium">Situações reais onde o Raul sugeriu melhorias no próprio comportamento.</p>
                            </div>
                            <span className="bg-amber-100 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {pendingLearnings.length} Pendentes
                            </span>
                        </div>

                        {/* COACH INPUT */}
                        <div className="p-6 bg-cyan-50 dark:bg-cyan-900/10 rounded-[2rem] border border-cyan-100 dark:border-cyan-900/30 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-600/20">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white">O que o Raul deve aprender hoje?</h4>
                                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase">TREINADOR DE MENTE DO RAUL</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <textarea 
                                    className="flex-1 p-4 bg-white dark:bg-slate-900 rounded-2xl text-sm border-none shadow-sm focus:ring-2 focus:ring-cyan-500 h-24 resize-none transition-all"
                                    placeholder="Ex: 'Raul, seja mais enfático ao oferecer o Seguro Viagem assim que o cliente disser o destino...'"
                                    value={coachFeedback}
                                    onChange={(e) => setCoachFeedback(e.target.value)}
                                />
                                <button 
                                    onClick={handleCoachProcess}
                                    disabled={!coachFeedback.trim() || processingCoach}
                                    className="px-8 bg-slate-900 dark:bg-cyan-600 text-white rounded-2xl font-black text-xs shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex flex-col items-center justify-center gap-2"
                                >
                                    {processingCoach ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            PROCESSAR
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">O Raul analisará seu pedido e sugerirá uma reescrita organizada das instruções dele.</p>
                        </div>

                        {pendingLearnings.length === 0 ? (
                            <div className="py-20 text-center space-y-4">
                                <Sparkles className="w-12 h-12 text-slate-200 mx-auto" />
                                <p className="text-slate-400 text-sm font-medium italic">Tudo limpo! O Raul está operando conforme o planejado.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingLearnings.map(l => (
                                    <div key={l.id} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-cyan-600 uppercase">Observação da IA</p>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">"{l.observation}"</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button 
                                                    onClick={() => handleUpdateLearning(l.id, 'rejected')}
                                                    className="p-3 bg-white dark:bg-slate-800 text-rose-500 rounded-2xl hover:bg-rose-50 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => setReviewLearning(l)}
                                                    className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 px-6"
                                                >
                                                    <Sparkles className="w-5 h-5" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Revisar Mudança</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">💡 Nova Regra Sugerida:</p>
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                                                "{l.suggestedRule}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: HISTORY */}
            {activeTab === 'history' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Histórico de Consciência</h3>
                            <p className="text-xs text-slate-400 font-medium">Veja as evoluções do Raul e restaure versões anteriores se necessário.</p>
                        </div>

                        <div className="space-y-4">
                            {historyLearnings.length === 0 ? (
                                <div className="py-20 text-center space-y-4 opacity-40">
                                    <History className="w-12 h-12 text-slate-200 mx-auto" />
                                    <p className="text-slate-400 text-sm italic font-medium">Nenhuma mudança aplicada ainda.</p>
                                </div>
                            ) : (
                                historyLearnings.map(l => (
                                    <div key={l.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${l.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {l.status === 'approved' ? 'Aplicado' : 'Rejeitado'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {new Date(l.createdAt).toLocaleString('pt-BR')}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-black text-slate-700 dark:text-slate-200">{l.observation}</h4>
                                            {l.reasoning && (
                                                <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-2">
                                                    "{l.reasoning}"
                                                </p>
                                            )}
                                        </div>
                                        
                                        {l.status === 'approved' && l.previousInstructions && (
                                            <button 
                                                onClick={() => handleRevert(l.id)}
                                                className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-rose-500 transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                                REVERTER MUDANÇA
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: WHATSAPP */}
            {activeTab === 'whatsapp' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                             <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Conexão WhatsApp</h3>
                                <p className="text-xs text-slate-400 font-medium">Mantenha o Raul conectado para que ele possa responder clientes.</p>
                             </div>
                             <button onClick={checkWhatsappConnection} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all">
                                <RefreshCw className={`w-5 h-5 text-slate-400 ${checkingStatus ? 'animate-spin' : ''}`} />
                             </button>
                        </div>

                        {whatsappStatus?.state === 'CONNECTED' ? (
                            <div className="flex flex-col items-center py-10 space-y-6">
                                <div className="relative">
                                    <div className="w-32 h-32 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center">
                                        <Wifi className="w-16 h-16 text-emerald-500" />
                                    </div>
                                    <span className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-8 border-white dark:border-slate-800 rounded-full" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">Raul está Online</h4>
                                    <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-tight">Conectado via Evolution API Proxy</p>
                                </div>
                                <button 
                                    onClick={() => setShowDisconnectModal(true)}
                                    className="px-10 py-4 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-2xl font-black text-xs transition-all border border-rose-100"
                                >
                                    DESCONECTAR AGENTE
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-10 space-y-8">
                                {!qrCode ? (
                                    <>
                                        <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center grayscale text-slate-300">
                                            <WifiOff className="w-16 h-16" />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-xl font-black text-slate-800 dark:text-white">Raul está Desconectado</h4>
                                            <p className="text-sm text-slate-400 font-medium mt-1">Gere um QR Code e abra o WhatsApp no seu celular.</p>
                                        </div>
                                        <button 
                                            onClick={handleConnectWhatsapp}
                                            disabled={connecting}
                                            className="px-12 py-5 bg-cyan-600 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-cyan-500/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3"
                                        >
                                            {connecting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                                            GERAR QR CODE AGORA
                                        </button>
                                    </>
                                ) : (
                                    <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center space-y-6">
                                        <div className="bg-white p-6 rounded-[2.5rem] border-4 border-cyan-500/10 shadow-2xl relative overflow-hidden group">
                                            <img 
                                                src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`} 
                                                alt="WhatsApp QR Code" 
                                                className="w-56 h-56"
                                            />
                                            {countdown <= 5 && (
                                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                                                    <RefreshCw className="w-10 h-10 text-cyan-600 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 py-2 px-6 bg-slate-50 dark:bg-slate-900 rounded-full">
                                            <Clock className={`w-4 h-4 ${countdown <= 5 ? 'text-rose-500 animate-pulse' : 'text-cyan-500'}`} />
                                            <span className={`text-xs font-black uppercase tracking-widest ${countdown <= 5 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}>
                                                Expira em {countdown}s
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => { setQrCode(null); setCountdown(0); }}
                                            className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                                        >
                                            Cancelar Conexão
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* SIDE BAR: SIMULATOR (ALWAYS VISIBLE OR OVERLAY) */}
        <div className="lg:col-span-1 sticky top-8 h-[750px] max-h-[calc(100vh-8rem)]">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-2xl flex flex-col h-full overflow-hidden">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-black text-sm text-slate-800 dark:text-white tracking-widest uppercase">Simulador</h4>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSandboxMessages([])}
                            className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all group"
                            title="Resetar Conversa"
                        >
                            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-all duration-500" />
                        </button>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow" />
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
                >
                    {sandboxMessages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[90%] p-4 rounded-3xl text-xs font-medium leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-cyan-600 text-white rounded-tr-sm shadow-md' 
                                    : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 rounded-tl-sm border border-slate-100 dark:border-slate-800/50 shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-300 mt-1 uppercase font-black tracking-tighter">
                                {msg.role === 'user' ? 'Você' : 'Raul'}
                            </span>
                        </div>
                    ))}
                    {simulating && (
                         <div className="flex flex-col items-start animate-pulse">
                            <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-3xl rounded-tl-sm border border-slate-100 dark:border-slate-800/50">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </span>
                            </div>
                         </div>
                    )}
                    <div className="h-4" />
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-[1.5rem] flex items-center gap-2 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                        <input 
                            type="text" 
                            className="bg-transparent border-none focus:ring-0 text-xs px-4 flex-1 py-1 text-slate-700 dark:text-slate-300 font-medium"
                            placeholder="Teste uma frase..."
                            value={sandboxInput}
                            onChange={(e) => setSandboxInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSandboxSend()}
                        />
                        <button 
                            onClick={handleSandboxSend}
                            className="p-3 bg-cyan-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-4 text-center leading-relaxed italic">
                        Esta é uma prévia visual. As respostas são geradas com base na sua configuração atual de identidade.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* DISCONNECT MODAL */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-[2rem] flex items-center justify-center shadow-inner">
                <LogOut className="w-12 h-12 text-rose-500" />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Desconectar Raul?</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mt-2">
                    O Raul parará de atender seus clientes no WhatsApp imediatamente.
                  </p>
              </div>
              <div className="flex flex-col w-full gap-3 pt-4">
                <button 
                  onClick={confirmDisconnect}
                  disabled={disconnecting}
                  className="w-full py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2"
                >
                  {disconnecting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                  SIM, DESCONECTAR
                </button>
                <button 
                  onClick={() => setShowDisconnectModal(false)}
                  disabled={disconnecting}
                  className="w-full py-5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-sm transition-all"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW LEARNING */}
      {reviewLearning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                              <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800 dark:text-white">Revisar Melhoria do Raul</h3>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Nova Reescrita Sugerida</p>
                          </div>
                      </div>
                      <button onClick={() => setReviewLearning(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-400">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                      {/* RAZÃO DA MUDANÇA */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                          <h4 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                              <Info className="w-4 h-4" /> Raciocínio da IA
                          </h4>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
                              "{reviewLearning.reasoning}"
                          </p>
                      </div>

                      {/* COMPARATIVO */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase ml-2">Instruções Atuais</h4>
                              <div className="p-4 bg-rose-50/20 dark:bg-rose-900/5 rounded-2xl text-[10px] font-mono text-slate-500 h-64 overflow-y-auto border border-slate-100 dark:border-slate-800 whitespace-pre-wrap opacity-80">
                                  <DiffViewer 
                                      oldText={settings?.coreInstructions || ''} 
                                      newText={reviewLearning.suggestedRule} 
                                      type="removed" 
                                  />
                              </div>
                          </div>
                          <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-emerald-500 uppercase ml-2 flex items-center gap-2">
                                  <CheckCircle2 className="w-3 h-3" /> Nova Versão Sugerida
                              </h4>
                              <div className="p-4 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-2xl text-[10px] font-mono text-slate-800 dark:text-slate-200 h-64 overflow-y-auto border border-emerald-100 dark:border-emerald-900/30 shadow-inner whitespace-pre-wrap">
                                  <DiffViewer 
                                      oldText={settings?.coreInstructions || ''} 
                                      newText={reviewLearning.suggestedRule} 
                                      type="added" 
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> Atenção:
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                              Esta ação irá substituir as instruções atuais do Raul pela nova versão organizada. Você sempre pode voltar no histórico se necessário.
                          </p>
                      </div>
                  </div>

                  <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-4">
                      <button 
                          onClick={() => setReviewLearning(null)}
                          className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
                      >
                          CANCELAR
                      </button>
                      <button 
                          onClick={async () => {
                              await handleUpdateLearning(reviewLearning.id, 'approved');
                              setReviewLearning(null);
                              fetchData();
                          }}
                          className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                          <CheckCircle2 className="w-5 h-5" />
                          APLICAR MUDANÇA NO RAUL
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, badge, color = 'cyan' }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number, color?: string }) {
    const activeClasses = color === 'emerald' 
        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/10 scale-105' 
        : color === 'rose'
            ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/10 scale-105'
            : 'bg-slate-900 dark:bg-cyan-600 text-white shadow-xl shadow-cyan-500/10 scale-105';
            
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs transition-all ${
                active 
                    ? activeClasses
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
        >
            {icon}
            {label}
            {badge && badge > 0 ? (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${active ? 'bg-white text-slate-900' : 'bg-rose-500 text-white animate-pulse'}`}>{badge}</span>
            ) : null}
        </button>
    );
}

function TemplateCard({ title, desc, onClick }: { title: string, desc: string, onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-cyan-500/30 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group"
        >
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 mb-1">{title}</h4>
            <p className="text-[10px] text-slate-400 leading-tight font-medium">{desc}</p>
        </div>
    );
}

// Diff Component and Logic
function computeDiff(oldStr: string, newStr: string): DiffPart[] {
    // Treat empty strings as empty arrays to avoid errors
    const oldWords = oldStr ? oldStr.split(/(\s+)/).filter(w => w !== "") : [];
    const newWords = newStr ? newStr.split(/(\s+)/).filter(w => w !== "") : [];
    
    const n = oldWords.length;
    const m = newWords.length;

    // LCS Table (DP)
    // For very long strings, this might be memory intensive, but for prompt rules (~500-1000 words) it is fine.
    const matrix = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (oldWords[i - 1] === newWords[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1] + 1;
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }

    // Backtrack to build the diff result
    const result: DiffPart[] = [];
    let i = n;
    let j = m;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
            result.unshift({ value: oldWords[i - 1] });
            i--; j--;
        } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
            result.unshift({ value: newWords[j - 1], added: true });
            j--;
        } else {
            result.unshift({ value: oldWords[i - 1], removed: true });
            i--;
        }
    }

    return result;
}

function DiffViewer({ oldText, newText, type }: { oldText: string, newText: string, type: 'added' | 'removed' }) {
    const diff = computeDiff(oldText, newText);
    
    return (
        <span className="leading-relaxed">
            {diff.map((part, index) => {
                if (type === 'removed') {
                    if (part.added) return null;
                    if (part.removed) {
                        return (
                            <mark 
                                key={index} 
                                className="bg-rose-500/20 text-rose-700 dark:text-rose-400 px-0.5 rounded-sm line-through decoration-rose-500/50"
                            >
                                {part.value}
                            </mark>
                        );
                    }
                    return <span key={index}>{part.value}</span>;
                } else {
                    if (part.removed) return null;
                    if (part.added) {
                        return (
                            <mark 
                                key={index} 
                                className="bg-yellow-400 dark:bg-yellow-500/50 text-slate-900 dark:text-white px-0.5 rounded-sm font-bold shadow-sm"
                            >
                                {part.value}
                            </mark>
                        );
                    }
                    return <span key={index}>{part.value}</span>;
                }
            })}
        </span>
    );
}
