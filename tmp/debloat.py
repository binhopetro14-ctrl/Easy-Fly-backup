path = r'c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    stripped = line.strip()
    if stripped or (new_lines and new_lines[-1].strip()):
        new_lines.append(line)

# Also check for duplicate blocks of 10+ lines
# Standard header is about 15 lines of imports
# Let's just write and see.

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.writelines(new_lines)

print(f"Reduced from {len(lines)} to {len(new_lines)}")
