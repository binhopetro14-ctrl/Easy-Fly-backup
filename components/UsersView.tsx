'use client';

import React, { useState } from 'react';
import {
    Users, UserPlus, Calculator, Trophy, Info,
    MoreVertical, CheckCircle2, XCircle, Plus,
    ChevronLeft, ChevronRight, X, Shield,
    BadgeDollarSign, Target, Percent, Trash2, Edit3,
    Settings
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// --- UTILS DE FORMATAÇÃO ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const parseCurrency = (value: string) => {
    return Number(value.replace(/\D/g, "")) / 100;
};

// --- CONFIGURAÇÃO DE PERMISSÕES PADRÃO POR CARGO ---
const ROLE_PERMISSIONS: Record<string, number> = {
    'Administrador': 56,
    'Gerente': 42,
    'Vendedor': 28,
    'Representante': 20,
    'Suporte': 15,
};

interface TeamMember {
    id: string;
    name: string;
    last_name?: string;
    email: string;
    role: 'Administrador' | 'Gerente' | 'Vendedor' | 'Suporte' | 'Representante' | 'Contador';
    status: 'Ativo' | 'Inativo';
    salary: number;
    commission_percent?: number;
    permissionsCount: number;
    birth_date?: string;
    address?: string;
    avatar_url?: string;
}

// Tipo de status de permissão para renderizar ícones/tags
type PermissionStatus = 'check' | 'x' | 'only_me' | 'del';

interface UsersViewProps {
    currentUser: any;
}

