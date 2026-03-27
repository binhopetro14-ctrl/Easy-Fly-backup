'use client';

import React from 'react';
import { Target, Users, Mail, Calendar, Wallet, CreditCard, BarChart3 } from 'lucide-react';

export function CRMView() {
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">CRM</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie seus leads e oportunidades</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[200px] text-gray-400 dark:text-gray-500 italic">
          <Target className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">Funil de Vendas em desenvolvimento...</p>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[200px] text-gray-400 dark:text-gray-500 italic">
          <Users className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">Gestão de Leads em desenvolvimento...</p>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[200px] text-gray-400 dark:text-gray-500 italic">
          <Mail className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">Automação de E-mail em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
}

export function ReservasView() {
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Reservas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Acompanhe todas as reservas e vouchers</p>
      </div>
      <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[400px] text-gray-400 dark:text-gray-500 italic">
        <Calendar className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-sm">Calendário de Reservas em desenvolvimento...</p>
      </div>
    </div>
  );
}

export function FinanceiroView() {
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Financeiro</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Controle seu fluxo de caixa e comissões</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[250px] text-gray-400 dark:text-gray-500 italic">
          <Wallet className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">Fluxo de Caixa em desenvolvimento...</p>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[250px] text-gray-400 dark:text-gray-500 italic">
          <CreditCard className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">Contas a Pagar/Receber em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
}

export function MetricasView() {
  return (
    <div className="space-y-4 md:space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Métricas</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Análise detalhada do desempenho da sua agência</p>
      </div>
      <div className="bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex flex-col items-center justify-center min-h-[400px] text-gray-400 dark:text-gray-500 italic">
        <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-sm">Relatórios Avançados em desenvolvimento...</p>
      </div>
    </div>
  );
}