'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { syncService } from '../services/syncService';
import { Cloud, CloudOff, RefreshCw, LogIn, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

interface Props {
  onRefresh: () => Promise<void>;
  collapsed?: boolean;
}

export const SupabaseSyncHandler: React.FC<Props> = ({ onRefresh, collapsed }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [teamMember, setTeamMember] = useState<any>(null);

  const fetchTeamMember = useCallback(async (email: string) => {
    const { data } = await supabase.from('team_members').select('*').eq('email', email).single();
    if (data) setTeamMember(data);
  }, []);

  const checkConnection = useCallback(async () => {
    setIsSyncing(true);
    const connected = await syncService.checkConnection();
    setIsConnected(connected);
    if (connected) await onRefresh();
    setIsSyncing(false);
  }, [onRefresh]);

  useEffect(() => {
    checkConnection();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) fetchTeamMember(session.user.email);
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) fetchTeamMember(session.user.email);
      else setTeamMember(null);
    });

    const channels = [
      syncService.subscribe('customers', onRefresh),
      syncService.subscribe('sales', onRefresh),
      syncService.subscribe('suppliers', onRefresh)
    ];

    const stopAutoSync = syncService.startAutoSync(onRefresh, 300000);

    const handleProfileUpdated = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user?.email) fetchTeamMember(currentSession.user.email);
    };
    
    window.addEventListener('profile-updated', handleProfileUpdated);

    return () => {
      authSub.unsubscribe();
      channels.forEach(ch => ch.unsubscribe());
      stopAutoSync();
      window.removeEventListener('profile-updated', handleProfileUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    const email = prompt("Digite seu e-mail (banco teste):", "teste@easyfly.com");
    const password = prompt("Digite sua senha:", "123456");
    if (email && password) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
      } catch (err) { console.error(err); }
    }
  };

  const openMyProfile = () => {
    window.dispatchEvent(new CustomEvent('open-my-profile'));
  };

  return (
    <div className={`p-4 border-t border-[#145d66] bg-[#19727d] transition-all ${collapsed ? 'items-center' : 'items-start'}`}>
      <div className="flex flex-col gap-3 w-full">
        {/* Auth status */}
        <div className="flex items-center gap-3 w-full">
          {session ? (
            <button 
              onClick={openMyProfile}
              className={`flex items-center gap-3 text-left hover:bg-white/10 p-2 -ml-2 rounded-xl transition-all cursor-pointer w-full ${collapsed ? 'justify-center' : ''}`}
              title="Meu Perfil"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white/20 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                {teamMember?.avatar_url ? (
                  <Image src={teamMember.avatar_url} alt="Avatar" width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  <span>{teamMember?.name?.charAt(0) || session.user.email?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              {!collapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-white truncate w-full">{teamMember ? `${teamMember.name} ${teamMember.last_name || ''}` : session.user.email?.split('@')[0]}</span>
                  <span className="text-[9px] text-cyan-200 uppercase tracking-widest">{teamMember?.role || 'Usuário'}</span>
                </div>
              )}
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className={`flex items-center gap-2 text-[11px] bg-white/10 px-2 py-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer ${collapsed ? 'justify-center w-full' : ''}`}
            >
              <LogIn className="w-3 h-3" />
              {!collapsed && <span>Acessar Conta</span>}
            </button>
          )}
        </div>

        {/* Sync Status Info */}
        <div className={`flex items-center gap-3 pt-2 border-t border-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            {isConnected ? (
              <Cloud className="w-4 h-4 text-emerald-400" />
            ) : isConnected === false ? (
              <CloudOff className="w-4 h-4 text-rose-400" />
            ) : (
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
            )}
            
            <AnimatePresence>
              {isSyncing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse border border-[#19727d]"
                />
              )}
            </AnimatePresence>
          </div>
          
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                {isConnected ? 'Sincronizado' : isConnected === false ? 'Offline' : 'Conectando'}
              </span>
              <span className="text-[9px] text-cyan-200">
                {isSyncing ? 'Atualizando dados...' : 'Tempo Real Ativo'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
