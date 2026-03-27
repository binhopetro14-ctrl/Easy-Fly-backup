'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Plane,
  ShoppingCart,
  Target,
  Settings,
  Search,
  Trash2,
  Bell,
  Plus,
  TrendingUp,
  DollarSign,
  Briefcase,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  BarChart3,
  Wallet,
  Truck,
  PieChart,
  Moon,
  Sun,
  ChevronLeft,
  LogOut,
  AlertCircle,
  UserPlus,
  Wand2,
  Trophy,
  Mail,
  Phone,
  Menu,
  X,
  Cake,
  CreditCard,
  CheckCircle2,
  Clock,
  Shield // Ícone extra para a sidebar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, Group, Sale, Supplier, TeamMember, Lead } from '@/types';
import { customerService, groupService, supplierService, saleService } from '@/services/supabaseService';
import { SidebarItem } from '@/components/UI';
import { DashboardView } from '@/components/DashboardView';
import { CustomersView } from '@/components/CustomersView';
import { CustomerDetailsView } from '@/components/CustomerDetailsView';
import { SalesView } from '@/components/SalesView';
import { SuppliersView } from '@/components/SuppliersView';
import { UsersView } from '@/components/UsersView';
import { useLeads } from '@/hooks/useLeads';
import { CRMView } from '@/components/CRMView';
import { LeadModal } from '@/components/LeadModal';
import { ReservasView, FinanceiroView, MetricasView } from '@/components/OtherViews';
import { CustomerModal } from '@/components/CustomerModal';
import { GroupModal } from '@/components/GroupModal';
import { SaleModal } from '@/components/SaleModal';
import { SupplierModal } from '@/components/SupplierModal';
import { MyProfileModal } from '@/components/MyProfileModal';
import { DeleteConfirmationModal } from '@/components/Modals';
import { SupabaseSyncHandler } from '@/components/SupabaseSyncHandler';
import { LoginView } from '@/components/LoginView';
import { supabase } from '@/lib/supabase';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { useTheme } from '@/hooks/useTheme';
import { useCustomers } from '@/hooks/useCustomers';
import { useGroups } from '@/hooks/useGroups';
import { useSales } from '@/hooks/useSales';
import { useSuppliers } from '@/hooks/useSuppliers';

// <--- 'usuarios' adicionado ao tipo View
type View = 'dashboard' | 'crm' | 'vendas' | 'clientes' | 'reservas' | 'financeiro' | 'fornecedores' | 'metricas' | 'usuarios';

