export const AIRPORT_NAME_MAP: Record<string, string> = {
  'BFS': 'Aeroporto Internacional de Belfast (Capital da Irlanda do Norte)',
};

/**
 * Corrige o nome de um aeroporto com base no seu código IATA.
 * Se houver um mapeamento para o código, retorna o nome correto.
 * Caso contrário, tenta extrair o código do nome atual ou retorna o nome original.
 */
export function correctAirportName(code: string, currentName: string = ''): string {
  const normalizedCode = code.toUpperCase().trim();
  
  if (AIRPORT_NAME_MAP[normalizedCode]) {
    return AIRPORT_NAME_MAP[normalizedCode];
  }

  return currentName;
}

/**
 * Tenta inferir o código IATA de uma string como "Belfast (BFS)" ou apenas "BFS"
 */
export function extractIataCode(input: string): string | null {
  const match = input.match(/\(([A-Z]{3})\)/) || input.match(/^([A-Z]{3})$/);
  return match ? match[1] : null;
}
