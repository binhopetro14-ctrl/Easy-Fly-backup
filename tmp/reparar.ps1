$filePath = "c:\Users\Cleber\Documents\EASY FLY\SISTEMA\Easy Fly\components\LeadModal.tsx"
$lines = Get-Content $filePath

# Fix description logic (approx lines 384-386)
$lines[383] = "    const desc = currentItem.type === 'passagem' "
$lines[384] = "      ? (currentItem.outboundSegments?.[0]?.origin + ' → ' + currentItem.outboundSegments?.[currentItem.outboundSegments.length-1]?.destination) "
$lines[385] = "      : (currentItem.type === 'hospedagem' ? (currentItem.hotelName || 'Hospedagem') : (currentItem.type === 'seguro' ? 'Seguro Viagem' : 'Carro'));"

# Fix Tab Button (approx line 593)
# It's better to find the line by content and replace it
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "onClick=\{\(\) => setActiveItemType\(t\)\}") {
        $lines[$i] = $lines[$i] -replace "onClick=\{\(\) => setActiveItemType\(t\)\}", "onClick={() => { setActiveItemType(t); if (!editingItemId) { setCurrentItem(prev => ({ ...prev, type: t })); } }}"
    }
}

$lines | Set-Content $filePath -Encoding UTF8
