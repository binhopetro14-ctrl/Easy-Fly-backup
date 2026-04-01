import os

def fix_more_ui_issues(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    
    try:
        text = content.decode('utf-8')
        
        # Typos
        text = text.replace('NÂº Voo', 'Nº Voo')
        text = text.replace('NÂ° Voo', 'Nº Voo') # Variation
        
        # Ensure price fields have centering if missed or for consistency
        # (This is already handled by my previous multi_replace if it succeeded, 
        # but let's be double sure or handle cases where it didn't)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Successfully fixed {file_path}")
    except Exception as e:
        print(f"Failed to fix {file_path}: {e}")

file_path = r"c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx"
if os.path.exists(file_path):
    fix_more_ui_issues(file_path)
