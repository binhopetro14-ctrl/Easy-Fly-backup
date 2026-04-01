import os
import re

def remove_sale_installments(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
        
        # Regex to match the entire installment block in SaleModal.tsx
        # It starts with the comment "Bloco de Parcelamento Adicionado" or the div with specific classes
        pattern = r'\s*\{/\* Bloco de Parcelamento Adicionado \*/\}\s*<div className="bg-gradient-to-br from-amber-50 to-amber-100/50.*?<\/select>\s*<\/div>\s*<\/div>'
        
        # Let's try a simpler regex match if that one is too complex
        # Just look for the label "Parcelamento na Cotação" and its parent container
        new_text = re.sub(r'\s*\{/\* Bloco de Parcelamento Adicionado \*/\}\s*<div className="bg-gradient-to-br from-amber-50 to-amber-100/50.*?<\/select>\s*<\/div>\s*<\/div>', '', text, flags=re.DOTALL)
        
        if new_text == text:
            # Try matching by the label text itself
            print("Trying fallback regex...")
            new_text = re.sub(r'\s*<div className="bg-gradient-to-br from-amber-50 to-amber-100/50.*?Parcelamento na Cotação.*?<\/div>\s*<\/div>\s*<\/div>', '', text, flags=re.DOTALL)

        if new_text != text:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_text)
            print(f"Successfully removed installment section from {file_path}")
        else:
            print(f"Pattern not found in {file_path}")
            
    except Exception as e:
        print(f"Failed to remove installment section from {file_path}: {e}")

file_path = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\SaleModal.tsx"
if os.path.exists(file_path):
    remove_sale_installments(file_path)
