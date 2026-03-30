'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';
import Image from 'next/image';

interface MyProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export function MyProfileModal({ isOpen, onClose, userEmail }: MyProfileModalProps) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        last_name: '',
        birth_date: '',
        address: '',
        avatar_url: ''
    });
    const [password, setPassword] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userEmail) {
            loadProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, userEmail]);

    const loadProfile = async () => {
        const { data } = await supabase.from('team_members').select('*').eq('email', userEmail).single();
        if (data) {
            setFormData({
                id: data.id,
                name: data.name || '',
                last_name: data.last_name || '',
                birth_date: data.birth_date || '',
                address: data.address || '',
                avatar_url: data.avatar_url || ''
            });
            setPassword('');
        }
    };

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setIsUploading(true);
        try {
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
        } catch (error: any) {
            alert('Erro ao fazer upload: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert("O nome é obrigatório.");
            return;
        }

        setIsLoading(true);

        try {
            if (password) {
                const { error: authError } = await supabase.auth.updateUser({ password });
                if (authError) throw authError;
            }

            const payload = {
                id: formData.id,
                name: formData.name,
                last_name: formData.last_name,
                birth_date: formData.birth_date || null,
                address: formData.address,
                avatar_url: formData.avatar_url
            };

            const { error: dbError } = await supabase.from('team_members').update(payload).eq('id', formData.id);
            if (dbError) throw dbError;

            // Disparar evento para a sidebar atualizar a foto imediatamente
            window.dispatchEvent(new CustomEvent('profile-updated'));

            alert("Perfil atualizado com sucesso!");
            onClose();
        } catch (error: any) {
            alert("Erro ao salvar perfil: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-gray-100 dark:border-slate-700/50">
                <div className="p-6 md:p-8 space-y-8">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700/50 pb-4">
                        <h3 className="text-xl font-black text-gray-800 dark:text-gray-200">Meu Perfil</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                        <div className="relative group flex-shrink-0">
                            <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-slate-800 border-2 dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                {formData.avatar_url ? (
                                    <Image src={formData.avatar_url} alt="Profile" width={112} height={112} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-xs font-bold uppercase">{formData.name.charAt(0)}</span>
                                )}
                                <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center flex-col transition-all cursor-pointer">
                                    <span className="text-xs text-white font-bold">{isUploading ? 'Enviando...' : 'Alterar Foto'}</span>
                                    <input type="file" accept="image/*" className="hidden" disabled={isUploading || isLoading} onChange={handleUploadAvatar} />
                                </label>
                            </div>
                        </div>
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Nome</label>
                                <input type="text" autoComplete="off" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none text-gray-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Sobrenome</label>
                                <input type="text" autoComplete="off" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none text-gray-900 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Endereço Completo</label>
                            <input type="text" autoComplete="off" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none text-gray-900 dark:text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Data Nasc.</label>
                            <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700/50">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Redefinir Senha (Deixe vazio para não mudar)</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700/50">
                        <button onClick={onClose} disabled={isLoading} className="px-6 py-2.5 text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Cancelar</button>
                        <button onClick={handleSave} disabled={isLoading} className="px-8 py-2.5 bg-[#8B5CF6] text-white rounded-xl text-sm font-bold hover:bg-[#7C3AED] shadow-lg shadow-purple-200 dark:shadow-purple-900/20 transition-all">{isLoading ? 'Salvando...' : 'Salvar Perfil'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
