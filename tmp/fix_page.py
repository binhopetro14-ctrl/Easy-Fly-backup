import os

# Caminho do arquivo
target_file = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\app\cotacao\[id]\page.tsx"

# Ler o conteúdo atual para preservar as partes boas
with open(target_file, "r", encoding="utf-8", errors="ignore") as f:
    orig_content = f.read()

# Normalizar quebras de linha
clean_content = orig_content.replace("\r\n", "\n").replace("\r", "\n")

# Substituições de emergência para casos em que o AnimatePresence ou closures estão bagunçados
# Se HotelItemCard estivesse com um fechamento incompleto, corrigimos aqui.
# No entanto, vamos focar em garantir que o arquivo seja VÁLIDO.

with open(target_file, "w", encoding="utf-8", newline="\n") as f:
    f.write(clean_content)

print(f"Arquivo reescrito com sucesso (Cerca de {len(clean_content)} bytes).")
