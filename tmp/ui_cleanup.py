import os

def final_ui_cleanup(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
        
        # 1. Rename Tags label
        text = text.replace('Tags & Duração', 'Tags')
        
        # 2. Remove Taxes/Fees section from financial summary
        # We look for the entire block to be precise
        old_block = '''                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase">
                  <span>Taxes/Fees:</span>
                  <NumericFormat className="w-20 text-right bg-transparent border-none outline-none font-black text-gray-800 dark:text-white" value={formData.taxes} onValueChange={v => setFormData({...formData, taxes: v.floatValue || 0})} />
                </div>'''
        
        # If it doesn't match exactly because of indentation or different line endings, 
        # let's try a more robust approach
        if old_block in text:
            text = text.replace(old_block, '')
        else:
            # Try with single line match for the label part and the NumericFormat part
            import re
            text = re.sub(r'<div className="flex justify-between items-center text-\[10px\] font-black text-gray-400 uppercase">\s*<span>Taxes/Fees:</span>\s*<NumericFormat[^>]*value={formData\.taxes}[^>]*/>\s*</div>', '', text)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Successfully cleaned up {file_path}")
    except Exception as e:
        print(f"Failed to cleanup {file_path}: {e}")

file_path = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx"
if os.path.exists(file_path):
    final_ui_cleanup(file_path)
