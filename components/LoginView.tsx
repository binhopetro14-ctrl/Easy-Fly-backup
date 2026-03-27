'use client';

import React, { useState } from 'react';
import { Plane, Eye, EyeOff, Lock, User, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LoginViewProps {
    onLogin: (user: any) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message === 'Invalid login credentials'
                    ? 'E-mail ou senha incorretos.'
                    : authError.message);
                return;
            }

            if (data.user) {
                onLogin(data.user);
            }
        } catch (err: any) {
            setError('Ocorreu um erro ao tentar conectar ao servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* Imagem de Fundo com Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                style={{ backgroundImage: 'url("/fundo.jpg")' }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            </div>

            <div className="w-full max-w-md relative z-10 px-4">
                <div className="bg-white/40 dark:bg-[#1e293b]/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/30 dark:border-slate-700/50 flex flex-col gap-4">
                    <div className="text-center pt-2">
                        <div className="inline-flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
                            <img src="/logo2.png" alt="Easy Fly Logo" className="w-32 h-auto drop-shadow-xl" />
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none drop-shadow-sm">Easy Fly</h1>
                        <p className="text-[#19727d] dark:text-cyan-400 font-bold text-sm uppercase tracking-[0.4em] mt-3 opacity-90 drop-shadow-sm">Agência de Viagens</p>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 text-center -mt-2">Acesse sua conta</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in duration-200">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-black dark:text-white uppercase ml-1">E-mail</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#19727d] dark:group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="exemplo@easyfly.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#19727d] dark:focus:border-cyan-500 focus:ring-4 focus:ring-[#19727d]/10 dark:focus:ring-cyan-500/10 transition-all outline-none text-sm font-medium text-gray-900 dark:text-white cursor-text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-black dark:text-white uppercase ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#19727d] dark:group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#19727d] dark:focus:border-cyan-500 focus:ring-4 focus:ring-[#19727d]/10 dark:focus:ring-cyan-500/10 transition-all outline-none text-sm font-medium text-gray-900 dark:text-white cursor-text"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#19727d] dark:hover:text-cyan-400 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#19727d] dark:bg-cyan-600 hover:bg-[#145d66] dark:hover:bg-cyan-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cyan-900/10 dark:shadow-cyan-900/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                "Entrar no Sistema"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/80 text-[10px] mt-8 uppercase font-bold tracking-[0.2em] drop-shadow-md">
                    © 2026 Easy Fly Dashboard • Todos os direitos reservados
                </p>
            </div>
        </div>
    );
}