export function UsersView({ currentUser }: UsersViewProps) {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isAccountantModalOpen, setIsAccountantModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [password, setPassword] = useState('');
    
    // --- ESTADO DO FORMULÁRIO ---
    const [formData, setFormData] = useState({
        id: undefined as string | undefined,
        name: '',
        last_name: '',
        email: '',
        role: '' as TeamMember['role'],
        salary: 0,
        commission_percent: 0,
        status: 'Ativo' as TeamMember['status'],
        birth_date: '',
        address: '',
        avatar_url: ''
    });

    const handleEditMember = (member: TeamMember) => {
        setFormData({
            id: member.id,
            name: member.name,
            last_name: member.last_name || '',
            email: member.email,
            role: member.role,
            salary: member.salary,
            commission_percent: member.commission_percent || 0,
            status: member.status,
            birth_date: member.birth_date || '',
            address: member.address || '',
            avatar_url: member.avatar_url || ''
        });
        setPassword('');
        setIsInviteModalOpen(true);
    };

    // --- ESTADO DE DADOS ---
    const [members, setMembers] = useState<TeamMember[]>([]);

    // --- CARREGAR DADOS ---
    const fetchMembers = async () => {
        const { data, error } = await supabase.from('team_members').select('*').order('name');
        if (!error && data) {
            setMembers(data.map(m => ({
                id: m.id,
                name: m.name,
                last_name: m.last_name,
                email: m.email,
                role: m.role,
                status: m.status,
                salary: m.salary,
                commission_percent: m.commission_percent,
                permissionsCount: m.permissions_count,
                birth_date: m.birth_date,
                address: m.address,
                avatar_url: m.avatar_url
            })));
        }
    };

    const isAdmin = currentUser?.role === 'Administrador';

    React.useEffect(() => {
        fetchMembers();
    }, []);

    const resetForm = () => setFormData({ 
        id: undefined, name: '', last_name: '', email: '', role: '' as any, salary: 0, commission_percent: 0, status: 'Ativo', birth_date: '', address: '', avatar_url: '' 
    });

    const handleSaveMember = async () => {
        if (!formData.name || !formData.role || !formData.email) {
            alert("Por favor, preencha Nome, Email e Função.");
            return;
        }

        let isNewMember = !formData.id;

        // Se for novo membro, precisamos da senha para criar conta
        if (isNewMember && !password) {
            alert("Por favor, defina uma senha temporária para a criação do logon do novo membro.");
            return;
        }

        if (isNewMember) {
            // Usa Edge Function para criar Auth User
            const { data, error } = await supabase.functions.invoke('create_user', {
                body: { email: formData.email, password: password, name: formData.name, role: formData.role }
            });

            if (error) {
                console.error("Edge function error:", error);
                let errMsg = error.message;
                try {
                    // Algumas versões do Supabase colocam o res.json() na propriedade error se não for ok
                    if ((error as any).context && typeof (error as any).context.json === 'function') {
                        const errBody = await (error as any).context.json();
                        if (errBody && errBody.error) errMsg = errBody.error;
                    }
                } catch(e) {}
                alert("Falha na validação de Logon: " + (errMsg || "Ação rejeitada pelo sistema."));
                return;
            }
        }

        const payload: any = {
            name: formData.name,
            last_name: formData.last_name,
            email: formData.email,
            role: formData.role,
            status: 'Ativo',
            salary: formData.salary,
            commission_percent: formData.commission_percent,
            birth_date: formData.birth_date || null,
            address: formData.address,
            avatar_url: formData.avatar_url,
            permissions_count: ROLE_PERMISSIONS[formData.role] || 0
        };

        if (formData.id) payload.id = formData.id;

        const { error } = await supabase.from('team_members').upsert([payload], { onConflict: 'email' });
        
        if (error) {
            console.error("Erro ao salvar membro:", error);
            alert("Erro ao salvar: " + error.message);
        } else {
            fetchMembers();
            setIsInviteModalOpen(false);
            resetForm();
            setPassword('');
            alert(isNewMember ? "Conta criada com sucesso!" : "Perfil atualizado com sucesso!");
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
            alert('Erro ao fazer upload da imagem: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleInviteAccountant = async () => {
        if (!formData.name || !formData.email) {
            alert("Preencha Nome e Email do contador.");
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            role: 'Contador',
            status: 'Ativo',
            salary: 0,
            permissions_count: 2, // Financeiro + Notas Fiscais
            is_external: true
        };

        const { error } = await supabase.from('team_members').insert([payload]);
        
        if (error) {
            alert("Erro ao convidar contador: " + error.message);
        } else {
            fetchMembers();
            setIsAccountantModalOpen(false);
            resetForm();
            alert("Convite enviado ao contador com sucesso!");
        }
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">

            {/* NAVEGAÇÃO SUPERIOR (TAB) */}
            <div className="flex gap-8 border-b border-gray-200 dark:border-slate-700/50 text-sm font-medium text-gray-400 pb-px">
                {['Equipe', 'Clientes', 'Fornecedores', 'Passageiros'].map((tab, i) => (
                    <button key={tab} className={`pb-3 relative cursor-pointer ${i === 0 ? 'text-purple-600 font-bold' : 'hover:text-gray-600 dark:hover:text-gray-300'}`}>
                        {tab}
                        {i === 0 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600" />}
                    </button>
                ))}
            </div>

            {/* CARD GERENCIAR EQUIPE */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-200">Gerenciar Equipe</h2>
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Convide membros e gerencie suas permissões</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 px-3 py-2 rounded-xl flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{members.length}/40 assentos</span>
                            <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-500" />
                        </div>
                        {isAdmin && (
                            <>
                                <button 
                                    onClick={() => setIsAccountantModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                                >
                                    Convidar Contador
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer">
                                    <Trophy className="w-4 h-4" /> Metas & Comissões
                                </button>
                                <button
                                    onClick={() => { resetForm(); setPassword(''); setIsInviteModalOpen(true); }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] text-white rounded-xl text-xs font-bold hover:bg-[#7C3AED] shadow-lg shadow-purple-200 dark:shadow-purple-900/20 cursor-pointer transition-all"
                                >
                                    <UserPlus className="w-4 h-4" /> Convidar Membro
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* TABELA DE MEMBROS */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-700/50">
                                <th className="px-4 py-4">Nome</th>
                                <th className="px-4 py-4">Email</th>
                                <th className="px-4 py-4">Título/Cargo</th>
                                {isAdmin && (
                                    <>
                                        <th className="px-4 py-4">Salário</th>
                                        <th className="px-4 py-4">Comissão</th>
                                    </>
                                )}
                                <th className="px-4 py-4">Permissões</th>
                                <th className="px-4 py-4 text-center">Status</th>
                                <th className="px-4 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                            {members.map(member => (
                                <tr key={member.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-gray-200">
                                        <div className="flex items-center gap-3">
                                            {member.avatar_url ? (
                                                <Image src={member.avatar_url} alt={member.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                            {member.name} {member.last_name || ''}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{member.role || '-'}</td>
                                    {isAdmin && (
                                        <>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{formatCurrency(member.salary || 0)}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{member.commission_percent ? `${member.commission_percent}%` : '-'}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => setIsPermissionsModalOpen(true)}
                                            className="px-3 py-1 bg-gray-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 rounded-full text-[10px] font-bold text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
                                        >
                                            {member.permissionsCount} permissões
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="flex items-center gap-1 px-3 py-1 bg-[#8B5CF6] text-white text-[10px] font-bold rounded-full uppercase">
                                                <CheckCircle2 className="w-3 h-3" /> {member.status}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-slate-700 px-2 rounded">Emissor</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        {isAdmin && (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEditMember(member)}
                                                    className="p-2 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={async () => {
                                                        if (confirm(`Excluir ${member.name}?`)) {
                                                            await supabase.from('team_members').delete().eq('id', member.id);
                                                            fetchMembers();
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CARD ATIVIDADES DA EQUIPE */}
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm p-8 min-h-[500px]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200">Atividades da Equipe <span className="text-gray-300 dark:text-gray-600 font-medium">(0 tarefas)</span></h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-xl text-xs font-bold hover:bg-[#7C3AED] cursor-pointer">
                        <Plus className="w-4 h-4" /> Nova Tarefa
                    </button>
                </div>

                {/* BOARD DE TAREFAS */}
                <div className="w-72 bg-gray-50/50 dark:bg-slate-800/20 rounded-2xl border border-gray-100 dark:border-slate-700/50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <ChevronLeft className="w-4 h-4 text-gray-300 dark:text-gray-500 cursor-pointer" />
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-[10px] font-bold">CA</div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 leading-tight">Cleber Antonio Silv...</p>
                                <p className="text-[9px] text-gray-400 dark:text-gray-500">Administrador</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-500 cursor-pointer" />
                        </div>
                        <span className="text-xs font-bold text-gray-300 dark:text-gray-600">0</span>
                    </div>
                    <div className="p-10 flex flex-col items-center justify-center gap-4 text-gray-300 dark:text-gray-600">
                        <p className="text-xs font-medium italic">Nenhuma tarefa</p>
                    </div>
                    <button className="w-full p-4 border-t border-gray-100 dark:border-slate-700/50 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 transition-colors cursor-pointer bg-white dark:bg-slate-800/50">
                        <Plus className="w-4 h-4" /> Adicionar tarefa
                    </button>
                </div>
            </div>

            {/* MODAL CONVIDAR MEMBRO / CONFIGURAR COMISSÃO */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-gray-100 dark:border-slate-700/50">
                        <div className="p-8 space-y-8">
                            <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700/50 pb-4">Informações Básicas</h3>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 border-2 dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                        {formData.avatar_url ? (
                                            <Image src={formData.avatar_url} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">Sem Foto</span>
                                        )}
                                        <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center flex-col transition-all cursor-pointer">
                                            <span className="text-[10px] text-white font-bold">{isUploading ? 'Enviando...' : 'Alterar'}</span>
                                            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleUploadAvatar} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField 
                                        label="Nome *" 
                                        placeholder="Nome" 
                                        value={formData.name}
                                        onChange={(val: string) => setFormData({...formData, name: val})}
                                    />
                                    <InputField 
                                        label="Sobrenome" 
                                        placeholder="Sobrenome" 
                                        value={formData.last_name}
                                        onChange={(val: string) => setFormData({...formData, last_name: val})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField 
                                    label="E-mail *" 
                                    placeholder="exemplo@email.com"
                                    value={formData.email}
                                    onChange={(val: string) => setFormData({...formData, email: val})}
                                />
                                <div className="space-y-2 flex-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Senha{!formData.id ? ' *' : ' (Deixe vazio para não mudar)'}</label>
                                    <input
                                        type="text"
                                        placeholder={!formData.id ? 'Defina senha temporária' : '••••••••'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <InputField 
                                    label="Data Nasc." 
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={(val: string) => setFormData({...formData, birth_date: val})}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <InputField 
                                    label="Endereço Completo" 
                                    placeholder="Cidade, Rua..."
                                    value={formData.address}
                                    onChange={(val: string) => setFormData({...formData, address: val})}
                                />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Função *</label>
                                        <Info
                                            onClick={() => setIsPermissionsModalOpen(true)}
                                            className="w-4 h-4 text-cyan-400 cursor-pointer hover:text-cyan-600 transition-colors"
                                        />
                                    </div>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => {
                                            const role = e.target.value as TeamMember['role'];
                                            setFormData({...formData, role});
                                        }}
                                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 outline-none cursor-pointer text-gray-900 dark:text-white"
                                    >
                                        <option value="">Selecione uma função</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Gerente">Gerente</option>
                                        <option value="Vendedor">Vendedor</option>
                                        <option value="Representante">Representante</option>
                                        <option value="Suporte">Suporte</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Salário Base (R$)</label>
                                    <div className="flex items-center gap-4">
                                        <InputField 
                                            isCurrency={true} 
                                            value={formatCurrency(formData.salary)}
                                            onChange={(val: number) => setFormData({...formData, salary: val})}
                                        />
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="w-10 h-5 bg-gray-200 dark:bg-slate-700 rounded-full relative transition-colors group-hover:bg-gray-300 dark:group-hover:bg-slate-600">
                                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform" />
                                            </div>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">Ocultar custo/lucro</span>
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-gray-300 dark:text-gray-600">Salário fixo mensal do colaborador</p>
                                </div>
                            </div>

                            {/* SEÇÃO COMISSÃO (CONDICIONAL PARA VENDEDOR OU REPRESENTANTE) */}
                            {(formData.role === 'Vendedor' || formData.role === 'Representante') && (
                                <div className="pt-8 border-t border-gray-100 dark:border-slate-700/50 space-y-6 animate-in slide-in-from-top duration-500">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">Configuração de Comissão</h3>
                                        <span className="text-[9px] text-gray-300 dark:text-gray-600 font-medium">(Opcional - aplicável para vendedores e representantes)</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <SelectField label="Base da Comissão" options={['Lucro', 'Receita']} sub="Lucro = valor da venda menos custos" />
                                        <InputField 
                                            label="Percentual de Comissão (%)" 
                                            placeholder="0%" 
                                            isPercentage={true}
                                            value={formData.commission_percent ? String(formData.commission_percent) : ""}
                                            onChange={(val: number) => setFormData({...formData, commission_percent: val})} 
                                        />
                                        <SelectField label="Status" options={['Ativo', 'Inativo']} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50 dark:border-slate-700/50">
                                        <InputField 
                                            label="Meta Mensal (R$)" 
                                            placeholder="R$ 0,00" 
                                            isCurrency={true}
                                            onChange={(val: number) => setFormData({...formData, ...{ monthlyMeta: val } as any })}
                                        />
                                        <InputField 
                                            label="Bônus por Meta (R$)" 
                                            placeholder="R$ 0,00" 
                                            isCurrency={true}
                                            onChange={(val: number) => setFormData({...formData, ...{ metaBonus: val } as any })}
                                        />
                                        <InputField 
                                            label="Bônus Percentual (%)" 
                                            placeholder="0%" 
                                            isPercentage={true}
                                            onChange={(val: number) => setFormData({...formData, ...{ bonusPercent: val } as any })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Descrição</label>
                                        <textarea
                                            placeholder="Descrição opcional da configuração de comissão..."
                                            className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm min-h-[100px] outline-none text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700/50">
                                <button onClick={() => setIsInviteModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">Cancelar</button>
                                <button onClick={handleSaveMember} className="px-8 py-2.5 bg-[#8B5CF6] text-white rounded-xl text-sm font-bold hover:bg-[#7C3AED] shadow-lg shadow-purple-200 dark:shadow-purple-900/20 cursor-pointer transition-all">Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CONVIDAR CONTADOR (ESTILO MOCKUP) */}
            {isAccountantModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in duration-300 border border-gray-100 dark:border-slate-700/50">
                        <div className="space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-200 leading-tight">Convidar Contador</h2>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1">Acesso gratuito ao Financeiro e Notas Fiscais</p>
                                </div>
                                <button onClick={() => setIsAccountantModalOpen(false)} className="text-gray-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <InputField 
                                    label="Nome do Contador *" 
                                    placeholder="Nome completo" 
                                    onChange={(v: string) => setFormData({...formData, name: v})}
                                />
                                <InputField 
                                    label="Email *" 
                                    placeholder="email@contabilidade.com" 
                                    onChange={(v: string) => setFormData({...formData, email: v})}
                                />
                            </div>

                            <div className="bg-gray-50/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 space-y-4">
                                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">Permissões incluídas</label>
                                <div className="flex gap-2">
                                    <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-full border border-purple-100 dark:border-purple-500/20">Financeiro</span>
                                    <span className="px-4 py-1.5 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-100 dark:border-cyan-500/20">Notas Fiscais</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setIsAccountantModalOpen(false)}
                                    className="flex-1 py-4 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 text-sm font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleInviteAccountant}
                                    className="flex-1 py-4 bg-[#8B5CF6] text-white text-sm font-bold rounded-2xl hover:bg-[#7C3AED] shadow-lg shadow-purple-200 dark:shadow-purple-900/20 transition-all cursor-pointer"
                                >
                                    Enviar Convite
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL LISTA DE PERMISSÕES (VISUAL DARK) - O z-index superior garante que fique por cima */}
            {isPermissionsModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-[#2D333B] w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/5">
                        {/* Header Dark */}
                        <div className="p-4 bg-[#373E47] flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <Shield className="w-4 h-4 text-gray-400" /> Permissões por Função
                            </div>
                            <button onClick={() => setIsPermissionsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Corpo da Tabela Dark */}
                        <div className="overflow-y-auto max-h-[80vh]">
                            <table className="w-full text-left text-xs text-gray-300">
                                <thead className="bg-[#1C2128] text-center sticky top-0 z-10 border-b border-white/5">
                                    <tr>
                                        <th className="p-4 bg-[#373E47]"></th>
                                        {['Admin', 'Gerente', 'Vendedor', 'Suporte', 'Represent.'].map(role => (
                                            <th key={role} className="p-4 border-l border-white/5 font-bold uppercase tracking-wider">{role}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {/* GRUPO 1: AÇÕES / PERMISSÕES */}
                                    <PermissionGroupHeader title="Ações / Permissões" />
                                    <PermissionRow label="Ver todas as vendas" states={['check', 'check', 'only_me', 'only_me', 'only_me']} />
                                    <PermissionRow label="Alterar status pgto" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Transferir vendas" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Excluir vendas" states={['check', 'check', 'del', 'del', 'x']} />
                                    <PermissionRow label="Comissões (config)" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Gerenciar usuários" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Criar voos" states={['check', 'check', 'check', 'x', 'x']} />
                                    <PermissionRow label="Importação CSV" states={['check', 'x', 'x', 'x', 'x']} />

                                    {/* GRUPO 2: MENUS VISÍVEIS */}
                                    <PermissionGroupHeader title="Menus Visíveis" />
                                    <PermissionRow label="Dashboard" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Desempenho" states={['check', 'check', 'check', 'check', 'check']} />
                                    <PermissionRow label="Financeiro" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Vendas" states={['check', 'check', 'check', 'check', 'x']} />
                                    <PermissionRow label="Clientes" states={['check', 'check', 'check', 'check', 'x']} />
                                    <PermissionRow label="Relatórios" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Voos" states={['check', 'check', 'check', 'check', 'x']} />
                                    <PermissionRow label="Suporte" states={['check', 'check', 'check', 'check', 'check']} />
                                    <PermissionRow label="Calendário" states={['check', 'check', 'check', 'check', 'check']} />
                                    <PermissionRow label="Produtos" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Forma Pagamento" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Fornecedores" states={['check', 'check', 'x', 'x', 'x']} />
                                    <PermissionRow label="Usuários" states={['check', 'check', 'x', 'x', 'x']} />
                                </tbody>
                            </table>
                        </div>

                        {/* Footer com Botão Roxo */}
                        <div className="p-4 bg-[#373E47] flex justify-end border-t border-white/5">
                            <button
                                onClick={() => setIsPermissionsModalOpen(false)}
                                className="px-8 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 cursor-pointer transition-all shadow-lg shadow-purple-900/50"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

// --- SUBCOMPONENTES AUXILIARES ---

function InputField({ label, placeholder = "", value = "", type = "text", sub = "", isCurrency = false, isPercentage = false, onChange }: any) {
    const [displayValue, setDisplayValue] = useState(value);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        
        if (isCurrency) {
            const numericValue = val.replace(/\D/g, "");
            const floatValue = Number(numericValue) / 100;
            const formatted = formatCurrency(floatValue);
            setDisplayValue(formatted);
            if (onChange) onChange(floatValue);
        } else if (isPercentage) {
            const numericValue = val.replace(/\D/g, "");
            const numValue = Number(numericValue);
            setDisplayValue(`${numValue}%`);
            if (onChange) onChange(numValue);
        } else {
            setDisplayValue(val);
            if (onChange) onChange(val);
        }
    };

    return (
        <div className="space-y-2 flex-1">
            {label && <label className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</label>}
            <input
                type={type}
                autoComplete="off"
                value={displayValue}
                placeholder={placeholder}
                onFocus={handleFocus}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-white"
            />
            {sub && <p className="text-[10px] text-gray-300 dark:text-gray-500">{sub}</p>}
        </div>
    );
}

function SelectField({ label, options, sub }: any) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</label>
            <select className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none cursor-pointer text-gray-900 dark:text-white">
                {options.map((o: any) => <option key={o}>{o}</option>)}
            </select>
            {sub && <p className="text-[10px] text-gray-300 dark:text-gray-500">{sub}</p>}
        </div>
    );
}

function PermissionGroupHeader({ title }: { title: string }) {
    return (
        <tr className="bg-[#1C2128]">
            <td colSpan={6} className="p-3 text-purple-400 font-black flex items-center gap-2">
                <Settings className="w-3.5 h-3.5" /> {title}
            </td>
        </tr>
    );
}

// Renderiza o ícone ou tag correspondente ao status da permissão
function PermissionRow({ label, states }: { label: string, states: PermissionStatus[] }) {
    const renderIcon = (state: PermissionStatus) => {
        switch (state) {
            case 'check': return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />;
            case 'x': return <XCircle className="w-5 h-5 text-red-500/80 mx-auto" />;
            case 'only_me': return <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full text-[9px] font-bold mx-auto flex items-center justify-center w-fit">✖ só dele</span>;
            case 'del': return <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[9px] font-bold mx-auto flex items-center justify-center w-fit">✔ dele</span>;
            default: return null;
        }
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-4 font-medium text-gray-400">{label}</td>
            {states.map((state, i) => (
                <td key={i} className="p-4 border-l border-white/5 text-center">{renderIcon(state)}</td>
            ))}
        </tr>
    );
}