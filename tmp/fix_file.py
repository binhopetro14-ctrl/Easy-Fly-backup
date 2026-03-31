import sys

path = r'c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\app\cotacao\[id]\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Localizar o ponto de fusão (linha 1117 aproximadamente)
# Procurar por "{item.flightType === 'ida_volta' && inbound.length > 0 && ("
found_index = -1
for i, line in enumerate(lines):
    if "{item.flightType === 'ida_volta' && inbound.length > 0 && (" in line:
        found_index = i
        break

if found_index != -1:
    # Substituir da linha encontrada até o início do retorno do HotelItemCard
    # que está quebrado
    new_flight_closure = [
        "          <FlightLegCard \n",
        "             segments={inbound} \n",
        "             type=\"Volta\" \n",
        "             lead={lead} \n",
        "             itemDuration={item.returnDuration} \n",
        "          />\n",
        "       )}\n",
        "    </div>\n",
        "  );\n",
        "}\n\n",
        "function HotelItemCard({ item, fallbackCheckIn, fallbackCheckOut }: { \n",
        "  item: LeadItem; \n",
        "  fallbackCheckIn?: string; \n",
        "  fallbackCheckOut?: string; \n",
        "}) {\n"
    ]
    
    # Remover o trecho fundido (presumindo que a função HotelItemCard errada começava logo após)
    # Procurar o fim da declaração errada
    end_fusion = found_index + 1
    while end_fusion < len(lines) and "}) {" not in lines[end_fusion]:
        end_fusion += 1
    end_fusion += 1 # incluir a linha com }) {
    
    lines[found_index+1 : end_fusion] = new_flight_closure

    # Agora corrigir o fechamento final do HotelItemCard que está com extra </> ou similar
    # Procurar pelas linhas de garbage
    for i in range(len(lines)):
        if "tn:translate-x-1 transition-transform" in lines[i]:
            # Remover bloco de lixo
            j = i
            while j > 0 and "<AnimatePresence>" not in lines[j]:
                j -= 1
            # Remover até o fim do lixo
            k = i
            while k < len(lines) and "  );\n" != lines[k]:
                k += 1
            lines[j:k+2] = [] # Deleta o lixo
            break

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Sucesso: Arquivo corrigido via script Python.")
else:
    print("Erro: Ponto de fusão não encontrado.")
