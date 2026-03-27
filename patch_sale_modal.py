import sys
import re

file_path = 'c:\\Users\\Cleber\\Documents\\EASY FLY\\SISTEMA\\Easy Fly\\components\\SaleModal.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Main containers
content = content.replace(
    'className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"',
    'className="relative w-full max-w-3xl bg-white dark:bg-[#1e293b] dark:border dark:border-slate-700/50 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"'
)
content = content.replace(
    'className="p-6 border-b border-gray-100 flex items-center justify-between bg-white"',
    'className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white dark:bg-[#1e293b]"'
)
content = content.replace("text-gray-900\">{sale ? 'Editar Emissão' : 'Nova Emissão'}", "text-gray-900 dark:text-gray-200\">{sale ? 'Editar Emissão' : 'Nova Emissão'}")
content = content.replace('p-2 hover:bg-gray-100 rounded-xl transition-all', 'p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all')

# 2. Text Colors
content = re.sub(r'text-gray-500 uppercase tracking-wider', r'text-gray-500 dark:text-gray-400 uppercase tracking-wider', content)
content = content.replace('text-gray-500 uppercase', 'text-gray-500 dark:text-gray-400 uppercase')
content = content.replace('text-xs font-bold text-gray-500', 'text-xs font-bold text-gray-500 dark:text-gray-400')
content = content.replace('text-[10px] font-black text-gray-400', 'text-[10px] font-black text-gray-400 dark:text-gray-500')
content = content.replace('text-[11px] font-black text-gray-400', 'text-[11px] font-black text-gray-400 dark:text-gray-500')
content = content.replace('text-sm font-black text-gray-800', 'text-sm font-black text-gray-800 dark:text-gray-200')
content = content.replace('text-gray-900', 'text-gray-900 dark:text-gray-100')

# 3. Toggle buttons
content = content.replace("bg-gray-100 text-gray-600 hover:bg-gray-200", "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700")

# 4. Client segment
content = content.replace('className="flex bg-gray-100 p-1 rounded-lg"', 'className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg"')
content = content.replace("bg-white text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-700", "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300")

# 5. Selects and inputs
content = content.replace('bg-gray-50 border border-gray-200', 'bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white')
content = content.replace('bg-white border border-gray-200', 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white')

# 6. Trash and plus buttons
content = content.replace('p-2.5 bg-gray-50 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50', 'p-2.5 bg-gray-50 dark:bg-slate-800/50 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10')
content = content.replace('p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200', 'p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700')

# 7. Item form bg
content = content.replace('id="item-form" className="p-6 bg-gray-50/50 border border-gray-100 rounded-[24px] space-y-6"', 'id="item-form" className="p-6 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 rounded-[24px] space-y-6"')

# 8. Item action buttons
content = content.replace("bg-white text-gray-500 border border-gray-200", "bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700")

# 9. Disabled inputs
content = content.replace('disabled:bg-gray-100', 'disabled:bg-gray-100 dark:disabled:bg-slate-800')

# 10. Bottom section
content = content.replace('className="p-6 border-t border-gray-100 bg-white"', 'className="p-6 border-t border-gray-100 dark:border-slate-700/50 bg-white dark:bg-[#1e293b]"')
content = content.replace('className="p-4 bg-gray-50 rounded-2xl text-center"', 'className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-center"')
content = content.replace('className="p-4 bg-green-50 rounded-2xl text-center"', 'className="p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl text-center"')

# 11. Passengers list borders and bgs
content = content.replace('border border-cyan-100 rounded-2xl', 'border border-cyan-100 dark:border-cyan-500/20 rounded-2xl')
content = content.replace('bg-cyan-50/50', 'bg-cyan-50/50 dark:bg-cyan-500/10')

# 12. Modal de ajuda
content = content.replace('bg-white rounded-[32px] w-full max-w-4xl', 'bg-white dark:bg-[#1e293b] rounded-[32px] w-full max-w-4xl border border-gray-100 dark:border-slate-700/50')
content = content.replace('bg-white z-10"', 'bg-white dark:bg-[#1e293b] z-10"')
content = content.replace('text-gray-800">', 'text-gray-800 dark:text-gray-200">')
content = content.replace('bg-gray-50 text-gray-900', 'bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100')
content = content.replace('border border-gray-100 rounded-3xl', 'border border-gray-100 dark:border-slate-700/50 rounded-3xl')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
