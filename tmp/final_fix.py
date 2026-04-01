import os
import re

path = r'c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean extra spaces (more than 2 newlines -> 2 newlines)
content = re.sub(r'\n{3,}', '\n\n', content)

# 2. Fix description logic and arrow
# Using a broad match to handle the corrupted â†’
desc_pattern = r"const desc = currentItem\.type === 'passagem'.*?currentItem\.hotelName \|\| 'Serviço'\);"
new_desc = """const desc = currentItem.type === 'passagem' 
      ? (currentItem.outboundSegments?.[0]?.origin + ' → ' + currentItem.outboundSegments?.[currentItem.outboundSegments.length-1]?.destination) 
      : (currentItem.type === 'hospedagem' ? (currentItem.hotelName || 'Hospedagem') : (currentItem.type === 'seguro' ? 'Seguro Viagem' : 'Carro'));"""

content = re.sub(desc_pattern, new_desc, content, flags=re.DOTALL)

# 3. Fix tab buttons
tab_pattern = r"onClick=\{\(\) => setActiveItemType\(t\)\}"
new_tabs = "onClick={() => { setActiveItemType(t); if (!editingItemId) { setCurrentItem(prev => ({ ...prev, type: t })); } }}"
content = re.sub(tab_pattern, new_tabs, content)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("Done")
