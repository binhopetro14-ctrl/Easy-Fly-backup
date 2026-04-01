$file = 'c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx'
$content = Get-Content $file -Raw -Encoding UTF8

# 1. Corrigir seta e lógica de descrição
$oldDesc = 'const desc = currentItem.type === ''passagem'' \r?\n\s+\? \(currentItem.outboundSegments\?\.\[0\]\?\.origin \+ '' â†’ '' \+ currentItem.outboundSegments\?\.\[currentItem.outboundSegments.length-1\]\?\.destination\) \r?\n\s+: \(currentItem.hotelName \|\| ''Serviço''\);'
$newDesc = 'const desc = currentItem.type === ''passagem'' \r\n      ? (currentItem.outboundSegments?.[0]?.origin + '' → '' + currentItem.outboundSegments?.[currentItem.outboundSegments.length-1]?.destination) \r\n      : (currentItem.type === ''hospedagem'' ? (currentItem.hotelName || ''Hospedagem'') : (currentItem.type === ''seguro'' ? ''Seguro Viagem'' : ''Carro''));'

# 2. Corrigir abas
$oldTabs = 'onClick=\{\(\) => setActiveItemType\(t\)\}'
$newTabs = 'onClick={() => { setActiveItemType(t); if (!editingItemId) { setCurrentItem(prev => ({ ...prev, type: t })); } }}'

# Aplicar substituições (Regex)
$content = [regex]::Replace($content, $oldDesc, $newDesc)
$content = [regex]::Replace($content, $oldTabs, $newTabs)

Set-Content $file $content -Encoding UTF8
