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
    <div className="bg-white dark:bg-[#1e293b] p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-2xl md:text-[32px] font-black text-[#111827] dark:text-white">{value}</p>
          <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-2">{description}</p>
        </div>
        <div className={`p-3 md:p-4 ${iconBg} dark:bg-cyan-950/40 rounded-2xl flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-16 md:w-24 h-16 md:h-24 bg-cyan-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
    </div>
  );
}
