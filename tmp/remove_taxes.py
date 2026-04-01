import os
import re

def remove_taxes_fees(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
        
        # Regex to match the Taxes/Fees div block including its content and trailing spaces/newlines
        # We look for the div with Taxes/Fees text and the NumericFormat for formData.taxes
        pattern = r'\s*<div className="flex justify-between items-center text-\[10px\] font-black text-gray-400 uppercase">\s*<span>Taxes/Fees:</span>\s*<NumericFormat className="w-20 text-right bg-transparent border-none outline-none font-black text-gray-800 dark:text-white" value=\{formData\.taxes\} onValueChange=\{v => setFormData\(\{\.\.\.formData, taxes: v\.floatValue \|\| 0\}\)\} />\s*</div>'
        
        new_text = re.sub(pattern, '', text)
        
        if new_text != text:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_text)
            print(f"Successfully removed Taxes/Fees from {file_path}")
        else:
            print(f"Pattern not found in {file_path}")
            
    except Exception as e:
        print(f"Failed to remove Taxes/Fees from {file_path}: {e}")

file_path = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx"
if os.path.exists(file_path):
    remove_taxes_fees(file_path)
