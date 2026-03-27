import sys
import re

def patch_group_modal():
    file_path = 'c:\\Users\\Cleber\\Documents\\EASY FLY\\SISTEMA\\Easy Fly\\components\\GroupModal.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('bg-white rounded-3xl shadow-2xl overflow-hidden', 'bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl overflow-hidden dark:border dark:border-slate-700/50')
    content = content.replace('border-b border-gray-100 flex items-center justify-between bg-white text-gray-800', 'border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-200')
    content = content.replace('p-2 hover:bg-gray-100 rounded-lg transition-colors', 'p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors')
    content = content.replace('text-gray-400"', 'text-gray-400 dark:text-gray-500"')
    
    content = content.replace('text-lg font-bold text-gray-800', 'text-lg font-bold text-gray-800 dark:text-gray-200')
    content = content.replace('p-6 border border-gray-100 rounded-2xl space-y-6', 'p-6 border border-gray-100 dark:border-slate-700/50 rounded-2xl space-y-6')
    content = content.replace('text-sm font-bold text-gray-600', 'text-sm font-bold text-gray-600 dark:text-gray-400')
    
    content = content.replace('bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm"', 'bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm text-gray-900 dark:text-white"')
    content = content.replace('bg-gray-50 border border-gray-200 rounded-xl"', 'bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white"')
    
    content = content.replace('text-sm font-bold text-gray-700 uppercase', 'text-sm font-bold text-gray-700 dark:text-gray-300 uppercase')
    content = content.replace('text-gray-400 hover:text-red-500', 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400')
    
    content = content.replace('bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto z-10', 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-10')
    content = content.replace('hover:bg-gray-50 text-sm font-medium border-b border-gray-50', 'hover:bg-gray-50 dark:hover:bg-slate-700/50 text-sm font-medium border-b border-gray-50 dark:border-slate-700/50 text-gray-900 dark:text-gray-200')
    content = content.replace('text-gray-400">Todos', 'text-gray-400 dark:text-gray-500">Todos')
    
    content = content.replace('text-sm font-bold text-gray-700 flex', 'text-sm font-bold text-gray-700 dark:text-gray-300 flex')
    content = content.replace('bg-gray-100 rounded-full', 'bg-gray-100 dark:bg-slate-800 rounded-full')
    
    content = content.replace('border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50"', 'border-t border-gray-100 dark:border-slate-700/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-800/50"')
    content = content.replace('text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all', 'text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def patch_supplier_modal():
    file_path = 'c:\\Users\\Cleber\\Documents\\EASY FLY\\SISTEMA\\Easy Fly\\components\\SupplierModal.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]', 'bg-white dark:bg-[#1e293b] rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] dark:border dark:border-slate-700/50')
    content = content.replace('p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10', 'p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b] sticky top-0 z-10')
    
    content = content.replace('bg-cyan-50 rounded-2xl flex items-center', 'bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl flex items-center')
    content = content.replace('text-gray-900 uppercase tracking-tight', 'text-gray-900 dark:text-gray-200 uppercase tracking-tight')
    content = content.replace('p-2 hover:bg-gray-100 rounded-full transition-colors', 'p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors')
    content = content.replace('text-gray-400"', 'text-gray-400 dark:text-gray-500"')

    content = content.replace('text-xs font-bold text-gray-500 uppercase tracking-wider', 'text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider')
    content = content.replace('bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium"', 'bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium text-gray-900 dark:text-white"')

    content = content.replace('p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50', 'p-4 border-t border-gray-100 dark:border-slate-700/50 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-800/50')
    content = content.replace('text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all', 'text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

patch_group_modal()
patch_supplier_modal()
