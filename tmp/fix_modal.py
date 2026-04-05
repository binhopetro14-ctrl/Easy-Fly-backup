import os

file_path = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\SaleModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Localizar o bloco entre 380 e 400
# Vamos procurar a linha 'if (currentItems.length === 0) {'
start_idx = -1
for i, line in enumerate(lines):
    if "if (currentItems.length === 0) {" in line and "handleSubmit" in "".join(lines[i-100:i]):
        start_idx = i
        break

if start_idx != -1:
    # Procurar o fim do bloco problemático (antes de '// Generate product name summary')
    end_idx = -1
    for i in range(start_idx, start_idx + 50):
        if "// Generate product name summary" in lines[i]:
            end_idx = i
            break
    
    if end_idx != -1:
        new_logic = [
            "    if (currentItems.length === 0) {\n",
            "      setError('Adicione pelo menos um item à venda antes de finalizar.');\n",
            "      return;\n",
            "    }\n",
            "\n",
            "    if (currentItems.some(item => !item.emissionDate)) {\n",
            "      setError('Todos os itens da venda devem ter a Data de Emissão preenchida.');\n",
            "      return;\n",
            "    }\n",
            "\n"
        ]
        # Substituir o intervalo
        lines[start_idx:end_idx] = new_logic
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(lines)
        print("Correção aplicada com sucesso via Python.")
    else:
        print("Fim do bloco não encontrado.")
else:
    print("Início do bloco não encontrado.")
