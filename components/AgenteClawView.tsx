'use client';

import React, { useState } from 'react';
import { 
  Wand2, Send, Loader2, Play, CheckCircle2, AlertCircle, 
  Terminal, Globe, Shield, Zap, Search, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClawTask {
  id: string;
  backendTaskId?: string;
  command: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  details?: { label: string; value: string }[];
  logs?: string[];
  createdAt: string;
}

const getAgentUrl = () => {
    // Forçando o uso da VPS no Hostinger conforme solicitação do usuário
    return 'https://claw-agent-claw-agent.3cmm3y.easypanel.host';
};

export function AgenteClawView() {
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<ClawTask[]>([
    {
      id: '1',
      command: 'Buscar cotação nos portais Smiles e Latam para GRU-MCO em 15/10',
      status: 'completed',
      result: 'Encontrei as melhores opções combinando milhas e dinheiro.',
      details: [
        { label: 'Smiles (GOL)', value: '45.000 milhas + R$ 650 taxas' },
        { label: 'LATAM (Dinheiro)', value: 'R$ 4.205,00 (Tarifa Light)' },
        { label: 'Sugestão', value: 'Emitir via Smiles para maior economia.' }
      ],
      createdAt: new Date().toISOString()
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newTask: ClawTask = {
      id: Math.random().toString(36).substr(2, 9),
      command,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setCommand('');
    
    // Simulação de início do agente
    startTask(newTask.id, newTask.command);
  };

  const startTask = async (id: string, command: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'running', logs: ['🤖 Iniciando conexão com o Agente...'] } : t));
    setIsRunning(true);

    const AGENT_URL = getAgentUrl();

    try {
      // 1. Enviar tarefa para a VPS
      const response = await fetch(`${AGENT_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: command })
      });

      if (!response.ok) throw new Error('Falha ao conectar com o robô na VPS');
      
      const { task_id } = await response.json();
      
      // 2. Loop de monitoramento (Polling)
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${AGENT_URL}/status/${task_id}`);
          if (!statusRes.ok) return;
          
          const statusData = await statusRes.json();
          
          // Atualiza logs e ID do backend
          setTasks(prev => prev.map(t => t.id === id ? { 
            ...t, 
            backendTaskId: task_id,
            logs: statusData.logs || t.logs,
            status: statusData.status === 'completed' ? 'completed' : 
                    statusData.status === 'failed' ? 'failed' : 'running'
          } : t));

          if (statusData.status === 'completed') {
            clearInterval(pollInterval);
            setTasks(prev => prev.map(t => t.id === id ? { 
              ...t, 
              status: 'completed', 
              result: statusData.result?.message || 'Tarefa finalizada',
            } : t));
            setIsRunning(false);
          } else if (statusData.status === 'failed' || statusData.status === 'error') {
            clearInterval(pollInterval);
            setTasks(prev => prev.map(t => t.id === id ? { 
              ...t, 
              status: 'failed', 
              result: statusData.result?.message || statusData.message || 'Erro no Agente'
            } : t));
            setIsRunning(false);
          }
        } catch (err) {
          console.error("Erro no polling:", err);
        }
      }, 2500);

    } catch (err: any) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'failed', result: err.message, logs: [`❌ Erro: ${err.message}`] } : t));
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#0f172a] p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Profissional */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Agente Claw</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Seu funcionário autônomo para navegação e automação</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Ativo em VPS</span>
          </div>
        </div>

        {/* Central de Comando */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lado Esquerdo: Input de Comando */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Terminal className="w-4 h-4" />
                  <h2 className="text-sm font-black uppercase tracking-wider">O que o Claw deve fazer hoje?</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="relative">
                  <textarea
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Ex: Entre no portal da Azul, busque voos para Recife no dia 20/09 e me avise se encontrar abaixo de R$ 800..."
                    className="w-full h-32 pl-4 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isRunning || !command.trim()}
                    className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {isRunning ? 'Executando...' : 'Lançar Agente'}
                  </button>
                </form>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Sugestões:</span>
                  {['Buscar voo', 'Verificar reservas', 'Extrair preços', 'Check-in auto'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setCommand(s)}
                      className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de Tarefas Recentes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Tarefas do Funcionário
                </h3>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{task.command}</p>
                          <p className="text-[10px] text-gray-400 font-medium">Lançado em: {new Date(task.createdAt).toLocaleString()}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          task.status === 'running' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                          task.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {task.status === 'completed' ? 'Finalizado' :
                           task.status === 'running' ? 'Em progresso' :
                           task.status === 'failed' ? 'Erro' : 'Pendente'}
                        </div>
                      </div>
                      
                      {task.logs && task.status === 'running' && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Log de Terminal */}
                          <div className="p-3 bg-gray-900 rounded-xl font-mono text-[10px] text-emerald-400 space-y-1 h-40 overflow-hidden border border-white/10">
                            {task.logs.map((log, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                <span>{log}</span>
                              </div>
                            ))}
                            <div className="animate-pulse">_</div>
                          </div>
                          
                          {/* Monitor de Navegação */}
                          <div className="relative bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden h-40 border border-gray-300 dark:border-slate-600 group">
                            {task.backendTaskId ? (
                              <img 
                                src={`${getAgentUrl()}/screenshot/${task.backendTaskId}?t=${Date.now()}`} 
                                alt="Browser View"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback se a imagem falhar
                                  (e.target as any).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Preparando Navegador</p>
                              </div>
                            )}
                            <div className="absolute top-2 left-2 flex gap-1 bg-black/20 p-1 rounded-md backdrop-blur-sm">
                              <div className="w-2 h-2 rounded-full bg-red-400" />
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-indigo-600/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-widest">
                               Live View
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(task.result || task.logs) && (task.status === 'completed' || task.status === 'failed') && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 space-y-3">
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              task.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'
                            }`}>
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-bold mt-1 ${
                                task.status === 'completed' ? 'text-gray-700 dark:text-gray-300' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {task.status === 'completed' ? task.result : `Erro na Execução: ${task.result}`}
                              </p>
                              {task.status === 'failed' && task.logs && (
                                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30 text-[10px] text-red-700 dark:text-red-300 font-mono">
                                  {task.logs.slice(-1)[0]}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {task.status === 'completed' && task.details && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-11">
                              {task.details.map((d, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-slate-900/50 p-2 rounded-xl border border-gray-100 dark:border-slate-700">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{d.label}</p>
                                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{d.value}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {task.status === 'completed' && (
                            <button className="ml-11 text-[10px] font-black text-[#19727d] uppercase tracking-widest hover:underline">
                              Gerar Proposta para o Cliente →
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Lado Direito: Status e Info */}
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/20">
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 opacity-80">Status do Robô</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-200" />
                    <span className="text-xs font-bold text-indigo-100">Modo Navegação</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded uppercase">Full AI</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-200" />
                    <span className="text-xs font-bold text-indigo-100">Motor de Execução</span>
                  </div>
                  <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded uppercase">Autonomous</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-[10px] leading-relaxed text-indigo-100 opacity-70">
                  O Agente Claw utiliza visão computacional e navegação autônoma para interagir com sistemas legados que não possuem API.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Como usar:</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Descreva a tarefa como se estivesse falando com um funcionário.',
                  'Especifique sites, datas e o que você deseja encontrar.',
                  'O Agente Claw abrirá um navegador no servidor e fará o trabalho.',
                  'Confira o resultado na linha do tempo ao lado.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{i+1}.</span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
