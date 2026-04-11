export interface FlightLeg {
  date: string;
  origin: string;
  departure: string;
  arrival: string;
  destination: string;
  airline: string;
  class: string;
  isReturn?: boolean;
  duration?: string;
  departureTime?: string;
  arrivalTime?: string;
  originAirport?: string;
  destinationAirport?: string;
}

export function normalizeFlightLeg(leg: FlightLeg): FlightLeg {
  const newLeg = { ...leg };

  // BFS Correction - Belfast International Airport (Northern Ireland)
  const isBFS = (val: string = '', name: string = '') => {
    const v = val.toUpperCase();
    const n = name.toUpperCase();
    return v.includes('BFS') || n.includes('BOEDEKER') || n.includes('CHILDRESS');
  };

  if (isBFS(newLeg.origin, newLeg.originAirport)) {
    newLeg.origin = 'Belfast (BFS)';
    newLeg.originAirport = 'Belfast International Airport, Irlanda do Norte';
  }

  if (isBFS(newLeg.destination, newLeg.destinationAirport)) {
    newLeg.destination = 'Belfast (BFS)';
    newLeg.destinationAirport = 'Belfast International Airport, Irlanda do Norte';
  }

  return newLeg;
}
