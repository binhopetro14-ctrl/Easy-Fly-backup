import re

file_path = 'c:\\Users\\Cleber\\Documents\\EASY FLY\\SISTEMA\\Easy Fly\\components\\UsersView.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update TeamMember Interface
old_team_member = """interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Administrador' | 'Gerente' | 'Vendedor' | 'Suporte' | 'Representante';
    status: 'Ativo' | 'Inativo';
    salary: number;
    permissionsCount: number;
}"""
new_team_member = """interface TeamMember {
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
}"""
content = content.replace(old_team_member, new_team_member)

# 2. Add Auth state and update Fetch behavior
hooks_old = """    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isAccountantModalOpen, setIsAccountantModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);"""
hooks_new = hooks_old + """
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [password, setPassword] = useState('');"""
content = content.replace(hooks_old, hooks_new)

old_form_state = """    const [formData, setFormData] = useState({
        id: undefined as string | undefined,
        name: '',
        email: '',
        role: '' as TeamMember['role'],
        salary: 0,
        status: 'Ativo' as TeamMember['status']
    });"""
new_form_state = """    const [formData, setFormData] = useState({
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
    });"""
content = content.replace(old_form_state, new_form_state)

old_handle_edit = """    const handleEditMember = (member: TeamMember) => {
        setFormData({
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
            salary: member.salary,
            status: member.status
        });
        setIsInviteModalOpen(true);
    };"""
new_handle_edit = """    const handleEditMember = (member: TeamMember) => {
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
    };"""
content = content.replace(old_handle_edit, new_handle_edit)

old_fetch_members = """        if (!error && data) {
            setMembers(data.map(m => ({
                id: m.id,
                name: m.name,
                email: m.email,
                role: m.role,
                status: m.status,
                salary: m.salary,
                permissionsCount: m.permissions_count
            })));
        }"""
new_fetch_members = """        if (!error && data) {
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
        }"""
content = content.replace(old_fetch_members, new_fetch_members)

old_use_effect = """    React.useEffect(() => {
        fetchMembers();
    }, []);"""
new_use_effect = """    React.useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('team_members').select('role').eq('email', user.email).single();
                if (data && data.role === 'Administrador') {
                    setIsAdmin(true);
                }
            }
        };
        checkAdmin();
        fetchMembers();
    }, []);

    const resetForm = () => setFormData({ 
        id: undefined, name: '', last_name: '', email: '', role: '' as any, salary: 0, commission_percent: 0, status: 'Ativo', birth_date: '', address: '', avatar_url: '' 
    });"""
content = content.replace(old_use_effect, new_use_effect)

# 3. Modify `handleSaveMember` to use Edge function
old_handle_save = """    const handleSaveMember = async () => {
        if (!formData.name || !formData.role) {
            alert("Por favor, preencha o Nome e a Função.");
            return;
        }

        const payload: any = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: 'Ativo',
            salary: formData.salary,
            permissions_count: ROLE_PERMISSIONS[formData.role] || 0
        };

        if (formData.id) payload.id = formData.id;

        const { error } = await supabase.from('team_members').upsert([payload]);
        
        if (error) {
            console.error("Erro ao salvar membro:", error);
            alert("Erro ao salvar: " + error.message);
        } else {
            fetchMembers();
            setIsInviteModalOpen(false);
            setFormData({ id: undefined, name: '', email: '', role: '' as any, salary: 0, status: 'Ativo' });
        }
    };"""

new_handle_save = """    const handleSaveMember = async () => {
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
                alert("Erro ao criar conta de Login: " + (error.message || "Email já em uso ou erro desconhecido."));
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
    };"""

content = content.replace(old_handle_save, new_handle_save)

# 4. Hide Buttons if Not Admin
old_buttons = """                        <button 
                            onClick={() => setIsAccountantModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                        >
                            Convidar Contador
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer">
                            <Trophy className="w-4 h-4" /> Metas & Comissões
                        </button>
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] text-white rounded-xl text-xs font-bold hover:bg-[#7C3AED] shadow-lg shadow-purple-200 dark:shadow-purple-900/20 cursor-pointer transition-all"
                        >
                            <UserPlus className="w-4 h-4" /> Convidar Membro
                        </button>"""
new_buttons = """                        {isAdmin && (
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
                        )}"""
content = content.replace(old_buttons, new_buttons)

# 5. Hide Actions in Table if not Admin
old_table_actions = """                                    <td className="px-4 py-4 text-right">
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
                                    </td>"""
new_table_actions = """                                    <td className="px-4 py-4 text-right">
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
                                    </td>"""
content = content.replace(old_table_actions, new_table_actions)

old_table_name = """                                    <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-gray-200">{member.name}</td>"""
new_table_name = """                                    <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-gray-200">
                                        <div className="flex items-center gap-3">
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                            {member.name} {member.last_name || ''}
                                        </div>
                                    </td>"""
content = content.replace(old_table_name, new_table_name)

# 6. Adjust form in modal
old_invite_form = """                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField 
                                    label="Nome *" 
                                    placeholder="Nome completo" 
                                    value={formData.name}
                                    onChange={(val: string) => setFormData({...formData, name: val})}
                                />
                                <InputField 
                                    label="E-mail" 
                                    placeholder="exemplo@email.com"
                                    value={formData.email}
                                    onChange={(val: string) => setFormData({...formData, email: val})}
                                />
                                <InputField label="Senha *" type="password" value="********" />"""
new_invite_form = """                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 border-2 dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                        {formData.avatar_url ? (
                                            <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">Sem Foto</span>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center flex-col transition-all">
                                            <label className="text-[10px] text-white font-bold cursor-pointer">{isUploading ? 'Enviando...' : 'Alterar'}</label>
                                            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleUploadAvatar} />
                                        </div>
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
                                />"""
content = content.replace(old_invite_form, new_invite_form)

# Add commission_percent binding to form since we added it to formData
old_commission = """                                        <InputField 
                                            label="Percentual (%)" 
                                            placeholder="0%" 
                                            isPercentage={true}
                                            onChange={(val: number) => setFormData({...formData, ...{ commissionPercent: val } as any })} 
                                        />"""
new_commission = """                                        <InputField 
                                            label="Percentual de Comissão (%)" 
                                            placeholder="0%" 
                                            isPercentage={true}
                                            value={formData.commission_percent ? String(formData.commission_percent) : ""}
                                            onChange={(val: number) => setFormData({...formData, commission_percent: val})} 
                                        />"""
content = content.replace(old_commission, new_commission)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
