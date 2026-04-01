import os
import re

def fix_sale_modal_colors(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
        
        # Replace cyan-icon color with gray-400
        text = text.replace('text-[#06B6D4]', 'text-gray-400')
        
        # Replace hover cyan color with hover gray-600 (light) or gray-300 (dark)
        # The specific pattern in the buttons is hover:text-[#06B6D4]
        text = text.replace('hover:text-[#06B6D4]', 'hover:text-gray-600 dark:hover:text-gray-300')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Successfully fixed colors in {file_path}")
    except Exception as e:
        print(f"Failed to fix colors in {file_path}: {e}")

file_path = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\SaleModal.tsx"
if os.path.exists(file_path):
    fix_sale_modal_colors(file_path)
