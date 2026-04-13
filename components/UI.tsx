'use client';

import React from 'react';
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
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SidebarSection({ label, collapsed }: { label: string, collapsed?: boolean }) {
  if (collapsed) return <div className="h-6 border-t border-white/5 my-2" />;
  return (
    <div className="px-4 pt-2 pb-2">
      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
  subItems?: { label: string; active: boolean; onClick: () => void }[];
  isExpanded?: boolean;
  onExpand?: () => void;
  compact?: boolean;
}

export function SidebarItem({ 
  icon, 
  label, 
  active, 
  collapsed, 
  onClick, 
  className = "",
  subItems = [],
  isExpanded,
  onExpand,
  compact = false
}: SidebarItemProps) {
  const hasSubItems = subItems.length > 0;

  return (
    <div className="w-full space-y-1">
      <button 
        onClick={(e) => {
          if (hasSubItems && onExpand) {
            e.stopPropagation();
            onExpand();
          } else if (onClick) {
            onClick();
          }
        }}
        className={`w-full flex items-center justify-between px-4 ${compact ? 'py-1.5' : 'py-2.5'} rounded-xl ${compact ? 'text-[11px]' : 'text-[12px]'} font-bold transition-all duration-200 cursor-pointer ${
          active && !hasSubItems
            ? 'bg-white text-[#19727d] shadow-lg shadow-black/5' 
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        } ${collapsed ? 'justify-center px-0' : ''} ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`flex-shrink-0 ${compact ? 'scale-90' : ''}`}>{icon}</div>
          {!collapsed && <span className="whitespace-nowrap">{label}</span>}
        </div>
        
        {!collapsed && hasSubItems && (
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Sub-itens */}
      <AnimatePresence>
        {!collapsed && hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-9 space-y-1"
          >
            {subItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full text-left py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all ${
                  item.active 
                    ? 'text-white bg-white/10' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HeaderButton({ icon, label, primary, onClick }: { icon: React.ReactNode, label: string, primary?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
      primary 
        ? 'bg-[#19727d] text-white hover:bg-[#15616a] shadow-lg shadow-[#19727d]/20' 
        : 'bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function StatCard({ label, value, description, icon, iconBg }: { label: string, value: string, description: React.ReactNode, icon: React.ReactNode, iconBg: string }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer min-h-[140px]">
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <p className="text-[10px] md:text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-4">{label}</p>
          <p className="text-xl md:text-2xl font-black text-[#111827] dark:text-white tracking-tighter leading-tight">{value}</p>
        </div>
        <div className="mt-4">{description}</div>
      </div>
      
      {/* Ícone no canto superior direito */}
      <div className={`absolute top-5 right-5 w-10 h-10 md:w-12 md:h-12 ${iconBg} dark:bg-[#19727d]/10 rounded-xl flex items-center justify-center shadow-sm border border-white/50 dark:border-white/5 z-0 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      
      {/* Círculo decorativo ao fundo */}
      <div className="absolute -right-4 -bottom-4 w-16 md:w-20 h-16 md:h-20 bg-[#19727d]/5 dark:bg-[#19727d]/5 rounded-full opacity-40 group-hover:scale-110 transition-transform z-0"></div>
    </div>
  );
}
