import os
import re

def final_polish(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
        
        # 1. More Typos / Encoding Artifacts
        text = text.replace('âš ï¸ ', '⚠️')
        text = text.replace('â€“', '–')
        
        # 2. Centralize Title and Name inputs for consistency with "Centralize os textos"
        # Line 491: Título da Viagem
        text = text.replace('placeholder="Ex: Lua de Mel Maldivas" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-xl outline-none font-bold text-gray-800 dark:text-white focus:border-cyan-400 transition-all shadow-sm"', 
                            'placeholder="Ex: Lua de Mel Maldivas" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-xl outline-none font-bold text-gray-800 dark:text-white focus:border-cyan-400 transition-all shadow-sm text-center"')
        
        # Line 495: Nome do Cliente
        text = text.replace('placeholder="Busque ou digite o nome" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-xl outline-none font-bold text-gray-800 dark:text-white focus:border-cyan-400 transition-all shadow-sm"', 
                            'placeholder="Busque ou digite o nome" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-xl outline-none font-bold text-gray-800 dark:text-white focus:border-cyan-400 transition-all shadow-sm text-center"')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Successfully polished {file_path}")
    except Exception as e:
        print(f"Failed to polish {file_path}: {e}")

file_path = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx"
if os.path.exists(file_path):
    final_polish(file_path)
