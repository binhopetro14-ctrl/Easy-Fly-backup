import os

path = r'c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx'
if not os.path.exists(path):
    print(f"Error: {path} not found")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Fix description logic and arrow
    if "const desc = currentItem.type === 'passagem'" in line:
        new_lines.append(line)
        continue
    if "(' + currentItem.outboundSegments?" in line and 'â†’' in line:
        new_lines.append("      ? (currentItem.outboundSegments?.[0]?.origin + ' → ' + currentItem.outboundSegments?.[currentItem.outboundSegments.length-1]?.destination) \n")
        continue
    if "currentItem.hotelName || 'Serviço'" in line:
        new_lines.append("      : (currentItem.type === 'hospedagem' ? (currentItem.hotelName || 'Hospedagem') : (currentItem.type === 'seguro' ? 'Seguro Viagem' : 'Carro'));\n")
        continue
    
    # Fix tabs
    if "onClick={() => setActiveItemType(t)}" in line:
        new_lines.append(line.replace("onClick={() => setActiveItemType(t)}", 'onClick={() => { setActiveItemType(t); if (!editingItemId) { setCurrentItem(prev => ({ ...prev, type: t })); } }}'))
        continue
        
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Success")