export default function Page() {
  const { theme, toggleTheme, mounted } = useTheme();

  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);

  // --- HOOKS DE DADOS ---
  const { 
    customers, fetchCustomers, loading: loadingCustomers, 
    saveCustomer: internalSaveCustomer, deleteCustomer: internalDeleteCustomer 
  } = useCustomers();
  
  const { 
    groups, fetchGroups, loading: loadingGroups, 
    saveGroup: internalSaveGroup, deleteGroup: internalDeleteGroup 
  } = useGroups();
  
  const { 
    sales, fetchSales, loading: loadingSales, stats,
    saveSale: internalSaveSale, deleteSale: internalDeleteSale 
  } = useSales();
  
  const { 
    suppliers, fetchSuppliers, loading: loadingSuppliers, 
    saveSupplier: internalSaveSupplier, deleteSupplier: internalDeleteSupplier 
  } = useSuppliers();

  const {
    leads, fetchLeads, loading: loadingLeads,
    saveLead: internalSaveLead, deleteLead: internalDeleteLead, updateLeadStatus
  } = useLeads();

  // --- ESTADOS DE NAVEGAÇÃO ---
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ESTADOS DE MODAIS ---
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSaleConfirmOpen, setIsDeleteSaleConfirmOpen] = useState(false);
  const [isDeleteSupplierConfirmOpen, setIsDeleteSupplierConfirmOpen] = useState(false);
  const [isDeleteLeadConfirmOpen, setIsDeleteLeadConfirmOpen] = useState(false);

  // --- ESTADOS DE EDIÇÃO/DELEÇÃO ---
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const [isMyProfileModalOpen, setIsMyProfileModalOpen] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const handleOpenMyProfile = () => setIsMyProfileModalOpen(true);
    window.addEventListener('open-my-profile', handleOpenMyProfile);
    return () => window.removeEventListener('open-my-profile', handleOpenMyProfile);
  }, []);

  useEffect(() => {
    // Verifica sessão existente ao carregar
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          handleLogin(session.user);
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    fetchCustomers();
    fetchGroups();
    
    // Calcula o primeiro e último dia do mês atual para o carregamento inicial
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    fetchSales({ startDate: firstDay, endDate: lastDay });
    fetchSuppliers();
    fetchLeads();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleViewChange = (view: View) => {
    setActiveView(view);
    setSelectedCustomer(null);
    closeMobileMenu();

    if (view === 'dashboard') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      fetchSales({ startDate: firstDay, endDate: lastDay });
    }
  };

  // --- HANDLERS LOGIN/LOGOUT ---
  const handleLogin = async (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Fetch full profile info
    if (userData?.email) {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('email', userData.email)
          .single();
        
        if (data && !error) {
          setCurrentUser({
            id: data.id,
            name: data.name,
            lastName: data.last_name,
            email: data.email,
            role: data.role,
            status: data.status,
            salary: data.salary,
            commissionPercent: data.commission_percent,
            permissionsCount: data.permissions_count,
            birthDate: data.birth_date,
            address: data.address,
            avatarUrl: data.avatar_url
          });
        }
      } catch (err) {
        console.error("Error fetching team member profile:", err);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  useInactivityTimeout({
    timeoutMinutes: 60, // Desloga após 60 minutos de inatividade
    isActive: isAuthenticated,
    onTimeout: () => {
      alert("A sessão foi encerrada devido a inatividade prolongada.");
      handleLogout();
    }
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        setUser(null);
        setActiveView('dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- CUSTOMER HANDLERS ---
  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    const fullName = `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim();
    try {
      const savedCustomer = await internalSaveCustomer({
        ...editingCustomer,
        ...customerData,
        name: fullName || editingCustomer?.name || 'Cliente sem nome',
        emissor: editingCustomer?.emissor || `${currentUser?.name} ${currentUser?.lastName || ''}`.trim() || user?.email || 'N/A'
      });
      if (selectedCustomer?.id === savedCustomer.id) setSelectedCustomer(savedCustomer);
      setIsCustomerModalOpen(false);
      setEditingCustomer(null);
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (customerToDelete) {
      try {
        await internalDeleteCustomer(customerToDelete.id);
        if (selectedCustomer?.id === customerToDelete.id) setSelectedCustomer(null);
        setIsDeleteConfirmOpen(false);
        setCustomerToDelete(null);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const openAddCustomer = () => {
    setEditingCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  // Group Handlers
  const handleSaveGroup = async (groupData: Partial<Group>) => {
    try {
      await internalSaveGroup({ ...editingGroup, ...groupData });
      setIsGroupModalOpen(false);
      setEditingGroup(null);
    } catch (error) { console.error(error); }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await internalDeleteGroup(id);
    } catch (error) { console.error(error); }
  };

  const openAddGroup = () => { setEditingGroup(null); setIsGroupModalOpen(true); };
  const openEditGroup = (group: Group) => { setEditingGroup(group); setIsGroupModalOpen(true); };

  // Sale Handlers
  const handleSaveSale = async (saleData: Partial<Sale>) => {
    try {
      await internalSaveSale(
        { 
          ...editingSale, 
          ...saleData,
          emissor: editingSale?.emissor || `${currentUser?.name} ${currentUser?.lastName || ''}`.trim() || user?.email || 'N/A'
        },
        saleData.items || editingSale?.items || []
      );
      setIsSaleModalOpen(false);
      setEditingSale(null);
    } catch (error: any) {
      console.error('Erro ao salvar venda:', error);
      alert('Erro ao salvar venda: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleQuickUpdateSale = async (saleId: string, updates: Partial<Sale>) => {
    try {
      const sale = sales.find((s: Sale) => s.id === saleId);
      if (!sale) return;

      const updatedSale = { ...sale, ...updates };
      const itemsToSave = (updates.items || sale.items || []).map((item: any) => ({
        ...item,
        id: item.id?.startsWith('temp_') ? undefined : item.id
      })) as any[];

      await internalSaveSale(updatedSale, itemsToSave as any);
    } catch (error: any) {
      console.error('Erro ao atualizar venda:', error);
      alert('Erro ao atualizar venda: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDeleteSale = (id: string) => {
    const sale = sales.find((s: Sale) => s.id === id);
    if (sale) { setSaleToDelete(sale); setIsDeleteSaleConfirmOpen(true); }
  };

  const confirmDeleteSale = async () => {
    if (saleToDelete) {
      try {
        await internalDeleteSale(saleToDelete.id);
        setIsDeleteSaleConfirmOpen(false);
        setSaleToDelete(null);
      } catch (error) { console.error(error); }
    }
  };

  const openAddSale = () => { setEditingSale(null); setIsSaleModalOpen(true); };
  const openEditSale = (sale: Sale) => { setEditingSale(sale); setIsSaleModalOpen(true); };

  const handleUpdateSaleStatus = async (saleId: string, field: 'costStatus' | 'saleStatus', status: any) => {
    try {
      const sale = sales.find((s: Sale) => s.id === saleId);
      if (sale) {
        const updatedSale = { ...sale, [field]: status };
        await internalSaveSale(updatedSale, sale.items);
      }
    } catch (error) { console.error(error); }
  };

  // Supplier Handlers
  const handleSaveSupplier = async (supplierData: Partial<Supplier>) => {
    try {
      await internalSaveSupplier({ 
        ...editingSupplier, 
        ...supplierData,
        emissor: editingSupplier?.emissor || `${currentUser?.name} ${currentUser?.lastName || ''}`.trim() || user?.email || 'N/A'
      });
      setIsSupplierModalOpen(false);
      setEditingSupplier(null);
    } catch (error: any) { 
      console.error(error); 
      alert('Erro ao salvar fornecedor: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const openAddSupplier = () => { setEditingSupplier(null); setIsSupplierModalOpen(true); };
  const openEditSupplier = (supplier: Supplier) => { setEditingSupplier(supplier); setIsSupplierModalOpen(true); };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteSupplierConfirmOpen(true);
  };

  const confirmDeleteSupplier = async () => {
    if (supplierToDelete) {
      try {
        await internalDeleteSupplier(supplierToDelete.id);
        setIsDeleteSupplierConfirmOpen(false);
        setSupplierToDelete(null);
      } catch (error: any) { 
        console.error(error); 
        alert('Erro ao excluir fornecedor: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  // --- LEAD HANDLERS ---
  const handleSaveLead = async (leadData: Partial<Lead>) => {
    try {
      await internalSaveLead({
        ...editingLead,
        ...leadData,
        emissor: editingLead?.emissor || `${currentUser?.name} ${currentUser?.lastName || ''}`.trim() || user?.email || 'N/A'
      });
      setIsLeadModalOpen(false);
      setEditingLead(null);
    } catch (error: any) {
      console.error(error);
      alert('Erro ao salvar lead: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDeleteLead = (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (lead) {
      setLeadToDelete(lead);
      setIsDeleteLeadConfirmOpen(true);
    }
  };

  const confirmDeleteLead = async () => {
    if (leadToDelete) {
      try {
        await internalDeleteLead(leadToDelete.id);
        setIsDeleteLeadConfirmOpen(false);
        setLeadToDelete(null);
      } catch (error: any) {
        alert('Erro ao excluir lead: ' + error.message);
      }
    }
  };

  const openAddLead = () => { setEditingLead(null); setIsLeadModalOpen(true); };
  const openEditLead = (lead: Lead) => { setEditingLead(lead); setIsLeadModalOpen(true); };

  const isLoading = loadingCustomers || loadingGroups || loadingSales || loadingSuppliers || loadingLeads;
  const error = null; // Error handling is now inside hooks

  // --- TELA DE CARREGAMENTO INICIAL (SESSION CHECK) ---
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-24 h-24 flex items-center justify-center">
            <Plane className="w-16 h-16 text-[#19727d]" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight text-[#19727d]">Easy Fly</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Verificando Acesso...</p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DA TELA DE LOGIN ---
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Erro ao Carregar Dados</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{error}</p>
          </div>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-[#06B6D4] text-white rounded-xl font-bold hover:bg-[#0891B2] transition-colors shadow-lg shadow-cyan-500/20">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] dark:bg-[#0f172a] font-sans text-[#1A1A1A] dark:text-gray-100 overflow-hidden transition-colors duration-300">
      <MyProfileModal isOpen={isMyProfileModalOpen} onClose={() => setIsMyProfileModalOpen(false)} userEmail={user?.email || ''} />
      <CustomerModal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} onSave={handleSaveCustomer} customer={editingCustomer} />
      <GroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} onSave={handleSaveGroup} group={editingGroup} customers={customers} />
      <SaleModal 
        isOpen={isSaleModalOpen} 
        onClose={() => setIsSaleModalOpen(false)} 
        onSave={handleSaveSale} 
        sale={editingSale} 
        customers={customers} 
        groups={groups} 
        suppliers={suppliers}
        onAddCustomerClick={openAddCustomer} 
        onEditCustomerClick={openEditCustomer} 
        onDeleteCustomerClick={handleDeleteCustomer} 
      />
      <SupplierModal isOpen={isSupplierModalOpen} onClose={() => setIsSupplierModalOpen(false)} onSave={handleSaveSupplier} supplier={editingSupplier} />
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => { setIsLeadModalOpen(false); setEditingLead(null); }}
          onSave={handleSaveLead}
          editingLead={editingLead}
          suppliers={suppliers}
        />
      <DeleteConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDeleteCustomer} customerName={customerToDelete?.name || ''} />
      <DeleteConfirmationModal isOpen={isDeleteSaleConfirmOpen} onClose={() => setIsDeleteSaleConfirmOpen(false)} onConfirm={confirmDeleteSale} customerName={`Venda #${saleToDelete?.id}`} />
      <DeleteConfirmationModal isOpen={isDeleteSupplierConfirmOpen} onClose={() => setIsDeleteSupplierConfirmOpen(false)} onConfirm={confirmDeleteSupplier} customerName={supplierToDelete?.name || ''} />
      <DeleteConfirmationModal isOpen={isDeleteLeadConfirmOpen} onClose={() => setIsDeleteLeadConfirmOpen(false)} onConfirm={confirmDeleteLead} customerName={leadToDelete?.title || leadToDelete?.name || ''} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobileMenu} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 lg:relative lg:flex ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64 bg-[#19727d] text-white flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3 bg-[#19727d]">
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#145d66]/50 p-2">
              <img src="/logo2.png" alt="Easy Fly" className="w-full h-full object-contain" />
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <div className="overflow-hidden whitespace-nowrap animate-in slide-in-from-left duration-300">
                <h1 className="text-white font-black text-2xl tracking-tighter leading-none">Easy Fly</h1>
                <p className="text-white/70 font-bold text-[9px] uppercase tracking-[0.25em] mt-1 italic">Agência de Viagens</p>
              </div>
            )}
          </div>
          <button onClick={closeMobileMenu} className="lg:hidden p-2 hover:bg-white/10 rounded-lg"><X className="w-6 h-6" /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 bg-[#19727d] overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Visão Geral" active={activeView === 'dashboard'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('dashboard')} />
          <SidebarItem icon={<Target className="w-5 h-5" />} label="CRM" active={activeView === 'crm'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('crm')} />
          <SidebarItem icon={<ShoppingCart className="w-5 h-5" />} label="Vendas" active={activeView === 'vendas'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('vendas')} />
          <SidebarItem icon={<Users className="w-5 h-5" />} label="Clientes" active={activeView === 'clientes'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('clientes')} />
          <SidebarItem icon={<Calendar className="w-5 h-5" />} label="Reservas" active={activeView === 'reservas'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('reservas')} />
          <SidebarItem icon={<DollarSign className="w-5 h-5" />} label="Financeiro" active={activeView === 'financeiro'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('financeiro')} />
          {currentUser?.role === 'Administrador' && (
            <SidebarItem icon={<Truck className="w-5 h-5" />} label="Fornecedores" active={activeView === 'fornecedores'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('fornecedores')} />
          )}

          {/* <--- Item "Usuários" Adicionado na Sidebar */}
          <SidebarItem icon={<Shield className="w-5 h-5" />} label="Usuários" active={activeView === 'usuarios'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('usuarios')} />

          <SidebarItem icon={<BarChart3 className="w-5 h-5" />} label="Métricas" active={activeView === 'metricas'} collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={() => handleViewChange('metricas')} />
        </nav>

        <div className="px-3 py-4 border-t border-[#145d66] space-y-1 bg-[#19727d]">
          {mounted && (
            <SidebarItem 
              icon={theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} 
              label={theme === 'dark' ? "Modo Claro" : "Modo Escuro"} 
              collapsed={isSidebarCollapsed && !isMobileMenuOpen} 
              onClick={toggleTheme}
            />
          )}
          <SidebarItem icon={<ChevronLeft className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />} label="Recolher" collapsed={isSidebarCollapsed && !isMobileMenuOpen} className="hidden lg:flex" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <SidebarItem icon={<LogOut className="w-5 h-5" />} label="Sair" collapsed={isSidebarCollapsed && !isMobileMenuOpen} onClick={handleLogout} />
        </div>
        <SupabaseSyncHandler onRefresh={fetchData} collapsed={isSidebarCollapsed && !isMobileMenuOpen} />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm p-1.5 border border-gray-50">
              <img src="/logo2.png" alt="Easy Fly" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[#19727d] text-xl leading-none tracking-tighter">Easy Fly</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-0.5">Agência de Viagens</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"><Menu className="w-6 h-6 text-gray-600" /></button>
        </header>

        <div className={`flex-1 ${activeView === 'crm' ? 'overflow-hidden p-0' : 'overflow-y-auto p-4 md:p-6 lg:p-8'}`}>
          <AnimatePresence mode="wait">
            <motion.div key={activeView + (selectedCustomer ? '-details' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

              {activeView === 'clientes' && selectedCustomer ? (
                <CustomerDetailsView
                  customer={selectedCustomer}
                  sales={sales}
                  onBack={() => setSelectedCustomer(null)}
                  onEditCustomer={openEditCustomer}
                  currentUser={currentUser}
                />
              ) : activeView === 'dashboard' ? (
                <DashboardView sales={sales} onAddCustomer={openAddCustomer} onAddSale={openAddSale} setActiveView={setActiveView} onUpdateSaleStatus={handleUpdateSaleStatus} onAddLead={openAddLead} currentUser={currentUser} />
              ) : activeView === 'clientes' ? (
                <CustomersView
                  customers={customers}
                  groups={groups}
                  currentUser={currentUser}
                  onAddCustomer={openAddCustomer}
                  onEditCustomer={openEditCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  onAddGroup={openAddGroup}
                  onEditGroup={openEditGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onCustomerClick={(c: Customer) => setSelectedCustomer(c)}
                />
              ) : activeView === 'vendas' ? (
                <SalesView 
                  sales={sales} 
                  currentUser={currentUser}
                  onAddSale={openAddSale} 
                  onEditSale={openEditSale} 
                  onDeleteSale={handleDeleteSale} 
                  onUpdateSale={handleQuickUpdateSale}
                  fetchSales={fetchSales}
                />
               ) : activeView === 'crm' ? (
            <CRMView 
              leads={leads}
              loading={loadingLeads}
              updateLeadStatus={updateLeadStatus}
              onUpdateLead={internalSaveLead}
              fetchLeads={fetchLeads}
              currentUser={currentUser} 
              onAddLead={openAddLead} 
              onEditLead={openEditLead} 
              onDeleteLead={handleDeleteLead} 
            />
          ) : activeView === 'reservas' ? (
                <ReservasView />
              ) : activeView === 'financeiro' ? (
                <FinanceiroView />
              ) : activeView === 'metricas' ? (
                <MetricasView />
              ) : activeView === 'fornecedores' && currentUser?.role === 'Administrador' ? (
                <SuppliersView suppliers={suppliers} onAddSupplier={openAddSupplier} onEditSupplier={openEditSupplier} onDeleteSupplier={handleDeleteSupplier} currentUser={currentUser} />
              ) : activeView === 'usuarios' ? (
                <UsersView currentUser={currentUser} /> // <--- Renderização da tela de Usuários
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}