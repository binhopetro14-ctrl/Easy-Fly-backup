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
import { motion } from 'motion/react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SidebarItem({ icon, label, active, collapsed, onClick, className = "" }: SidebarItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
        active 
          ? 'bg-white text-[#19727d] shadow-lg shadow-black/5' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      } ${collapsed ? 'justify-center px-0' : ''} ${className}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}

export function HeaderButton({ icon, label, primary, onClick }: { icon: React.ReactNode, label: string, primary?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
      primary 
        ? 'bg-[#06B6D4] text-white hover:bg-[#0891B2] shadow-lg shadow-cyan-500/20' 
        : 'bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function StatCard({ label, value, description, icon, iconBg }: { label: string, value: string, description: string, icon: React.ReactNode, iconBg: string }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-center h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="text-[10px] md:text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-xl md:text-2xl font-black text-[#111827] dark:text-white tracking-tighter">{value}</p>
          </div>
          <p className="text-[10px] md:text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-2">{description}</p>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 ${iconBg} dark:bg-cyan-950/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-white/50 dark:border-white/5`}>
          {icon}
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-16 md:w-20 h-16 md:h-20 bg-cyan-50/50 dark:bg-cyan-500/5 rounded-full opacity-40 group-hover:scale-110 transition-transform"></div>
    </div>
  );
}
