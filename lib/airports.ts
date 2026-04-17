// Base de Aeroportos IATA - Brasil e Europa (Expandida)
// Total de aeroportos: 1420
export const ALL_AIRPORTS = [
  // --- METACÓDIGOS (CIDADES COM MÚLTIPLOS AEROPORTOS) ---
  { iata: 'SAO', name: 'Todos os Aeroportos', city: 'São Paulo', country: 'BR', isCity: true },
  { iata: 'RIO', name: 'Todos os Aeroportos', city: 'Rio de Janeiro', country: 'BR', isCity: true },
  { iata: 'BHZ', name: 'Todos os Aeroportos', city: 'Belo Horizonte', country: 'BR', isCity: true },
  { iata: 'LON', name: 'Todos os Aeroportos', city: 'Londres', country: 'GB', isCity: true },
  { iata: 'PAR', name: 'Todos os Aeroportos', city: 'Paris', country: 'FR', isCity: true },
  { iata: 'NYC', name: 'Todos os Aeroportos', city: 'Nova York', country: 'US', isCity: true },
  { iata: 'ROM', name: 'Todos os Aeroportos', city: 'Roma', country: 'IT', isCity: true },
  { iata: 'MIL', name: 'Todos os Aeroportos', city: 'Milão', country: 'IT', isCity: true },
  { iata: 'BER', name: 'Todos os Aeroportos', city: 'Berlim', country: 'DE', isCity: true },
  { iata: 'STO', name: 'Todos os Aeroportos', city: 'Estocolmo', country: 'SE', isCity: true },
  { iata: 'REK', name: 'Todos os Aeroportos', city: 'Reykjavik', country: 'IS', isCity: true },
  { iata: 'BUH', name: 'Todos os Aeroportos', city: 'Bucareste', country: 'RO', isCity: true },
  { iata: 'GLA', name: 'Todos os Aeroportos', city: 'Glasgow', country: 'GB', isCity: true },
  { iata: 'TCI', name: 'Todos os Aeroportos', city: 'Tenerife', country: 'ES', isCity: true },
  { iata: 'YTO', name: 'Todos os Aeroportos', city: 'Toronto', country: 'CA', isCity: true },
  { iata: 'TYO', name: 'Todos os Aeroportos', city: 'Tóquio', country: 'JP', isCity: true },
  {
    "iata": "AEY",
    "name": "Akureyri Airport",
    "city": "Akureyri",
    "country": "IS"
  },
  {
    "iata": "BIU",
    "name": "Bildudalur Airport",
    "city": "Bildudalur",
    "country": "IS"
  },
  {
    "iata": "BGJ",
    "name": "Borgarfjordur eystri Airport",
    "city": "Borgarfjordur eystri",
    "country": "IS"
  },
  {
    "iata": "BJD",
    "name": "Bakkafjordur Airport",
    "city": "Bakkafjordur",
    "country": "IS"
  },
  {
    "iata": "BLO",
    "name": "Hjaltabakki Airport",
    "city": "Blonduos",
    "country": "IS"
  },
  {
    "iata": "BQD",
    "name": "Budardalur Airport",
    "city": "Budardalur",
    "country": "IS"
  },
  {
    "iata": "BXV",
    "name": "Breiddalsvik Airport",
    "city": "Breiddalsvik",
    "country": "IS"
  },
  {
    "iata": "DJU",
    "name": "Djupivogur Airport",
    "city": "Djupivogur",
    "country": "IS"
  },
  {
    "iata": "EGS",
    "name": "Egilsstadir Airport",
    "city": "Egilsstadir",
    "country": "IS"
  },
  {
    "iata": "FAS",
    "name": "Faskrudsfjordur Airport",
    "city": "Faskrudsfjordur",
    "country": "IS"
  },
  {
    "iata": "FAG",
    "name": "Fagurholsmyri Airport",
    "city": "Fagurholsmyri",
    "country": "IS"
  },
  {
    "iata": "GUU",
    "name": "Grundarfjordur Airport",
    "city": "Grundarfjordur",
    "country": "IS"
  },
  {
    "iata": "GJR",
    "name": "Gjogur Airport",
    "city": "Gjogur",
    "country": "IS"
  },
  {
    "iata": "GRY",
    "name": "Grimsey Airport",
    "city": "Grimsey",
    "country": "IS"
  },
  {
    "iata": "HVK",
    "name": "Holmavik Airport",
    "city": "Holmavik",
    "country": "IS"
  },
  {
    "iata": "HFN",
    "name": "Hornafjordur Airport",
    "city": "Hornafjordur",
    "country": "IS"
  },
  {
    "iata": "FLI",
    "name": "Holt Airport",
    "city": "Flateyri",
    "country": "IS"
  },
  {
    "iata": "HZK",
    "name": "Husavik Airport",
    "city": "Husavik",
    "country": "IS"
  },
  {
    "iata": "HVM",
    "name": "Krokstadarmelar Airport",
    "city": "Hvammstangi",
    "country": "IS"
  },
  {
    "iata": "HLO",
    "name": "Ingjaldssandur Airport",
    "city": "Onundarfjordur",
    "country": "IS"
  },
  {
    "iata": "IFJ",
    "name": "Isafjordur Airport",
    "city": "Isafjordur",
    "country": "IS"
  },
  {
    "iata": "KEF",
    "name": "Keflavik International Airport",
    "city": "Reykjavik",
    "country": "IS"
  },
  {
    "iata": "OPA",
    "name": "Kopasker Airport",
    "city": "Kopasker",
    "country": "IS"
  },
  {
    "iata": "SAK",
    "name": "Saudarkrokur Airport",
    "city": "Saudarkrokur",
    "country": "IS"
  },
  {
    "iata": "NOR",
    "name": "Nordfjordur Airport",
    "city": "Nordfjordur",
    "country": "IS"
  },
  {
    "iata": "OFJ",
    "name": "Olafsfjordur Airport",
    "city": "Olafsfjordur",
    "country": "IS"
  },
  {
    "iata": "PFJ",
    "name": "Patreksfjordur Airport",
    "city": "Patreksfjordur",
    "country": "IS"
  },
  {
    "iata": "RHA",
    "name": "Reykholar Airport",
    "city": "Reykholar",
    "country": "IS"
  },
  {
    "iata": "OLI",
    "name": "Rif Airport",
    "city": "Rif",
    "country": "IS"
  },
  {
    "iata": "RFN",
    "name": "Raufarhofn Airport",
    "city": "Raufarhofn",
    "country": "IS"
  },
  {
    "iata": "RKV",
    "name": "Reykjavik Airport",
    "city": "Reykjavik",
    "country": "IS"
  },
  {
    "iata": "MVA",
    "name": "Reykjahlid Airport",
    "city": "Myvatn",
    "country": "IS"
  },
  {
    "iata": "SIJ",
    "name": "Siglufjordur Airport",
    "city": "Siglufjordur",
    "country": "IS"
  },
  {
    "iata": "SYK",
    "name": "Stykkisholmur Airport",
    "city": "Stykkisholmur",
    "country": "IS"
  },
  {
    "iata": "TEY",
    "name": "Tingeyri Airport",
    "city": "Tingeyri",
    "country": "IS"
  },
  {
    "iata": "THO",
    "name": "Thorshofn Airport",
    "city": "Thorshofn",
    "country": "IS"
  },
  {
    "iata": "VEY",
    "name": "Vestmannaeyjar Airport",
    "city": "Vestmannaeyjar",
    "country": "IS"
  },
  {
    "iata": "VPN",
    "name": "Vopnafjordur Airport",
    "city": "Vopnafjordur",
    "country": "IS"
  },
  {
    "iata": "ANR",
    "name": "Antwerp International Airport (Deurne)",
    "city": "Antwerp",
    "country": "BE"
  },
  {
    "iata": "BRU",
    "name": "Brussels Airport",
    "city": "Brussels",
    "country": "BE"
  },
  {
    "iata": "CRL",
    "name": "Brussels South Charleroi Airport",
    "city": "Brussels",
    "country": "BE"
  },
  {
    "iata": "KJK",
    "name": "Wevelgem Airport",
    "city": "Wevelgem",
    "country": "BE"
  },
  {
    "iata": "LGG",
    "name": "Liege Airport",
    "city": "Liege",
    "country": "BE"
  },
  {
    "iata": "QNM",
    "name": "Suarlee Airport",
    "city": "Namur",
    "country": "BE"
  },
  {
    "iata": "OST",
    "name": "Ostend-Bruges International Airport",
    "city": "Ostend",
    "country": "BE"
  },
  {
    "iata": "QHA",
    "name": "Hasselt Airport",
    "city": "Hasselt",
    "country": "BE"
  },
  {
    "iata": "OBL",
    "name": "Oostmalle Air Base",
    "city": "Zoersel",
    "country": "BE"
  },
  {
    "iata": "AOC",
    "name": "Altenburg-Nobitz Airport",
    "city": "Altenburg",
    "country": "DE"
  },
  {
    "iata": "HDF",
    "name": "Heringsdorf Airport",
    "city": "Heringsdorf",
    "country": "DE"
  },
  {
    "iata": "ZHZ",
    "name": "Halle-Oppin Airport",
    "city": "Oppin",
    "country": "DE"
  },
  {
    "iata": "IES",
    "name": "Riesa-Gohlis Airport",
    "city": "Riesa",
    "country": "DE"
  },
  {
    "iata": "REB",
    "name": "Rechlin-Larz Airport",
    "city": "Larz",
    "country": "DE"
  },
  {
    "iata": "CSO",
    "name": "Cochstedt Airport",
    "city": "Magdeburg",
    "country": "DE"
  },
  {
    "iata": "BBH",
    "name": "Barth Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "ZMG",
    "name": "Magdeburg Airport",
    "city": "Magdeburg",
    "country": "DE"
  },
  {
    "iata": "CBU",
    "name": "Cottbus-Drewitz Airport",
    "city": "Cottbus",
    "country": "DE"
  },
  {
    "iata": "GTI",
    "name": "Rugen Airport",
    "city": "Rugen",
    "country": "DE"
  },
  {
    "iata": "KOQ",
    "name": "Kothen Airport",
    "city": "Kothen",
    "country": "DE"
  },
  {
    "iata": "PEF",
    "name": "Peenemunde Airport",
    "city": "Peenemunde",
    "country": "DE"
  },
  {
    "iata": "BER",
    "name": "Berlin Brandenburg Airport",
    "city": "Berlin",
    "country": "DE"
  },
  {
    "iata": "DRS",
    "name": "Dresden Airport",
    "city": "Dresden",
    "country": "DE"
  },
  {
    "iata": "ERF",
    "name": "Erfurt Airport",
    "city": "Erfurt",
    "country": "DE"
  },
  {
    "iata": "FRA",
    "name": "Frankfurt am Main International Airport",
    "city": "Frankfurt-am-Main",
    "country": "DE"
  },
  {
    "iata": "FMO",
    "name": "Munster Osnabruck Airport",
    "city": "Munster",
    "country": "DE"
  },
  {
    "iata": "HAM",
    "name": "Hamburg Airport",
    "city": "Hamburg",
    "country": "DE"
  },
  {
    "iata": "THF",
    "name": "Berlin Tempelhof Airport",
    "city": "Berlin",
    "country": "DE"
  },
  {
    "iata": "CGN",
    "name": "Cologne Bonn Airport",
    "city": "Cologne",
    "country": "DE"
  },
  {
    "iata": "DUS",
    "name": "Dusseldorf International Airport",
    "city": "Dusseldorf",
    "country": "DE"
  },
  {
    "iata": "MUC",
    "name": "Munich International Airport",
    "city": "Munich",
    "country": "DE"
  },
  {
    "iata": "NUE",
    "name": "Nuremberg Airport",
    "city": "Nuremberg",
    "country": "DE"
  },
  {
    "iata": "LEJ",
    "name": "Leipzig Halle Airport",
    "city": "Leipzig",
    "country": "DE"
  },
  {
    "iata": "SCN",
    "name": "Saarbrucken Airport",
    "city": "Saarbrucken",
    "country": "DE"
  },
  {
    "iata": "STR",
    "name": "Stuttgart Airport",
    "city": "Stuttgart",
    "country": "DE"
  },
  {
    "iata": "TXL",
    "name": "Berlin-Tegel International Airport",
    "city": "Berlin",
    "country": "DE"
  },
  {
    "iata": "HAJ",
    "name": "Hannover Airport",
    "city": "Hannover",
    "country": "DE"
  },
  {
    "iata": "BRE",
    "name": "Bremen Airport",
    "city": "Bremen",
    "country": "DE"
  },
  {
    "iata": "QEF",
    "name": "Frankfurt-Egelsbach Airport",
    "city": "Egelsbach",
    "country": "DE"
  },
  {
    "iata": "HHN",
    "name": "Frankfurt-Hahn Airport",
    "city": "Hahn",
    "country": "DE"
  },
  {
    "iata": "MHG",
    "name": "Mannheim-City Airport",
    "city": "Mannheim",
    "country": "DE"
  },
  {
    "iata": "QMZ",
    "name": "Mainz-Finthen Airport",
    "city": "Mainz",
    "country": "DE"
  },
  {
    "iata": "EIB",
    "name": "Eisenach-Kindel Airport",
    "city": "Eisenach",
    "country": "DE"
  },
  {
    "iata": "SGE",
    "name": "Siegerland Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "KZG",
    "name": "Kitzingen Airport",
    "city": "Kitzingen",
    "country": "DE"
  },
  {
    "iata": "XFW",
    "name": "Hamburg-Finkenwerder Airport",
    "city": "Hamburg",
    "country": "DE"
  },
  {
    "iata": "KEL",
    "name": "Kiel-Holtenau Airport",
    "city": "Kiel",
    "country": "DE"
  },
  {
    "iata": "LBC",
    "name": "Lubeck Blankensee Airport",
    "city": "Lubeck",
    "country": "DE"
  },
  {
    "iata": "EUM",
    "name": "Neumunster Airport",
    "city": "Neumunster",
    "country": "DE"
  },
  {
    "iata": "FMM",
    "name": "Memmingen Allgau Airport",
    "city": "Memmingen",
    "country": "DE"
  },
  {
    "iata": "AAH",
    "name": "Aachen-Merzbruck Airport",
    "city": "Aachen",
    "country": "DE"
  },
  {
    "iata": "BNJ",
    "name": "Bonn-Hangelar Airport",
    "city": "Bonn",
    "country": "DE"
  },
  {
    "iata": "ZCA",
    "name": "Arnsberg-Menden Airport",
    "city": "Neheim-Husten",
    "country": "DE"
  },
  {
    "iata": "ESS",
    "name": "Essen Mulheim Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "BFE",
    "name": "Bielefeld Airport",
    "city": "Bielefeld",
    "country": "DE"
  },
  {
    "iata": "ZOJ",
    "name": "Marl-Loemuhle Airport",
    "city": "Marl",
    "country": "DE"
  },
  {
    "iata": "MGL",
    "name": "Monchengladbach Airport",
    "city": "Monchengladbach",
    "country": "DE"
  },
  {
    "iata": "PAD",
    "name": "Paderborn Lippstadt Airport",
    "city": "Paderborn",
    "country": "DE"
  },
  {
    "iata": "NRN",
    "name": "Niederrhein Airport",
    "city": "Weeze",
    "country": "DE"
  },
  {
    "iata": "DTM",
    "name": "Dortmund Airport",
    "city": "Dortmund",
    "country": "DE"
  },
  {
    "iata": "AGB",
    "name": "Augsburg Airport",
    "city": "Augsburg",
    "country": "DE"
  },
  {
    "iata": "OBF",
    "name": "Oberpfaffenhofen Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "RBM",
    "name": "Straubing Airport",
    "city": "Straubing",
    "country": "DE"
  },
  {
    "iata": "FDH",
    "name": "Friedrichshafen Airport",
    "city": "Friedrichshafen",
    "country": "DE"
  },
  {
    "iata": "FRF",
    "name": "Oschersleben Airport",
    "city": "Oschersleben",
    "country": "DE"
  },
  {
    "iata": "SZW",
    "name": "Schwerin Parchim Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "QCB",
    "name": "Bamberg-Breitenau Airfield",
    "city": "Bamberg",
    "country": "DE"
  },
  {
    "iata": "BYU",
    "name": "Bayreuth Airport",
    "city": "Bayreuth",
    "country": "DE"
  },
  {
    "iata": "URD",
    "name": "Burg Feuerstein Airport",
    "city": "Ebermannstadt",
    "country": "DE"
  },
  {
    "iata": "QOB",
    "name": "Ansbach-Petersdorf Airport",
    "city": "Ansbach",
    "country": "DE"
  },
  {
    "iata": "HOQ",
    "name": "Hof-Plauen Airport",
    "city": "Hof",
    "country": "DE"
  },
  {
    "iata": "BBJ",
    "name": "Bitburg Airport",
    "city": "Bitburg",
    "country": "DE"
  },
  {
    "iata": "ZNV",
    "name": "Koblenz-Winningen Airport",
    "city": "Koblenz",
    "country": "DE"
  },
  {
    "iata": "ZQF",
    "name": "Trier-Fohren Airport",
    "city": "Trier",
    "country": "DE"
  },
  {
    "iata": "ZQC",
    "name": "Speyer Airport",
    "city": "Speyer",
    "country": "DE"
  },
  {
    "iata": "ZQW",
    "name": "Zweibrucken Airport",
    "city": "Zweibrucken",
    "country": "DE"
  },
  {
    "iata": "FKB",
    "name": "Karlsruhe Baden-Baden Airport",
    "city": "Baden-Baden",
    "country": "DE"
  },
  {
    "iata": "ZQL",
    "name": "Donaueschingen-Villingen Airport",
    "city": "Donaueschingen",
    "country": "DE"
  },
  {
    "iata": "LHA",
    "name": "Lahr Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "BWE",
    "name": "Braunschweig Wolfsburg Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "KSF",
    "name": "Kassel-Calden Airport",
    "city": "Kassel",
    "country": "DE"
  },
  {
    "iata": "BRV",
    "name": "Bremerhaven Airport",
    "city": "Bremerhaven",
    "country": "DE"
  },
  {
    "iata": "XLW",
    "name": "Lemwerder Airport",
    "city": "Lemwerder",
    "country": "DE"
  },
  {
    "iata": "EME",
    "name": "Emden Airport",
    "city": "Emden",
    "country": "DE"
  },
  {
    "iata": "AGE",
    "name": "Wangerooge Airport",
    "city": "Wangerooge",
    "country": "DE"
  },
  {
    "iata": "WVN",
    "name": "Wilhelmshaven-Mariensiel Airport",
    "city": "Wilhelmshaven",
    "country": "DE"
  },
  {
    "iata": "JUI",
    "name": "Juist Airport",
    "city": "Juist",
    "country": "DE"
  },
  {
    "iata": "LGO",
    "name": "Langeoog Airport",
    "city": "Langeoog",
    "country": "DE"
  },
  {
    "iata": "ZOW",
    "name": "Nordhorn-Lingen Airport",
    "city": "Klausheide",
    "country": "DE"
  },
  {
    "iata": "BMK",
    "name": "Borkum Airport",
    "city": "Borkum",
    "country": "DE"
  },
  {
    "iata": "NOD",
    "name": "Norden-Norddeich Airport",
    "city": "Norddeich",
    "country": "DE"
  },
  {
    "iata": "VAC",
    "name": "Varrelbusch Airport",
    "city": "Cloppenburg",
    "country": "DE"
  },
  {
    "iata": "NRD",
    "name": "Norderney Airport",
    "city": "Norderney",
    "country": "DE"
  },
  {
    "iata": "BMR",
    "name": "Baltrum Airport",
    "city": "Baltrum",
    "country": "DE"
  },
  {
    "iata": "HEI",
    "name": "Heide-Busum Airport",
    "city": "Busum",
    "country": "DE"
  },
  {
    "iata": "FLF",
    "name": "Flensburg-Schaeferhaus Airport",
    "city": "Flensburg",
    "country": "DE"
  },
  {
    "iata": "HGL",
    "name": "Helgoland-Dune Airport",
    "city": "Helgoland",
    "country": "DE"
  },
  {
    "iata": "QHU",
    "name": "Husum-Schwesing Airport",
    "city": "Husum",
    "country": "DE"
  },
  {
    "iata": "PSH",
    "name": "St. Peter-Ording Airport",
    "city": "Sankt Peter-Ording",
    "country": "DE"
  },
  {
    "iata": "GWT",
    "name": "Westerland Sylt Airport",
    "city": "Westerland",
    "country": "DE"
  },
  {
    "iata": "OHR",
    "name": "Wyk auf Fohr Airport",
    "city": "Wyk auf Fohr",
    "country": "DE"
  },
  {
    "iata": "KDL",
    "name": "Kardla Airport",
    "city": "Kardla",
    "country": "EE"
  },
  {
    "iata": "URE",
    "name": "Kuressaare Airport",
    "city": "Kuressaare",
    "country": "EE"
  },
  {
    "iata": "EPU",
    "name": "Parnu Airport",
    "city": "Parnu",
    "country": "EE"
  },
  {
    "iata": "TLL",
    "name": "Tallinn Airport",
    "city": "Tallinn",
    "country": "EE"
  },
  {
    "iata": "TAY",
    "name": "Tartu Airport",
    "city": "Tartu",
    "country": "EE"
  },
  {
    "iata": "ENF",
    "name": "Enontekio Airport",
    "city": "Enontekio",
    "country": "FI"
  },
  {
    "iata": "QVE",
    "name": "Forssa Airport",
    "city": "Forssa",
    "country": "FI"
  },
  {
    "iata": "KEV",
    "name": "Halli Airport",
    "city": "Halli / Kuorevesi",
    "country": "FI"
  },
  {
    "iata": "HEM",
    "name": "Helsinki Malmi Airport",
    "city": "Helsinki",
    "country": "FI"
  },
  {
    "iata": "HEL",
    "name": "Helsinki Vantaa Airport",
    "city": "Helsinki",
    "country": "FI"
  },
  {
    "iata": "HYV",
    "name": "Hyvinkaa Airport",
    "city": "",
    "country": "FI"
  },
  {
    "iata": "KTQ",
    "name": "Kitee Airport",
    "city": "",
    "country": "FI"
  },
  {
    "iata": "IVL",
    "name": "Ivalo Airport",
    "city": "Ivalo",
    "country": "FI"
  },
  {
    "iata": "JOE",
    "name": "Joensuu Airport",
    "city": "Joensuu / Liperi",
    "country": "FI"
  },
  {
    "iata": "JYV",
    "name": "Jyvaskyla Airport",
    "city": "Jyvaskylan Maalaiskunta",
    "country": "FI"
  },
  {
    "iata": "KAU",
    "name": "Kauhava Airport",
    "city": "Kauhava",
    "country": "FI"
  },
  {
    "iata": "KEM",
    "name": "Kemi-Tornio Airport",
    "city": "Kemi / Tornio",
    "country": "FI"
  },
  {
    "iata": "KAJ",
    "name": "Kajaani Airport",
    "city": "Kajaani",
    "country": "FI"
  },
  {
    "iata": "KHJ",
    "name": "Kauhajoki Airport",
    "city": "",
    "country": "FI"
  },
  {
    "iata": "KOK",
    "name": "Kruunupyy Airport",
    "city": "Kokkola / Kruunupyy",
    "country": "FI"
  },
  {
    "iata": "KAO",
    "name": "Kuusamo Airport",
    "city": "Kuusamo",
    "country": "FI"
  },
  {
    "iata": "KTT",
    "name": "Kittila Airport",
    "city": "Kittila",
    "country": "FI"
  },
  {
    "iata": "KUO",
    "name": "Kuopio Airport",
    "city": "Kuopio / Siilinjarvi",
    "country": "FI"
  },
  {
    "iata": "QLF",
    "name": "Lahti Vesivehmaa Airport",
    "city": "",
    "country": "FI"
  },
  {
    "iata": "LPP",
    "name": "Lappeenranta Airport",
    "city": "Lappeenranta",
    "country": "FI"
  },
  {
    "iata": "MHQ",
    "name": "Mariehamn Airport",
    "city": "",
    "country": "FI"
  },
  {
    "iata": "MIK",
    "name": "Mikkeli Airport",
    "city": "Mikkeli",
    "country": "FI"
  },
  {
    "iata": "OUL",
    "name": "Oulu Airport",
    "city": "Oulu / Oulunsalo",
    "country": "FI"
  },
  {
    "iata": "POR",
    "name": "Pori Airport",
    "city": "Pori",
    "country": "FI"
  },
  {
    "iata": "RVN",
    "name": "Rovaniemi Airport",
    "city": "Rovaniemi",
    "country": "FI"
  },
  {
    "iata": "SVL",
    "name": "Savonlinna Airport",
    "city": "Savonlinna",
    "country": "FI"
  },
  {
    "iata": "SJY",
    "name": "Seinajoki Airport",
    "city": "Seinajoki / Ilmajoki",
    "country": "FI"
  },
  {
    "iata": "SOT",
    "name": "Sodankyla Airport",
    "city": "Sodankyla",
    "country": "FI"
  },
  {
    "iata": "TMP",
    "name": "Tampere-Pirkkala Airport",
    "city": "Tampere / Pirkkala",
    "country": "FI"
  },
  {
    "iata": "TKU",
    "name": "Turku Airport",
    "city": "Turku",
    "country": "FI"
  },
  {
    "iata": "UTI",
    "name": "Utti Air Base",
    "city": "Utti / Valkeala",
    "country": "FI"
  },
  {
    "iata": "VAA",
    "name": "Vaasa Airport",
    "city": "Vaasa",
    "country": "FI"
  },
  {
    "iata": "VRK",
    "name": "Varkaus Airport",
    "city": "Varkaus / Joroinen",
    "country": "FI"
  },
  {
    "iata": "YLI",
    "name": "Ylivieska Airport",
    "city": "",
    "country": "FI"
  },
  {
    "iata": "LHB",
    "name": "Bruntingthorpe Airport",
    "city": "Bruntingthorpe",
    "country": "GB"
  },
  {
    "iata": "BFS",
    "name": "Belfast International Airport",
    "city": "Belfast",
    "country": "GB"
  },
  {
    "iata": "ENK",
    "name": "St Angelo Airport",
    "city": "Enniskillen",
    "country": "GB"
  },
  {
    "iata": "BHD",
    "name": "George Best Belfast City Airport",
    "city": "Belfast",
    "country": "GB"
  },
  {
    "iata": "LDY",
    "name": "City of Derry Airport",
    "city": "Derry",
    "country": "GB"
  },
  {
    "iata": "BHX",
    "name": "Birmingham International Airport",
    "city": "Birmingham",
    "country": "GB"
  },
  {
    "iata": "CVT",
    "name": "Coventry Airport",
    "city": "Coventry",
    "country": "GB"
  },
  {
    "iata": "GLO",
    "name": "Gloucestershire Airport",
    "city": "Staverton",
    "country": "GB"
  },
  {
    "iata": "ORM",
    "name": "Sywell Aerodrome",
    "city": "Northampton",
    "country": "GB"
  },
  {
    "iata": "NQT",
    "name": "Nottingham Airport",
    "city": "Nottingham",
    "country": "GB"
  },
  {
    "iata": "GBA",
    "name": "Kemble Airport",
    "city": "Kemble",
    "country": "GB"
  },
  {
    "iata": "MAN",
    "name": "Manchester Airport",
    "city": "Manchester",
    "country": "GB"
  },
  {
    "iata": "DSA",
    "name": "Robin Hood Doncaster Sheffield Airport",
    "city": "Doncaster",
    "country": "GB"
  },
  {
    "iata": "UPV",
    "name": "Upavon Aerodrome",
    "city": "Upavon",
    "country": "GB"
  },
  {
    "iata": "LYE",
    "name": "RAF Lyneham",
    "city": "Lyneham",
    "country": "GB"
  },
  {
    "iata": "DGX",
    "name": "MOD St. Athan",
    "city": "St. Athan",
    "country": "GB"
  },
  {
    "iata": "YEO",
    "name": "RNAS Yeovilton",
    "city": "Yeovil",
    "country": "GB"
  },
  {
    "iata": "CAL",
    "name": "Campbeltown Airport",
    "city": "Campbeltown",
    "country": "GB"
  },
  {
    "iata": "EOI",
    "name": "Eday Airport",
    "city": "Eday",
    "country": "GB"
  },
  {
    "iata": "FIE",
    "name": "Fair Isle Airport",
    "city": "Fair Isle",
    "country": "GB"
  },
  {
    "iata": "WHS",
    "name": "Whalsay Airport",
    "city": "Whalsay",
    "country": "GB"
  },
  {
    "iata": "COL",
    "name": "Coll Airport",
    "city": "Coll Island",
    "country": "GB"
  },
  {
    "iata": "NRL",
    "name": "North Ronaldsay Airport",
    "city": "North Ronaldsay",
    "country": "GB"
  },
  {
    "iata": "OBN",
    "name": "Oban Airport",
    "city": "North Connel",
    "country": "GB"
  },
  {
    "iata": "PPW",
    "name": "Papa Westray Airport",
    "city": "Papa Westray",
    "country": "GB"
  },
  {
    "iata": "SOY",
    "name": "Stronsay Airport",
    "city": "Stronsay",
    "country": "GB"
  },
  {
    "iata": "NDY",
    "name": "Sanday Airport",
    "city": "Sanday",
    "country": "GB"
  },
  {
    "iata": "LWK",
    "name": "Lerwick / Tingwall Airport",
    "city": "Lerwick",
    "country": "GB"
  },
  {
    "iata": "WRY",
    "name": "Westray Airport",
    "city": "Westray",
    "country": "GB"
  },
  {
    "iata": "CSA",
    "name": "Colonsay Airstrip",
    "city": "Colonsay",
    "country": "GB"
  },
  {
    "iata": "HAW",
    "name": "Haverfordwest Airport",
    "city": "Haverfordwest",
    "country": "GB"
  },
  {
    "iata": "CWL",
    "name": "Cardiff International Airport",
    "city": "Cardiff",
    "country": "GB"
  },
  {
    "iata": "SWS",
    "name": "Swansea Airport",
    "city": "Swansea",
    "country": "GB"
  },
  {
    "iata": "BRS",
    "name": "Bristol International Airport",
    "city": "Bristol",
    "country": "GB"
  },
  {
    "iata": "LPL",
    "name": "Liverpool John Lennon Airport",
    "city": "Liverpool",
    "country": "GB"
  },
  {
    "iata": "LTN",
    "name": "London Luton Airport",
    "city": "London",
    "country": "GB"
  },
  {
    "iata": "LEQ",
    "name": "Land's End Airport",
    "city": "Land's End",
    "country": "GB"
  },
  {
    "iata": "PLH",
    "name": "Plymouth City Airport",
    "city": "Plymouth",
    "country": "GB"
  },
  {
    "iata": "ISC",
    "name": "St. Mary's Airport",
    "city": "St. Mary's",
    "country": "GB"
  },
  {
    "iata": "BOH",
    "name": "Bournemouth Airport",
    "city": "Bournemouth",
    "country": "GB"
  },
  {
    "iata": "SOU",
    "name": "Southampton Airport",
    "city": "Southampton",
    "country": "GB"
  },
  {
    "iata": "BBP",
    "name": "Bembridge Airport",
    "city": "Bembridge",
    "country": "GB"
  },
  {
    "iata": "QLA",
    "name": "Lasham Airport",
    "city": "Lasham",
    "country": "GB"
  },
  {
    "iata": "NQY",
    "name": "Newquay Cornwall Airport",
    "city": "Newquay",
    "country": "GB"
  },
  {
    "iata": "QUG",
    "name": "Chichester/Goodwood Airport",
    "city": "Chichester",
    "country": "GB"
  },
  {
    "iata": "ESH",
    "name": "Shoreham Airport",
    "city": "Brighton",
    "country": "GB"
  },
  {
    "iata": "BQH",
    "name": "London Biggin Hill Airport",
    "city": "London",
    "country": "GB"
  },
  {
    "iata": "LGW",
    "name": "London Gatwick Airport",
    "city": "London",
    "country": "GB"
  },
  {
    "iata": "KRH",
    "name": "Redhill Aerodrome",
    "city": "Redhill",
    "country": "GB"
  },
  {
    "iata": "LCY",
    "name": "London City Airport",
    "city": "London",
    "country": "GB"
  },
  {
    "iata": "FAB",
    "name": "Farnborough Airport",
    "city": "Farnborough",
    "country": "GB"
  },
  {
    "iata": "BBS",
    "name": "Blackbushe Airport",
    "city": "Yateley",
    "country": "GB"
  },
  {
    "iata": "LHR",
    "name": "London Heathrow Airport",
    "city": "London",
    "country": "GB"
  },
  {
    "iata": "SEN",
    "name": "Southend Airport",
    "city": "Southend",
    "country": "GB"
  },
  {
    "iata": "LYX",
    "name": "Lydd Airport",
    "city": "Lydd",
    "country": "GB"
  },
  {
    "iata": "MSE",
    "name": "Kent International Airport",
    "city": "Manston",
    "country": "GB"
  },
  {
    "iata": "CAX",
    "name": "Carlisle Airport",
    "city": "Carlisle",
    "country": "GB"
  },
  {
    "iata": "BLK",
    "name": "Blackpool International Airport",
    "city": "Blackpool",
    "country": "GB"
  },
  {
    "iata": "HUY",
    "name": "Humberside Airport",
    "city": "Grimsby",
    "country": "GB"
  },
  {
    "iata": "BWF",
    "name": "Barrow Walney Island Airport",
    "city": "Barrow-in-Furness",
    "country": "GB"
  },
  {
    "iata": "LBA",
    "name": "Leeds Bradford Airport",
    "city": "Leeds",
    "country": "GB"
  },
  {
    "iata": "WRT",
    "name": "Warton Airport",
    "city": "Warton",
    "country": "GB"
  },
  {
    "iata": "CEG",
    "name": "Hawarden Airport",
    "city": "Hawarden",
    "country": "GB"
  },
  {
    "iata": "NCL",
    "name": "Newcastle Airport",
    "city": "Newcastle",
    "country": "GB"
  },
  {
    "iata": "MME",
    "name": "Durham Tees Valley Airport",
    "city": "Durham",
    "country": "GB"
  },
  {
    "iata": "EMA",
    "name": "East Midlands Airport",
    "city": "Nottingham",
    "country": "GB"
  },
  {
    "iata": "HLY",
    "name": "Anglesey Airport",
    "city": "Angelsey",
    "country": "GB"
  },
  {
    "iata": "KOI",
    "name": "Kirkwall Airport",
    "city": "Orkney Islands",
    "country": "GB"
  },
  {
    "iata": "LSI",
    "name": "Sumburgh Airport",
    "city": "Lerwick",
    "country": "GB"
  },
  {
    "iata": "WIC",
    "name": "Wick Airport",
    "city": "Wick",
    "country": "GB"
  },
  {
    "iata": "ABZ",
    "name": "Aberdeen Dyce Airport",
    "city": "Aberdeen",
    "country": "GB"
  },
  {
    "iata": "INV",
    "name": "Inverness Airport",
    "city": "Inverness",
    "country": "GB"
  },
  {
    "iata": "GLA",
    "name": "Glasgow International Airport",
    "city": "Glasgow",
    "country": "GB"
  },
  {
    "iata": "EDI",
    "name": "Edinburgh Airport",
    "city": "Edinburgh",
    "country": "GB"
  },
  {
    "iata": "ILY",
    "name": "Islay Airport",
    "city": "Port Ellen",
    "country": "GB"
  },
  {
    "iata": "PIK",
    "name": "Glasgow Prestwick Airport",
    "city": "Glasgow",
    "country": "GB"
  },
  {
    "iata": "BEB",
    "name": "Benbecula Airport",
    "city": "Balivanich",
    "country": "GB"
  },
  {
    "iata": "SCS",
    "name": "Scatsta Airport",
    "city": "Shetland Islands",
    "country": "GB"
  },
  {
    "iata": "DND",
    "name": "Dundee Airport",
    "city": "Dundee",
    "country": "GB"
  },
  {
    "iata": "SYY",
    "name": "Stornoway Airport",
    "city": "Stornoway",
    "country": "GB"
  },
  {
    "iata": "BRR",
    "name": "Barra Airport",
    "city": "Eoligarry",
    "country": "GB"
  },
  {
    "iata": "PSL",
    "name": "Perth/Scone Airport",
    "city": "Perth",
    "country": "GB"
  },
  {
    "iata": "TRE",
    "name": "Tiree Airport",
    "city": "Balemartine",
    "country": "GB"
  },
  {
    "iata": "UNT",
    "name": "Unst Airport",
    "city": "Shetland Islands",
    "country": "GB"
  },
  {
    "iata": "BOL",
    "name": "Ballykelly Airport",
    "city": "Ballykelly",
    "country": "GB"
  },
  {
    "iata": "FSS",
    "name": "RAF Kinloss",
    "city": "Kinloss",
    "country": "GB"
  },
  {
    "iata": "ADX",
    "name": "RAF Leuchars",
    "city": "St. Andrews",
    "country": "GB"
  },
  {
    "iata": "LMO",
    "name": "RAF Lossiemouth",
    "city": "Lossiemouth",
    "country": "GB"
  },
  {
    "iata": "CBG",
    "name": "Cambridge Airport",
    "city": "Cambridge",
    "country": "GB"
  },
  {
    "iata": "NWI",
    "name": "Norwich International Airport",
    "city": "Norwich",
    "country": "GB"
  },
  {
    "iata": "STN",
    "name": "London Stansted Airport",
    "city": "London",
    "country": "GB"
  },
  {
    "iata": "QFO",
    "name": "Duxford Airport",
    "city": "Duxford",
    "country": "GB"
  },
  {
    "iata": "HYC",
    "name": "Wycombe Air Park",
    "city": "High Wycombe",
    "country": "GB"
  },
  {
    "iata": "EXT",
    "name": "Exeter International Airport",
    "city": "Exeter",
    "country": "GB"
  },
  {
    "iata": "FZO",
    "name": "Bristol Filton Airport",
    "city": "Bristol",
    "country": "GB"
  },
  {
    "iata": "OXF",
    "name": "Oxford (Kidlington) Airport",
    "city": "Kidlington",
    "country": "GB"
  },
  {
    "iata": "RCS",
    "name": "Rochester Airport",
    "city": "Rochester",
    "country": "GB"
  },
  {
    "iata": "BEX",
    "name": "RAF Benson",
    "city": "Benson",
    "country": "GB"
  },
  {
    "iata": "LKZ",
    "name": "RAF Lakenheath",
    "city": "Lakenheath",
    "country": "GB"
  },
  {
    "iata": "MHZ",
    "name": "RAF Mildenhall",
    "city": "Mildenhall",
    "country": "GB"
  },
  {
    "iata": "QUY",
    "name": "RAF Wyton",
    "city": "St. Ives",
    "country": "GB"
  },
  {
    "iata": "FFD",
    "name": "RAF Fairford",
    "city": "Fairford",
    "country": "GB"
  },
  {
    "iata": "BZZ",
    "name": "RAF Brize Norton",
    "city": "Brize Norton",
    "country": "GB"
  },
  {
    "iata": "ODH",
    "name": "RAF Odiham",
    "city": "Odiham",
    "country": "GB"
  },
  {
    "iata": "WXF",
    "name": "Wethersfield Airport",
    "city": "Wethersfield",
    "country": "GB"
  },
  {
    "iata": "NHT",
    "name": "RAF Northolt",
    "city": "London",
    "country": "GB"
  },
  {
    "iata": "QCY",
    "name": "RAF Coningsby",
    "city": "Coningsby",
    "country": "GB"
  },
  {
    "iata": "BEQ",
    "name": "RAF Honington",
    "city": "Thetford",
    "country": "GB"
  },
  {
    "iata": "OKH",
    "name": "RAF Cottesmore",
    "city": "Cottesmore",
    "country": "GB"
  },
  {
    "iata": "SQZ",
    "name": "RAF Scampton",
    "city": "Scampton",
    "country": "GB"
  },
  {
    "iata": "HRT",
    "name": "RAF Linton-On-Ouse",
    "city": "Linton-On-Ouse",
    "country": "GB"
  },
  {
    "iata": "WTN",
    "name": "RAF Waddington",
    "city": "Waddington",
    "country": "GB"
  },
  {
    "iata": "KNF",
    "name": "RAF Marham",
    "city": "Marham",
    "country": "GB"
  },
  {
    "iata": "AMS",
    "name": "Amsterdam Airport Schiphol",
    "city": "Amsterdam",
    "country": "NL"
  },
  {
    "iata": "MST",
    "name": "Maastricht Aachen Airport",
    "city": "Maastricht",
    "country": "NL"
  },
  {
    "iata": "QAR",
    "name": "Deelen Air Base",
    "city": "Arnhem",
    "country": "NL"
  },
  {
    "iata": "EIN",
    "name": "Eindhoven Airport",
    "city": "Eindhoven",
    "country": "NL"
  },
  {
    "iata": "GRQ",
    "name": "Eelde Airport",
    "city": "Groningen",
    "country": "NL"
  },
  {
    "iata": "GLZ",
    "name": "Gilze Rijen Air Base",
    "city": "Breda",
    "country": "NL"
  },
  {
    "iata": "DHR",
    "name": "De Kooy Airport",
    "city": "Den Helder",
    "country": "NL"
  },
  {
    "iata": "LEY",
    "name": "Lelystad Airport",
    "city": "Lelystad",
    "country": "NL"
  },
  {
    "iata": "LWR",
    "name": "Leeuwarden Air Base",
    "city": "Leeuwarden",
    "country": "NL"
  },
  {
    "iata": "RTM",
    "name": "Rotterdam Airport",
    "city": "Rotterdam",
    "country": "NL"
  },
  {
    "iata": "ENS",
    "name": "Twenthe Airport",
    "city": "Enschede",
    "country": "NL"
  },
  {
    "iata": "UDE",
    "name": "Volkel Air Base",
    "city": "Uden",
    "country": "NL"
  },
  {
    "iata": "WOE",
    "name": "Woensdrecht Air Base",
    "city": "Bergen Op Zoom",
    "country": "NL"
  },
  {
    "iata": "BYT",
    "name": "Bantry Aerodrome",
    "city": "Bantry",
    "country": "IE"
  },
  {
    "iata": "BLY",
    "name": "Belmullet Aerodrome",
    "city": "Belmullet",
    "country": "IE"
  },
  {
    "iata": "NNR",
    "name": "Connemara Regional Airport",
    "city": "Inverin",
    "country": "IE"
  },
  {
    "iata": "CLB",
    "name": "Castlebar Airport",
    "city": "Castlebar",
    "country": "IE"
  },
  {
    "iata": "WEX",
    "name": "Castlebridge Airport",
    "city": "Wexford",
    "country": "IE"
  },
  {
    "iata": "ORK",
    "name": "Cork Airport",
    "city": "Cork",
    "country": "IE"
  },
  {
    "iata": "GWY",
    "name": "Galway Airport",
    "city": "Galway",
    "country": "IE"
  },
  {
    "iata": "CFN",
    "name": "Donegal Airport",
    "city": "Donegal",
    "country": "IE"
  },
  {
    "iata": "DUB",
    "name": "Dublin Airport",
    "city": "Dublin",
    "country": "IE"
  },
  {
    "iata": "IOR",
    "name": "Inishmore Aerodrome",
    "city": "Inis Mor",
    "country": "IE"
  },
  {
    "iata": "INQ",
    "name": "Inisheer Aerodrome",
    "city": "Inis Oirr",
    "country": "IE"
  },
  {
    "iata": "KKY",
    "name": "Kilkenny Airport",
    "city": "Kilkenny",
    "country": "IE"
  },
  {
    "iata": "NOC",
    "name": "Ireland West Knock Airport",
    "city": "Charleston",
    "country": "IE"
  },
  {
    "iata": "KIR",
    "name": "Kerry Airport",
    "city": "Killarney",
    "country": "IE"
  },
  {
    "iata": "LTR",
    "name": "Letterkenny Airport",
    "city": "Letterkenny",
    "country": "IE"
  },
  {
    "iata": "IIA",
    "name": "Inishmaan Aerodrome",
    "city": "Inis Meain",
    "country": "IE"
  },
  {
    "iata": "SNN",
    "name": "Shannon Airport",
    "city": "Shannon",
    "country": "IE"
  },
  {
    "iata": "SXL",
    "name": "Sligo Airport",
    "city": "Sligo",
    "country": "IE"
  },
  {
    "iata": "WAT",
    "name": "Waterford Airport",
    "city": "Waterford",
    "country": "IE"
  },
  {
    "iata": "AAR",
    "name": "Aarhus Airport",
    "city": "Aarhus",
    "country": "DK"
  },
  {
    "iata": "BLL",
    "name": "Billund Airport",
    "city": "Billund",
    "country": "DK"
  },
  {
    "iata": "CPH",
    "name": "Copenhagen Kastrup Airport",
    "city": "Copenhagen",
    "country": "DK"
  },
  {
    "iata": "EBJ",
    "name": "Esbjerg Airport",
    "city": "Esbjerg",
    "country": "DK"
  },
  {
    "iata": "KRP",
    "name": "Karup Airport",
    "city": "Karup",
    "country": "DK"
  },
  {
    "iata": "BYR",
    "name": "Laeso Airport",
    "city": "Laeso",
    "country": "DK"
  },
  {
    "iata": "MRW",
    "name": "Lolland Falster Maribo Airport",
    "city": "Lolland Falster / Maribo",
    "country": "DK"
  },
  {
    "iata": "ODE",
    "name": "Odense Airport",
    "city": "Odense",
    "country": "DK"
  },
  {
    "iata": "RKE",
    "name": "Copenhagen Roskilde Airport",
    "city": "Copenhagen",
    "country": "DK"
  },
  {
    "iata": "RNN",
    "name": "Bornholm Airport",
    "city": "Ronne",
    "country": "DK"
  },
  {
    "iata": "SGD",
    "name": "Sonderborg Airport",
    "city": "Sonderborg",
    "country": "DK"
  },
  {
    "iata": "CNL",
    "name": "Sindal Airport",
    "city": "Sindal",
    "country": "DK"
  },
  {
    "iata": "SKS",
    "name": "Vojens Skrydstrup Airport",
    "city": "Vojens",
    "country": "DK"
  },
  {
    "iata": "SQW",
    "name": "Skive Airport",
    "city": "Skive",
    "country": "DK"
  },
  {
    "iata": "TED",
    "name": "Thisted Airport",
    "city": "Thisted",
    "country": "DK"
  },
  {
    "iata": "STA",
    "name": "Stauning Airport",
    "city": "Skjern / Ringkobing",
    "country": "DK"
  },
  {
    "iata": "AAL",
    "name": "Aalborg Airport",
    "city": "Aalborg",
    "country": "DK"
  },
  {
    "iata": "LUX",
    "name": "Luxembourg-Findel International Airport",
    "city": "Luxembourg",
    "country": "LU"
  },
  {
    "iata": "AES",
    "name": "Alesund Airport",
    "city": "Alesund",
    "country": "NO"
  },
  {
    "iata": "ANX",
    "name": "Andoya Airport",
    "city": "Andenes",
    "country": "NO"
  },
  {
    "iata": "ALF",
    "name": "Alta Airport",
    "city": "Alta",
    "country": "NO"
  },
  {
    "iata": "FDE",
    "name": "Bringeland Airport",
    "city": "Forde",
    "country": "NO"
  },
  {
    "iata": "BNN",
    "name": "Bronnoysund Airport",
    "city": "Bronnoy",
    "country": "NO"
  },
  {
    "iata": "BOO",
    "name": "Bodo Airport",
    "city": "Bodo",
    "country": "NO"
  },
  {
    "iata": "BGO",
    "name": "Bergen Airport Flesland",
    "city": "Bergen",
    "country": "NO"
  },
  {
    "iata": "BJF",
    "name": "Batsfjord Airport",
    "city": "Batsfjord",
    "country": "NO"
  },
  {
    "iata": "BVG",
    "name": "Berlevag Airport",
    "city": "Berlevag",
    "country": "NO"
  },
  {
    "iata": "KRS",
    "name": "Kristiansand Airport",
    "city": "Kjevik",
    "country": "NO"
  },
  {
    "iata": "DLD",
    "name": "Geilo Airport Dagali",
    "city": "Dagali",
    "country": "NO"
  },
  {
    "iata": "BDU",
    "name": "Bardufoss Airport",
    "city": "Malselv",
    "country": "NO"
  },
  {
    "iata": "EVE",
    "name": "Harstad/Narvik Airport Evenes",
    "city": "Evenes",
    "country": "NO"
  },
  {
    "iata": "VDB",
    "name": "Leirin Airport",
    "city": "",
    "country": "NO"
  },
  {
    "iata": "FRO",
    "name": "Floro Airport",
    "city": "Floro",
    "country": "NO"
  },
  {
    "iata": "OSL",
    "name": "Oslo Gardermoen Airport",
    "city": "Oslo",
    "country": "NO"
  },
  {
    "iata": "HMR",
    "name": "Stafsberg Airport",
    "city": "Hamar",
    "country": "NO"
  },
  {
    "iata": "HAU",
    "name": "Haugesund Airport",
    "city": "Karmoy",
    "country": "NO"
  },
  {
    "iata": "HFT",
    "name": "Hammerfest Airport",
    "city": "Hammerfest",
    "country": "NO"
  },
  {
    "iata": "HAA",
    "name": "Hasvik Airport",
    "city": "Hasvik",
    "country": "NO"
  },
  {
    "iata": "HVG",
    "name": "Valan Airport",
    "city": "Honningsvag",
    "country": "NO"
  },
  {
    "iata": "ZXB",
    "name": "Jan Mayen Jan Mayensfield",
    "city": "",
    "country": "NO"
  },
  {
    "iata": "QKX",
    "name": "Kautokeino Air Base",
    "city": "",
    "country": "NO"
  },
  {
    "iata": "KSU",
    "name": "Kristiansund Airport Kvernberget",
    "city": "Kvernberget",
    "country": "NO"
  },
  {
    "iata": "GLL",
    "name": "Gol Airport",
    "city": "Klanten",
    "country": "NO"
  },
  {
    "iata": "KKN",
    "name": "Kirkenes Airport Hoybuktmoen",
    "city": "Kirkenes",
    "country": "NO"
  },
  {
    "iata": "FAN",
    "name": "Lista Airport",
    "city": "Farsund",
    "country": "NO"
  },
  {
    "iata": "LKN",
    "name": "Leknes Airport",
    "city": "Leknes",
    "country": "NO"
  },
  {
    "iata": "MEH",
    "name": "Mehamn Airport",
    "city": "Mehamn",
    "country": "NO"
  },
  {
    "iata": "MOL",
    "name": "Molde Airport",
    "city": "Aro",
    "country": "NO"
  },
  {
    "iata": "MJF",
    "name": "Mosjoen Airport Kjaerstad",
    "city": "",
    "country": "NO"
  },
  {
    "iata": "LKL",
    "name": "Banak Airport",
    "city": "Lakselv",
    "country": "NO"
  },
  {
    "iata": "NVK",
    "name": "Narvik Framnes Airport",
    "city": "Narvik",
    "country": "NO"
  },
  {
    "iata": "OSY",
    "name": "Namsos Hoknesora Airport",
    "city": "Namsos",
    "country": "NO"
  },
  {
    "iata": "NTB",
    "name": "Notodden Airport",
    "city": "",
    "country": "NO"
  },
  {
    "iata": "OLA",
    "name": "Orland Airport",
    "city": "Orland",
    "country": "NO"
  },
  {
    "iata": "HOV",
    "name": "Orsta-Volda Airport Hovden",
    "city": "Orsta",
    "country": "NO"
  },
  {
    "iata": "MQN",
    "name": "Mo i Rana Airport Rossvoll",
    "city": "Mo i Rana",
    "country": "NO"
  },
  {
    "iata": "RVK",
    "name": "Rorvik Airport Ryum",
    "city": "Rorvik",
    "country": "NO"
  },
  {
    "iata": "RRS",
    "name": "Roros Airport",
    "city": "Roros",
    "country": "NO"
  },
  {
    "iata": "RET",
    "name": "Rost Airport",
    "city": "",
    "country": "NO"
  },
  {
    "iata": "RYG",
    "name": "Moss Airport Rygge",
    "city": "Rygge",
    "country": "NO"
  },
  {
    "iata": "LYR",
    "name": "Svalbard Airport Longyear",
    "city": "Longyearbyen",
    "country": "NO"
  },
  {
    "iata": "SDN",
    "name": "Sandane Airport Anda",
    "city": "Sandane",
    "country": "NO"
  },
  {
    "iata": "SOG",
    "name": "Sogndal Airport",
    "city": "Sogndal",
    "country": "NO"
  },
  {
    "iata": "SVJ",
    "name": "Svolvaer Helle Airport",
    "city": "Svolvaer",
    "country": "NO"
  },
  {
    "iata": "SKN",
    "name": "Stokmarknes Skagen Airport",
    "city": "Hadsel",
    "country": "NO"
  },
  {
    "iata": "SKE",
    "name": "Skien Airport",
    "city": "Geiteryggen",
    "country": "NO"
  },
  {
    "iata": "SRP",
    "name": "Stord Airport",
    "city": "Leirvik",
    "country": "NO"
  },
  {
    "iata": "SOJ",
    "name": "Sorkjosen Airport",
    "city": "Sorkjosen",
    "country": "NO"
  },
  {
    "iata": "VAW",
    "name": "Vardo Airport Svartnes",
    "city": "Vardo",
    "country": "NO"
  },
  {
    "iata": "SSJ",
    "name": "Sandnessjoen Airport Stokka",
    "city": "Alstahaug",
    "country": "NO"
  },
  {
    "iata": "TOS",
    "name": "Tromso Airport",
    "city": "Tromso",
    "country": "NO"
  },
  {
    "iata": "TRF",
    "name": "Sandefjord Airport Torp",
    "city": "Torp",
    "country": "NO"
  },
  {
    "iata": "TRD",
    "name": "Trondheim Airport Vaernes",
    "city": "Trondheim",
    "country": "NO"
  },
  {
    "iata": "VDS",
    "name": "Vadso Airport",
    "city": "Vadso",
    "country": "NO"
  },
  {
    "iata": "SVG",
    "name": "Stavanger Airport Sola",
    "city": "Stavanger",
    "country": "NO"
  },
  {
    "iata": "QYY",
    "name": "Bialystok-Krywlany Airport",
    "city": "Bialystok",
    "country": "PL"
  },
  {
    "iata": "BXP",
    "name": "Biala Podlaska Airport",
    "city": "Biala Podlaska",
    "country": "PL"
  },
  {
    "iata": "BZG",
    "name": "Bydgoszcz Ignacy Jan Paderewski Airport",
    "city": "Bydgoszcz",
    "country": "PL"
  },
  {
    "iata": "GDN",
    "name": "Gdansk Lech Walesa Airport",
    "city": "Gdansk",
    "country": "PL"
  },
  {
    "iata": "QLC",
    "name": "Gliwice Glider Airport",
    "city": "",
    "country": "PL"
  },
  {
    "iata": "KRK",
    "name": "John Paul II International Airport Krakow-Balice Airport",
    "city": "Krakow",
    "country": "PL"
  },
  {
    "iata": "OSZ",
    "name": "Koszalin Zegrze Airport",
    "city": "",
    "country": "PL"
  },
  {
    "iata": "KTW",
    "name": "Katowice International Airport",
    "city": "Katowice",
    "country": "PL"
  },
  {
    "iata": "QEO",
    "name": "Bielsko-Bialo Kaniow Airfield",
    "city": "Czechowice-Dziedzice",
    "country": "PL"
  },
  {
    "iata": "LUZ",
    "name": "Lublin Airport",
    "city": "Lublin",
    "country": "PL"
  },
  {
    "iata": "LCJ",
    "name": "Lodz Wladyslaw Reymont Airport",
    "city": "Lodz",
    "country": "PL"
  },
  {
    "iata": "QLU",
    "name": "Lublin Radwiec Airport",
    "city": "",
    "country": "PL"
  },
  {
    "iata": "WMI",
    "name": "Warsaw Modlin Airport",
    "city": "Warsaw",
    "country": "PL"
  },
  {
    "iata": "QWS",
    "name": "Nowy Targ Airport",
    "city": "Nowy Targ",
    "country": "PL"
  },
  {
    "iata": "QYD",
    "name": "Oksywie Military Air Base",
    "city": "Gdynia",
    "country": "PL"
  },
  {
    "iata": "QPM",
    "name": "Opole-Polska Nowa Wies Airport",
    "city": "Opole",
    "country": "PL"
  },
  {
    "iata": "POZ",
    "name": "Poznan-Lawica Airport",
    "city": "Poznan",
    "country": "PL"
  },
  {
    "iata": "RDO",
    "name": "Warsaw-Radom Airport",
    "city": "Radom",
    "country": "PL"
  },
  {
    "iata": "CZW",
    "name": "Czestochowa-Rudniki Airport",
    "city": "Czestochowa",
    "country": "PL"
  },
  {
    "iata": "RZE",
    "name": "Rzeszow-Jasionka Airport",
    "city": "Rzeszow",
    "country": "PL"
  },
  {
    "iata": "SZZ",
    "name": "Szczecin-Goleniow Solidarnosc Airport",
    "city": "Goleniow",
    "country": "PL"
  },
  {
    "iata": "ZWK",
    "name": "Suwalki Airport",
    "city": "Suwalki",
    "country": "PL"
  },
  {
    "iata": "SZY",
    "name": "Olsztyn-Mazury Airport",
    "city": "Szymany",
    "country": "PL"
  },
  {
    "iata": "WAW",
    "name": "Warsaw Chopin Airport",
    "city": "Warsaw",
    "country": "PL"
  },
  {
    "iata": "WRO",
    "name": "Copernicus Wroclaw Airport",
    "city": "Wroclaw",
    "country": "PL"
  },
  {
    "iata": "IEG",
    "name": "Zielona Gora-Babimost Airport",
    "city": "Babimost",
    "country": "PL"
  },
  {
    "iata": "RNB",
    "name": "Ronneby Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "XWP",
    "name": "Hassleholm Bokeberg Airport",
    "city": "Hassleholm",
    "country": "SE"
  },
  {
    "iata": "GOT",
    "name": "Gothenburg-Landvetter Airport",
    "city": "Gothenburg",
    "country": "SE"
  },
  {
    "iata": "JKG",
    "name": "Jonkoping Airport",
    "city": "Jonkoping",
    "country": "SE"
  },
  {
    "iata": "LDK",
    "name": "Lidkoping-Hovby Airport",
    "city": "Lidkoping",
    "country": "SE"
  },
  {
    "iata": "GSE",
    "name": "Gothenburg City Airport",
    "city": "Gothenburg",
    "country": "SE"
  },
  {
    "iata": "KVB",
    "name": "Skovde Airport",
    "city": "Skovde",
    "country": "SE"
  },
  {
    "iata": "THN",
    "name": "Trollhattan-Vanersborg Airport",
    "city": "Trollhattan",
    "country": "SE"
  },
  {
    "iata": "KSK",
    "name": "Karlskoga Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "MXX",
    "name": "Mora Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "NYO",
    "name": "Stockholm Skavsta Airport",
    "city": "Stockholm / Nykoping",
    "country": "SE"
  },
  {
    "iata": "SCR",
    "name": "Salen Scandinavian Mountains Airport",
    "city": "Sälen",
    "country": "SE"
  },
  {
    "iata": "KID",
    "name": "Kristianstad Airport",
    "city": "Kristianstad",
    "country": "SE"
  },
  {
    "iata": "JLD",
    "name": "Landskrona Airport",
    "city": "Landskrona",
    "country": "SE"
  },
  {
    "iata": "OSK",
    "name": "Oskarshamn Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "KLR",
    "name": "Kalmar Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "MMX",
    "name": "Malmo Sturup Airport",
    "city": "Malmo",
    "country": "SE"
  },
  {
    "iata": "HAD",
    "name": "Halmstad Airport",
    "city": "Halmstad",
    "country": "SE"
  },
  {
    "iata": "VXO",
    "name": "Vaxjo Kronoberg Airport",
    "city": "Vaxjo",
    "country": "SE"
  },
  {
    "iata": "EVG",
    "name": "Sveg Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "GEV",
    "name": "Gallivare Airport",
    "city": "Gallivare",
    "country": "SE"
  },
  {
    "iata": "KRF",
    "name": "Kramfors Solleftea Airport",
    "city": "Kramfors / Solleftea",
    "country": "SE"
  },
  {
    "iata": "LYC",
    "name": "Lycksele Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "SDL",
    "name": "Sundsvall-Harnosand Airport",
    "city": "Sundsvall/ Harnosand",
    "country": "SE"
  },
  {
    "iata": "OER",
    "name": "Ornskoldsvik Airport",
    "city": "Ornskoldsvik",
    "country": "SE"
  },
  {
    "iata": "KRN",
    "name": "Kiruna Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "SFT",
    "name": "Skelleftea Airport",
    "city": "Skelleftea",
    "country": "SE"
  },
  {
    "iata": "UME",
    "name": "Umea Airport",
    "city": "Umea",
    "country": "SE"
  },
  {
    "iata": "VHM",
    "name": "Vilhelmina Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "AJR",
    "name": "Arvidsjaur Airport",
    "city": "Arvidsjaur",
    "country": "SE"
  },
  {
    "iata": "SOO",
    "name": "Soderhamn Airport",
    "city": "Soderhamn",
    "country": "SE"
  },
  {
    "iata": "OSD",
    "name": "Ostersund Airport",
    "city": "Ostersund",
    "country": "SE"
  },
  {
    "iata": "ORB",
    "name": "Orebro Airport",
    "city": "Orebro",
    "country": "SE"
  },
  {
    "iata": "HFS",
    "name": "Hagfors Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "KSD",
    "name": "Karlstad Airport",
    "city": "Karlstad",
    "country": "SE"
  },
  {
    "iata": "VST",
    "name": "Stockholm Vasteras Airport",
    "city": "Stockholm / Vasteras",
    "country": "SE"
  },
  {
    "iata": "LLA",
    "name": "Lulea Airport",
    "city": "Lulea",
    "country": "SE"
  },
  {
    "iata": "ARN",
    "name": "Stockholm-Arlanda Airport",
    "city": "Stockholm",
    "country": "SE"
  },
  {
    "iata": "BMA",
    "name": "Stockholm-Bromma Airport",
    "city": "Stockholm",
    "country": "SE"
  },
  {
    "iata": "BLE",
    "name": "Borlange Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "HLF",
    "name": "Hultsfred Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "GVX",
    "name": "Gavle Sandviken Airport",
    "city": "Gavle / Sandviken",
    "country": "SE"
  },
  {
    "iata": "LPI",
    "name": "Linkoping SAAB Airport",
    "city": "Linkoping",
    "country": "SE"
  },
  {
    "iata": "NRK",
    "name": "Norrkoping Airport",
    "city": "Norrkoping",
    "country": "SE"
  },
  {
    "iata": "TYF",
    "name": "Torsby Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "EKT",
    "name": "Eskilstuna Airport",
    "city": "Eskilstuna",
    "country": "SE"
  },
  {
    "iata": "VBY",
    "name": "Visby Airport",
    "city": "Visby",
    "country": "SE"
  },
  {
    "iata": "VVK",
    "name": "Vastervik Airport",
    "city": "Vastervik",
    "country": "SE"
  },
  {
    "iata": "AGH",
    "name": "Angelholm-Helsingborg Airport",
    "city": "Angelholm",
    "country": "SE"
  },
  {
    "iata": "SQO",
    "name": "Storuman Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "IDB",
    "name": "Idre Airport",
    "city": "Idre",
    "country": "SE"
  },
  {
    "iata": "PJA",
    "name": "Pajala Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "HMV",
    "name": "Hemavan Airport",
    "city": "",
    "country": "SE"
  },
  {
    "iata": "SPM",
    "name": "Spangdahlem Air Base",
    "city": "Trier",
    "country": "DE"
  },
  {
    "iata": "RMS",
    "name": "Ramstein Air Base",
    "city": "Ramstein",
    "country": "DE"
  },
  {
    "iata": "GHF",
    "name": "Giebelstadt Army Air Field",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "ZCN",
    "name": "Celle Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "ZPQ",
    "name": "Rheine Bentlage Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "FRZ",
    "name": "Fritzlar Airport",
    "city": "Fritzlar",
    "country": "DE"
  },
  {
    "iata": "ZNF",
    "name": "Hanau Army Air Field",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "ILH",
    "name": "Illesheim Air Base",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "NDZ",
    "name": "Nordholz Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "GKE",
    "name": "Geilenkirchen Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "QCN",
    "name": "Hohn Airport",
    "city": "Hohn",
    "country": "DE"
  },
  {
    "iata": "RLG",
    "name": "Rostock-Laage Airport",
    "city": "Rostock",
    "country": "DE"
  },
  {
    "iata": "QOE",
    "name": "Norvenich Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "WBG",
    "name": "Schleswig Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "FNB",
    "name": "Neubrandenburg Airport",
    "city": "",
    "country": "DE"
  },
  {
    "iata": "WIE",
    "name": "Wiesbaden Army Airfield",
    "city": "Wiesbaden",
    "country": "DE"
  },
  {
    "iata": "FEL",
    "name": "Furstenfeldbruck Airport",
    "city": "Furstenfeldbruck",
    "country": "DE"
  },
  {
    "iata": "IGS",
    "name": "Ingolstadt Manching Airport",
    "city": "Manching",
    "country": "DE"
  },
  {
    "iata": "GUT",
    "name": "Gutersloh Airport",
    "city": "Gutersloh",
    "country": "DE"
  },
  {
    "iata": "DGP",
    "name": "Daugavpils Intrenational Airport",
    "city": "Daugavpils",
    "country": "LV"
  },
  {
    "iata": "LPX",
    "name": "Liepaja International Airport",
    "city": "Liepaja",
    "country": "LV"
  },
  {
    "iata": "RIX",
    "name": "Riga International Airport",
    "city": "Riga",
    "country": "LV"
  },
  {
    "iata": "VNT",
    "name": "Ventspils International Airport",
    "city": "Ventspils",
    "country": "LV"
  },
  {
    "iata": "KUN",
    "name": "Kaunas International Airport",
    "city": "Kaunas",
    "country": "LT"
  },
  {
    "iata": "KLJ",
    "name": "Klaipeda Airport",
    "city": "Klaipeda",
    "country": "LT"
  },
  {
    "iata": "PLQ",
    "name": "Palanga International Airport",
    "city": "Palanga",
    "country": "LT"
  },
  {
    "iata": "PNV",
    "name": "Panevezys Air Base",
    "city": "Panevezys",
    "country": "LT"
  },
  {
    "iata": "SQQ",
    "name": "Siauliai International Airport",
    "city": "Siauliai",
    "country": "LT"
  },
  {
    "iata": "HLJ",
    "name": "Barysiai Airport",
    "city": "Barysiai",
    "country": "LT"
  },
  {
    "iata": "VNO",
    "name": "Vilnius International Airport",
    "city": "Vilnius",
    "country": "LT"
  },
  {
    "iata": "FUE",
    "name": "Fuerteventura Airport",
    "city": "Fuerteventura Island",
    "country": "ES"
  },
  {
    "iata": "GMZ",
    "name": "La Gomera Airport",
    "city": "Alajero",
    "country": "ES"
  },
  {
    "iata": "VDE",
    "name": "Hierro Airport",
    "city": "El Hierro Island",
    "country": "ES"
  },
  {
    "iata": "SPC",
    "name": "La Palma Airport",
    "city": "Sta Cruz de la Palma",
    "country": "ES"
  },
  {
    "iata": "LPA",
    "name": "Gran Canaria Airport",
    "city": "Gran Canaria Island",
    "country": "ES"
  },
  {
    "iata": "ACE",
    "name": "Lanzarote Airport",
    "city": "Lanzarote Island",
    "country": "ES"
  },
  {
    "iata": "TFS",
    "name": "Tenerife South Airport",
    "city": "Tenerife Island",
    "country": "ES"
  },
  {
    "iata": "TFN",
    "name": "Tenerife Norte Airport",
    "city": "Tenerife Island",
    "country": "ES"
  },
  {
    "iata": "MLN",
    "name": "Melilla Airport",
    "city": "Melilla Island",
    "country": "ES"
  },
  {
    "iata": "KFZ",
    "name": "Kukes Airport",
    "city": "Kukes",
    "country": "AL"
  },
  {
    "iata": "TIA",
    "name": "Tirana International Airport Mother Teresa",
    "city": "Tirana",
    "country": "AL"
  },
  {
    "iata": "BOJ",
    "name": "Burgas Airport",
    "city": "Burgas",
    "country": "BG"
  },
  {
    "iata": "GOZ",
    "name": "Gorna Oryahovitsa Airport",
    "city": "Gorna Oryahovitsa",
    "country": "BG"
  },
  {
    "iata": "HKV",
    "name": "Uzundzhovo Air Base",
    "city": "Haskovo",
    "country": "BG"
  },
  {
    "iata": "JAM",
    "name": "Bezmer Air Base",
    "city": "Yambol",
    "country": "BG"
  },
  {
    "iata": "PDV",
    "name": "Plovdiv International Airport",
    "city": "Plovdiv",
    "country": "BG"
  },
  {
    "iata": "PVN",
    "name": "Dolna Mitropoliya Air Base",
    "city": "Dolna Mitropoliya",
    "country": "BG"
  },
  {
    "iata": "SOF",
    "name": "Sofia Airport",
    "city": "Sofia",
    "country": "BG"
  },
  {
    "iata": "SLS",
    "name": "Silistra Polkovnik Lambrinovo Airfield",
    "city": "Silistra",
    "country": "BG"
  },
  {
    "iata": "SZR",
    "name": "Stara Zagora Airport",
    "city": "Stara Zagora",
    "country": "BG"
  },
  {
    "iata": "TGV",
    "name": "Bukhovtsi Airfield",
    "city": "Targovishte",
    "country": "BG"
  },
  {
    "iata": "VID",
    "name": "Vidin Smurdan Airfield",
    "city": "Vidin",
    "country": "BG"
  },
  {
    "iata": "VAR",
    "name": "Varna Airport",
    "city": "Varna",
    "country": "BG"
  },
  {
    "iata": "ECN",
    "name": "Ercan International Airport",
    "city": "Nicosia",
    "country": "CY"
  },
  {
    "iata": "LCA",
    "name": "Larnaca International Airport",
    "city": "Larnarca",
    "country": "CY"
  },
  {
    "iata": "PFO",
    "name": "Paphos International Airport",
    "city": "Paphos",
    "country": "CY"
  },
  {
    "iata": "AKT",
    "name": "RAF Akrotiri",
    "city": "",
    "country": "CY"
  },
  {
    "iata": "DBV",
    "name": "Dubrovnik Airport",
    "city": "Dubrovnik",
    "country": "HR"
  },
  {
    "iata": "LSZ",
    "name": "Losinj Island Airport",
    "city": "Losinj",
    "country": "HR"
  },
  {
    "iata": "OSI",
    "name": "Osijek Airport",
    "city": "Osijek",
    "country": "HR"
  },
  {
    "iata": "PUY",
    "name": "Pula Airport",
    "city": "Pula",
    "country": "HR"
  },
  {
    "iata": "RJK",
    "name": "Rijeka Airport",
    "city": "Rijeka",
    "country": "HR"
  },
  {
    "iata": "BWK",
    "name": "Brac Airport",
    "city": "Brac Island",
    "country": "HR"
  },
  {
    "iata": "SPU",
    "name": "Split Airport",
    "city": "Split",
    "country": "HR"
  },
  {
    "iata": "ZAG",
    "name": "Zagreb Airport",
    "city": "Zagreb",
    "country": "HR"
  },
  {
    "iata": "ZAD",
    "name": "Zemunik Airport",
    "city": "Zadar",
    "country": "HR"
  },
  {
    "iata": "ABC",
    "name": "Albacete-Los Llanos Airport",
    "city": "Albacete",
    "country": "ES"
  },
  {
    "iata": "ALC",
    "name": "Alicante International Airport",
    "city": "Alicante",
    "country": "ES"
  },
  {
    "iata": "LEI",
    "name": "Almeria International Airport",
    "city": "Almeria",
    "country": "ES"
  },
  {
    "iata": "OVD",
    "name": "Asturias Airport",
    "city": "Ranon",
    "country": "ES"
  },
  {
    "iata": "ODB",
    "name": "Cordoba Airport",
    "city": "Cordoba",
    "country": "ES"
  },
  {
    "iata": "BIO",
    "name": "Bilbao Airport",
    "city": "Bilbao",
    "country": "ES"
  },
  {
    "iata": "RGS",
    "name": "Burgos Airport",
    "city": "Burgos",
    "country": "ES"
  },
  {
    "iata": "BCN",
    "name": "Barcelona International Airport",
    "city": "Barcelona",
    "country": "ES"
  },
  {
    "iata": "BJZ",
    "name": "Badajoz Airport",
    "city": "Badajoz",
    "country": "ES"
  },
  {
    "iata": "CDT",
    "name": "Castellón–Costa Azahar Airport",
    "city": "Castellón",
    "country": "ES"
  },
  {
    "iata": "LCG",
    "name": "A Coruna Airport",
    "city": "Culleredo",
    "country": "ES"
  },
  {
    "iata": "ECV",
    "name": "Cuatro Vientos Airport",
    "city": "Madrid",
    "country": "ES"
  },
  {
    "iata": "ILD",
    "name": "Lleida-Alguaire Airport",
    "city": "Lleida",
    "country": "ES"
  },
  {
    "iata": "GRO",
    "name": "Girona Airport",
    "city": "Girona",
    "country": "ES"
  },
  {
    "iata": "GRX",
    "name": "Federico Garcia Lorca Airport",
    "city": "Granada",
    "country": "ES"
  },
  {
    "iata": "HSK",
    "name": "Huesca/Pirineos Airport",
    "city": "Monflorite/Alcala del Obispo",
    "country": "ES"
  },
  {
    "iata": "IBZ",
    "name": "Ibiza Airport",
    "city": "Ibiza",
    "country": "ES"
  },
  {
    "iata": "XRY",
    "name": "Jerez Airport",
    "city": "Jerez de la Forntera",
    "country": "ES"
  },
  {
    "iata": "MJV",
    "name": "San Javier Airport",
    "city": "San Javier",
    "country": "ES"
  },
  {
    "iata": "QSA",
    "name": "Sabadell Airport",
    "city": "Sabadell",
    "country": "ES"
  },
  {
    "iata": "LEN",
    "name": "Leon Airport",
    "city": "Leon",
    "country": "ES"
  },
  {
    "iata": "RJL",
    "name": "Logrono-Agoncillo Airport",
    "city": "Logrono",
    "country": "ES"
  },
  {
    "iata": "MAD",
    "name": "Madrid Barajas International Airport",
    "city": "Madrid",
    "country": "ES"
  },
  {
    "iata": "HEV",
    "name": "Mafe - Gibraleon Airport",
    "city": "Gibraleon",
    "country": "ES"
  },
  {
    "iata": "AGP",
    "name": "Malaga Airport",
    "city": "Malaga",
    "country": "ES"
  },
  {
    "iata": "MAH",
    "name": "Menorca Airport",
    "city": "Menorca Island",
    "country": "ES"
  },
  {
    "iata": "RMU",
    "name": "Región de Murcia International Airport",
    "city": "Corvera",
    "country": "ES"
  },
  {
    "iata": "OZP",
    "name": "Moron Air Base",
    "city": "Moron",
    "country": "ES"
  },
  {
    "iata": "PMI",
    "name": "Palma De Mallorca Airport",
    "city": "Palma De Mallorca",
    "country": "ES"
  },
  {
    "iata": "PNA",
    "name": "Pamplona Airport",
    "city": "Pamplona",
    "country": "ES"
  },
  {
    "iata": "CQM",
    "name": "Ciudad Real Central Airport",
    "city": "Ciudad Real",
    "country": "ES"
  },
  {
    "iata": "REU",
    "name": "Reus Air Base",
    "city": "Reus",
    "country": "ES"
  },
  {
    "iata": "ROZ",
    "name": "Rota Naval Station Airport",
    "city": "Rota",
    "country": "ES"
  },
  {
    "iata": "SLM",
    "name": "Salamanca Airport",
    "city": "Salamanca",
    "country": "ES"
  },
  {
    "iata": "EAS",
    "name": "San Sebastian Airport",
    "city": "Hondarribia",
    "country": "ES"
  },
  {
    "iata": "SCQ",
    "name": "Santiago de Compostela Airport",
    "city": "Santiago de Compostela",
    "country": "ES"
  },
  {
    "iata": "LEU",
    "name": "Aerodrom dels Pirineus-Alt Urgell Airport",
    "city": "Montferrer / Castellbo",
    "country": "ES"
  },
  {
    "iata": "TEV",
    "name": "Teruel Airport",
    "city": "Teruel",
    "country": "ES"
  },
  {
    "iata": "TOJ",
    "name": "Torrejon Airport",
    "city": "Madrid",
    "country": "ES"
  },
  {
    "iata": "VLC",
    "name": "Valencia Airport",
    "city": "Valencia",
    "country": "ES"
  },
  {
    "iata": "VLL",
    "name": "Valladolid Airport",
    "city": "Valladolid",
    "country": "ES"
  },
  {
    "iata": "VIT",
    "name": "Vitoria/Foronda Airport",
    "city": "Alava",
    "country": "ES"
  },
  {
    "iata": "VGO",
    "name": "Vigo Airport",
    "city": "Vigo",
    "country": "ES"
  },
  {
    "iata": "SDR",
    "name": "Santander Airport",
    "city": "Santander",
    "country": "ES"
  },
  {
    "iata": "ZAZ",
    "name": "Zaragoza Air Base",
    "city": "Zaragoza",
    "country": "ES"
  },
  {
    "iata": "SVQ",
    "name": "Sevilla Airport",
    "city": "Sevilla",
    "country": "ES"
  },
  {
    "iata": "DPE",
    "name": "St Aubin Airport",
    "city": "Dieppe",
    "country": "FR"
  },
  {
    "iata": "CQF",
    "name": "Calais-Dunkerque Airport",
    "city": "Marck",
    "country": "FR"
  },
  {
    "iata": "XCP",
    "name": "Compiegne Margny Airport",
    "city": "Compiegne",
    "country": "FR"
  },
  {
    "iata": "XLN",
    "name": "Laon - Chambry Airport",
    "city": "Laon-Chambry",
    "country": "FR"
  },
  {
    "iata": "XSJ",
    "name": "Peronne-Saint-Quentin Airport",
    "city": "Peronne/Saint-Quentin",
    "country": "FR"
  },
  {
    "iata": "XDK",
    "name": "Dunkerque Les Moeres Airport",
    "city": "Les Moeres",
    "country": "FR"
  },
  {
    "iata": "BYF",
    "name": "Albert-Bray Airport",
    "city": "Albert/Bray",
    "country": "FR"
  },
  {
    "iata": "LTQ",
    "name": "Le Touquet-Cote d'Opale Airport",
    "city": "Le Touquet-Paris-Plage",
    "country": "FR"
  },
  {
    "iata": "XVS",
    "name": "Valenciennes-Denain Airport",
    "city": "Valenciennes/Denain",
    "country": "FR"
  },
  {
    "iata": "QAM",
    "name": "Amiens-Glisy Airport",
    "city": "Amiens/Glisy",
    "country": "FR"
  },
  {
    "iata": "AGF",
    "name": "Agen-La Garenne Airport",
    "city": "Agen/La Garenne",
    "country": "FR"
  },
  {
    "iata": "BOD",
    "name": "Bordeaux-Merignac (BA 106) Airport",
    "city": "Bordeaux/Merignac",
    "country": "FR"
  },
  {
    "iata": "EGC",
    "name": "Bergerac-Roumaniere Airport",
    "city": "Bergerac/Roumaniere",
    "country": "FR"
  },
  {
    "iata": "CNG",
    "name": "Cognac-Chateaubernard (BA 709) Air Base",
    "city": "Cognac/Chateaubernard",
    "country": "FR"
  },
  {
    "iata": "LRH",
    "name": "La Rochelle-Ile de Re Airport",
    "city": "La Rochelle/Ile de Re",
    "country": "FR"
  },
  {
    "iata": "PIS",
    "name": "Poitiers-Biard Airport",
    "city": "Poitiers/Biard",
    "country": "FR"
  },
  {
    "iata": "MCU",
    "name": "Montlucon-Gueret Airport",
    "city": "Montlucon/Gueret",
    "country": "FR"
  },
  {
    "iata": "LIG",
    "name": "Limoges Airport",
    "city": "Limoges/Bellegarde",
    "country": "FR"
  },
  {
    "iata": "XMJ",
    "name": "Mont-de-Marsan (BA 118) Air Base",
    "city": "Mont-de-Marsan",
    "country": "FR"
  },
  {
    "iata": "NIT",
    "name": "Niort-Souche Airport",
    "city": "Niort/Souche",
    "country": "FR"
  },
  {
    "iata": "TLS",
    "name": "Toulouse-Blagnac Airport",
    "city": "Toulouse/Blagnac",
    "country": "FR"
  },
  {
    "iata": "PUF",
    "name": "Pau Pyrenees Airport",
    "city": "Pau/Pyrenees (Uzein)",
    "country": "FR"
  },
  {
    "iata": "LDE",
    "name": "Tarbes-Lourdes-Pyrenees Airport",
    "city": "Tarbes/Lourdes/Pyrenees",
    "country": "FR"
  },
  {
    "iata": "ANG",
    "name": "Angouleme-Brie-Champniers Airport",
    "city": "Angouleme/Brie/Champniers",
    "country": "FR"
  },
  {
    "iata": "PGX",
    "name": "Perigueux-Bassillac Airport",
    "city": "Perigueux/Bassillac",
    "country": "FR"
  },
  {
    "iata": "XDA",
    "name": "Dax Seyresse Airport",
    "city": "Perigueux",
    "country": "FR"
  },
  {
    "iata": "BIQ",
    "name": "Biarritz-Anglet-Bayonne Airport",
    "city": "Biarritz/Anglet/Bayonne",
    "country": "FR"
  },
  {
    "iata": "XCX",
    "name": "Chatellerault Airport",
    "city": "Biarritz",
    "country": "FR"
  },
  {
    "iata": "ZAO",
    "name": "Cahors-Lalbenque Airport",
    "city": "Cahors/Lalbenque",
    "country": "FR"
  },
  {
    "iata": "XGT",
    "name": "Gueret St Laurent Airport",
    "city": "Cahors",
    "country": "FR"
  },
  {
    "iata": "XAC",
    "name": "Arcachon-La Teste-de-Buch Airport",
    "city": "Arcachon/La Teste-de-Buch",
    "country": "FR"
  },
  {
    "iata": "LBI",
    "name": "Albi-Le Sequestre Airport",
    "city": "Albi/Le Sequestre",
    "country": "FR"
  },
  {
    "iata": "DCM",
    "name": "Castres-Mazamet Airport",
    "city": "Castres/Mazamet",
    "country": "FR"
  },
  {
    "iata": "RDZ",
    "name": "Rodez-Marcillac Airport",
    "city": "Rodez/Marcillac",
    "country": "FR"
  },
  {
    "iata": "RYN",
    "name": "Royan-Medis Airport",
    "city": "Royan/Medis",
    "country": "FR"
  },
  {
    "iata": "XMW",
    "name": "Montauban Airport",
    "city": "Montauban",
    "country": "FR"
  },
  {
    "iata": "XLR",
    "name": "Libourne-Artigues-de-Lussac Airport",
    "city": "Libourne/Artigues-de-Lussac",
    "country": "FR"
  },
  {
    "iata": "RCO",
    "name": "Rochefort-Saint-Agnant (BA 721) Airport",
    "city": "Rochefort/Saint-Agnant",
    "country": "FR"
  },
  {
    "iata": "XSL",
    "name": "Sarlat Domme Airport",
    "city": "Rochefort",
    "country": "FR"
  },
  {
    "iata": "XTB",
    "name": "Tarbes Laloubere Airport",
    "city": "Rochefort",
    "country": "FR"
  },
  {
    "iata": "IDY",
    "name": "Ile d'Yeu Airport",
    "city": "Ile d'Yeu",
    "country": "FR"
  },
  {
    "iata": "CMR",
    "name": "Colmar-Houssen Airport",
    "city": "Colmar/Houssen",
    "country": "FR"
  },
  {
    "iata": "XBV",
    "name": "Beaune-Challanges Airport",
    "city": "Beaune/Challanges",
    "country": "FR"
  },
  {
    "iata": "DLE",
    "name": "Dole-Tavaux Airport",
    "city": "Dole/Tavaux",
    "country": "FR"
  },
  {
    "iata": "XVN",
    "name": "Verdun-Le Rozelier Airport",
    "city": "Verdun/Le Rozelier",
    "country": "FR"
  },
  {
    "iata": "MVV",
    "name": "Megeve Airport",
    "city": "Verdun",
    "country": "FR"
  },
  {
    "iata": "OBS",
    "name": "Aubenas-Ardeche Meridional Airport",
    "city": "Aubenas/Ardeche Meridional",
    "country": "FR"
  },
  {
    "iata": "LPY",
    "name": "Le Puy-Loudes Airport",
    "city": "Le Puy/Loudes",
    "country": "FR"
  },
  {
    "iata": "XBK",
    "name": "Bourg-Ceyzeriat Airport",
    "city": "Bourg/Ceyzeriat",
    "country": "FR"
  },
  {
    "iata": "AHZ",
    "name": "L'alpe D'huez Airport",
    "city": "Bourg",
    "country": "FR"
  },
  {
    "iata": "XVF",
    "name": "Villefranche-Tarare Airport",
    "city": "Villefranche/Tarare",
    "country": "FR"
  },
  {
    "iata": "XMU",
    "name": "Moulins-Montbeugny Airport",
    "city": "Moulins/Montbeugny",
    "country": "FR"
  },
  {
    "iata": "ETZ",
    "name": "Metz-Nancy-Lorraine Airport",
    "city": "Metz / Nancy",
    "country": "FR"
  },
  {
    "iata": "ANE",
    "name": "Angers-Loire Airport",
    "city": "Angers/Marce",
    "country": "FR"
  },
  {
    "iata": "XAV",
    "name": "Albertville Airport",
    "city": "Angers",
    "country": "FR"
  },
  {
    "iata": "BIA",
    "name": "Bastia-Poretta Airport",
    "city": "Bastia/Poretta",
    "country": "FR"
  },
  {
    "iata": "CLY",
    "name": "Calvi-Sainte-Catherine Airport",
    "city": "Calvi/Sainte-Catherine",
    "country": "FR"
  },
  {
    "iata": "FSC",
    "name": "Figari Sud-Corse Airport",
    "city": "Figari Sud-Corse",
    "country": "FR"
  },
  {
    "iata": "AJA",
    "name": "Ajaccio-Napoleon Bonaparte Airport",
    "city": "Ajaccio/Napoleon Bonaparte",
    "country": "FR"
  },
  {
    "iata": "PRP",
    "name": "Propriano Airport",
    "city": "Propriano",
    "country": "FR"
  },
  {
    "iata": "SOZ",
    "name": "Solenzara (BA 126) Air Base",
    "city": "Solenzara",
    "country": "FR"
  },
  {
    "iata": "MFX",
    "name": "Meribel Airport",
    "city": "Ajaccio",
    "country": "FR"
  },
  {
    "iata": "AUF",
    "name": "Auxerre-Branches Airport",
    "city": "Auxerre/Branches",
    "country": "FR"
  },
  {
    "iata": "CMF",
    "name": "Chambery-Savoie Airport",
    "city": "Chambery/Aix-les-Bains",
    "country": "FR"
  },
  {
    "iata": "CFE",
    "name": "Clermont-Ferrand Auvergne Airport",
    "city": "Clermont-Ferrand/Auvergne",
    "country": "FR"
  },
  {
    "iata": "BOU",
    "name": "Bourges Airport",
    "city": "Bourges",
    "country": "FR"
  },
  {
    "iata": "XCD",
    "name": "Chalon-Champforgeuil Airport",
    "city": "Chalon/Champforgueil",
    "country": "FR"
  },
  {
    "iata": "QNJ",
    "name": "Annemasse Airport",
    "city": "Annemasse",
    "country": "FR"
  },
  {
    "iata": "CVF",
    "name": "Courchevel Airport",
    "city": "Courcheval",
    "country": "FR"
  },
  {
    "iata": "LYS",
    "name": "Lyon Saint-Exupery Airport",
    "city": "Lyon",
    "country": "FR"
  },
  {
    "iata": "QNX",
    "name": "Macon-Charnay Airport",
    "city": "Macon/Charnay",
    "country": "FR"
  },
  {
    "iata": "SYT",
    "name": "Saint-Yan Airport",
    "city": "Saint-Yan",
    "country": "FR"
  },
  {
    "iata": "RNE",
    "name": "Roanne-Renaison Airport",
    "city": "Roanne/Renaison",
    "country": "FR"
  },
  {
    "iata": "NCY",
    "name": "Annecy-Haute-Savoie-Mont Blanc Airport",
    "city": "Annecy/Meythet",
    "country": "FR"
  },
  {
    "iata": "XMK",
    "name": "Montelimar - Ancone Airport",
    "city": "Annecy",
    "country": "FR"
  },
  {
    "iata": "GNB",
    "name": "Grenoble-Isere Airport",
    "city": "Grenoble/Saint-Geoirs",
    "country": "FR"
  },
  {
    "iata": "VAF",
    "name": "Valence-Chabeuil Airport",
    "city": "Valence/Chabeuil",
    "country": "FR"
  },
  {
    "iata": "VHY",
    "name": "Vichy-Charmeil Airport",
    "city": "Vichy/Charmeil",
    "country": "FR"
  },
  {
    "iata": "AUR",
    "name": "Aurillac Airport",
    "city": "Aurillac",
    "country": "FR"
  },
  {
    "iata": "CHR",
    "name": "Chateauroux-Deols Marcel Dassault Airport",
    "city": "Chateauroux/Deols",
    "country": "FR"
  },
  {
    "iata": "LYN",
    "name": "Lyon-Bron Airport",
    "city": "Lyon/Bron",
    "country": "FR"
  },
  {
    "iata": "QXB",
    "name": "Aix-en-Provence (BA 114) Airport",
    "city": "Lyon",
    "country": "FR"
  },
  {
    "iata": "CEQ",
    "name": "Cannes-Mandelieu Airport",
    "city": "Cannes/Mandelieu",
    "country": "FR"
  },
  {
    "iata": "EBU",
    "name": "Saint-Etienne-Boutheon Airport",
    "city": "Saint-Etienne/Boutheon",
    "country": "FR"
  },
  {
    "iata": "QIE",
    "name": "Istres Le Tube/Istres Air Base (BA 125) Airport",
    "city": "Istres/Le Tube",
    "country": "FR"
  },
  {
    "iata": "CCF",
    "name": "Carcassonne Airport",
    "city": "Carcassonne/Salvaza",
    "country": "FR"
  },
  {
    "iata": "MRS",
    "name": "Marseille Provence Airport",
    "city": "Marseille",
    "country": "FR"
  },
  {
    "iata": "NCE",
    "name": "Nice-Cote d'Azur Airport",
    "city": "Nice",
    "country": "FR"
  },
  {
    "iata": "XOG",
    "name": "Orange-Caritat (BA 115) Air Base",
    "city": "Orange/Caritat",
    "country": "FR"
  },
  {
    "iata": "PGF",
    "name": "Perpignan-Rivesaltes (Llabanere) Airport",
    "city": "Perpignan/Rivesaltes",
    "country": "FR"
  },
  {
    "iata": "CTT",
    "name": "Le Castellet Airport",
    "city": "Le Castellet",
    "country": "FR"
  },
  {
    "iata": "BAE",
    "name": "Barcelonnette - Saint-Pons Airport",
    "city": "Le Castellet",
    "country": "FR"
  },
  {
    "iata": "XAS",
    "name": "Ales-Deaux Airport",
    "city": "Ales/Deaux",
    "country": "FR"
  },
  {
    "iata": "MPL",
    "name": "Montpellier-Mediterranee Airport",
    "city": "Montpellier/Mediterranee",
    "country": "FR"
  },
  {
    "iata": "BZR",
    "name": "Beziers-Vias Airport",
    "city": "Beziers/Vias",
    "country": "FR"
  },
  {
    "iata": "AVN",
    "name": "Avignon-Caumont Airport",
    "city": "Avignon/Caumont",
    "country": "FR"
  },
  {
    "iata": "GAT",
    "name": "Gap - Tallard Airport",
    "city": "Avignon",
    "country": "FR"
  },
  {
    "iata": "MEN",
    "name": "Mende-Brenoux Airport",
    "city": "Mende/Brenoux",
    "country": "FR"
  },
  {
    "iata": "SCP",
    "name": "Mont-Dauphin - St-Crepin Airport",
    "city": "Mende",
    "country": "FR"
  },
  {
    "iata": "BVA",
    "name": "Paris Beauvais Tille Airport",
    "city": "Beauvais/Tille",
    "country": "FR"
  },
  {
    "iata": "XSU",
    "name": "Saumur-Saint-Florent Airport",
    "city": "Saumur/Saint-Florent",
    "country": "FR"
  },
  {
    "iata": "EVX",
    "name": "Evreux-Fauville (BA 105) Air Base",
    "city": "Evreux/Fauville",
    "country": "FR"
  },
  {
    "iata": "XAN",
    "name": "Alencon Valframbert Airport",
    "city": "Evreux",
    "country": "FR"
  },
  {
    "iata": "LEH",
    "name": "Le Havre Octeville Airport",
    "city": "Le Havre/Octeville",
    "country": "FR"
  },
  {
    "iata": "XAB",
    "name": "Abbeville-Buigny-Saint-Maclou Airport",
    "city": "Abbeville (Buigny/Saint-Maclou)",
    "country": "FR"
  },
  {
    "iata": "XCR",
    "name": "Chalons-Vatry Air Base",
    "city": "Chalons/Vatry",
    "country": "FR"
  },
  {
    "iata": "LSO",
    "name": "Les Sables-d'Olonne Talmont Airport",
    "city": "Les Sables-d'Olonne",
    "country": "FR"
  },
  {
    "iata": "URO",
    "name": "Rouen Airport",
    "city": "Rouen/Vallee de Seine",
    "country": "FR"
  },
  {
    "iata": "XBQ",
    "name": "Blois-Le Breuil Airport",
    "city": "Blois/Le Breuil",
    "country": "FR"
  },
  {
    "iata": "QTJ",
    "name": "Chartres Champhol Airport",
    "city": "Blois",
    "country": "FR"
  },
  {
    "iata": "TUF",
    "name": "Tours-Val-de-Loire Airport",
    "city": "Tours/Val de Loire (Loire Valley)",
    "country": "FR"
  },
  {
    "iata": "CET",
    "name": "Cholet Le Pontreau Airport",
    "city": "Cholet/Le Pontreau",
    "country": "FR"
  },
  {
    "iata": "LVA",
    "name": "Laval-Entrammes Airport",
    "city": "Laval/Entrammes",
    "country": "FR"
  },
  {
    "iata": "ORE",
    "name": "Orleans-Saint-Denis-de-l'Hotel Airport",
    "city": "Orleans/Saint-Denis-de-l'Hotel",
    "country": "FR"
  },
  {
    "iata": "LBG",
    "name": "Paris-Le Bourget Airport",
    "city": "Paris",
    "country": "FR"
  },
  {
    "iata": "CSF",
    "name": "Creil Air Base",
    "city": "Creil",
    "country": "FR"
  },
  {
    "iata": "CDG",
    "name": "Charles de Gaulle International Airport",
    "city": "Paris",
    "country": "FR"
  },
  {
    "iata": "TNF",
    "name": "Toussus-le-Noble Airport",
    "city": "Toussus-le-Noble",
    "country": "FR"
  },
  {
    "iata": "ORY",
    "name": "Paris-Orly Airport",
    "city": "Paris",
    "country": "FR"
  },
  {
    "iata": "POX",
    "name": "Pontoise - Cormeilles-en-Vexin Airport",
    "city": "Pontoise",
    "country": "FR"
  },
  {
    "iata": "VIY",
    "name": "Villacoublay-Velizy (BA 107) Air Base",
    "city": "Villacoublay/Velizy",
    "country": "FR"
  },
  {
    "iata": "QYR",
    "name": "Troyes-Barberey Airport",
    "city": "Troyes/Barberey",
    "country": "FR"
  },
  {
    "iata": "NVS",
    "name": "Nevers-Fourchambault Airport",
    "city": "Nevers/Fourchambault",
    "country": "FR"
  },
  {
    "iata": "XCB",
    "name": "Cambrai-Epinoy (BA 103) Air Base",
    "city": "Cambrai/Epinoy",
    "country": "FR"
  },
  {
    "iata": "XME",
    "name": "Maubeuge-Elesmes Airport",
    "city": "Maubeuge/Elesmes",
    "country": "FR"
  },
  {
    "iata": "LIL",
    "name": "Lille-Lesquin Airport",
    "city": "Lille/Lesquin",
    "country": "FR"
  },
  {
    "iata": "HZB",
    "name": "Merville-Calonne Airport",
    "city": "Merville/Calonne",
    "country": "FR"
  },
  {
    "iata": "XCZ",
    "name": "Charleville-Mezieres Airport",
    "city": "Charleville-Mezieres",
    "country": "FR"
  },
  {
    "iata": "XVO",
    "name": "Vesoul-Frotey Airport",
    "city": "Vesoul/Frotey",
    "country": "FR"
  },
  {
    "iata": "BES",
    "name": "Brest Bretagne Airport",
    "city": "Brest/Guipavas",
    "country": "FR"
  },
  {
    "iata": "CER",
    "name": "Cherbourg-Maupertus Airport",
    "city": "Cherbourg/Maupertus",
    "country": "FR"
  },
  {
    "iata": "DNR",
    "name": "Dinard-Pleurtuit-Saint-Malo Airport",
    "city": "Dinard/Pleurtuit/Saint-Malo",
    "country": "FR"
  },
  {
    "iata": "LBY",
    "name": "La Baule-Escoublac Airport",
    "city": "La Baule-Escoublac",
    "country": "FR"
  },
  {
    "iata": "GFR",
    "name": "Granville Airport",
    "city": "Granville",
    "country": "FR"
  },
  {
    "iata": "DOL",
    "name": "Deauville-Saint-Gatien Airport",
    "city": "Deauville",
    "country": "FR"
  },
  {
    "iata": "LRT",
    "name": "Lorient South Brittany (Bretagne Sud) Airport",
    "city": "Lorient/Lann/Bihoue",
    "country": "FR"
  },
  {
    "iata": "EDM",
    "name": "La Roche-sur-Yon Airport",
    "city": "La Roche-sur-Yon/Les Ajoncs",
    "country": "FR"
  },
  {
    "iata": "LDV",
    "name": "Landivisiau Air Base",
    "city": "Landivisiau",
    "country": "FR"
  },
  {
    "iata": "CFR",
    "name": "Caen-Carpiquet Airport",
    "city": "Caen/Carpiquet",
    "country": "FR"
  },
  {
    "iata": "LME",
    "name": "Le Mans-Arnage Airport",
    "city": "Le Mans/Arnage",
    "country": "FR"
  },
  {
    "iata": "RNS",
    "name": "Rennes-Saint-Jacques Airport",
    "city": "Rennes/Saint-Jacques",
    "country": "FR"
  },
  {
    "iata": "LAI",
    "name": "Lannion-Cote de Granit Airport",
    "city": "Lannion",
    "country": "FR"
  },
  {
    "iata": "UIP",
    "name": "Quimper-Cornouaille Airport",
    "city": "Quimper/Pluguffan",
    "country": "FR"
  },
  {
    "iata": "NTE",
    "name": "Nantes Atlantique Airport",
    "city": "Nantes",
    "country": "FR"
  },
  {
    "iata": "SBK",
    "name": "Saint-Brieuc-Armor Airport",
    "city": "Saint-Brieuc/Armor",
    "country": "FR"
  },
  {
    "iata": "MXN",
    "name": "Morlaix-Ploujean Airport",
    "city": "Morlaix/Ploujean",
    "country": "FR"
  },
  {
    "iata": "VNE",
    "name": "Vannes-Meucon Airport",
    "city": "Vannes/Meucon",
    "country": "FR"
  },
  {
    "iata": "SNR",
    "name": "Saint-Nazaire-Montoir Airport",
    "city": "Saint-Nazaire/Montoir",
    "country": "FR"
  },
  {
    "iata": "QBQ",
    "name": "Besancon Thise Airport",
    "city": "St Nazaire",
    "country": "FR"
  },
  {
    "iata": "BSL",
    "name": "EuroAirport Basel-Mulhouse-Freiburg Airport",
    "city": "Bale/Mulhouse",
    "country": "FR"
  },
  {
    "iata": "DIJ",
    "name": "Dijon-Bourgogne Airport",
    "city": "Dijon/Longvic",
    "country": "FR"
  },
  {
    "iata": "MZM",
    "name": "Metz-Frescaty (BA 128) Air Base",
    "city": "Metz/Frescaty",
    "country": "FR"
  },
  {
    "iata": "EPL",
    "name": "Epinal-Mirecourt Airport",
    "city": "Epinal/Mirecourt",
    "country": "FR"
  },
  {
    "iata": "BVE",
    "name": "Brive–Souillac Airport",
    "city": "Nespouls",
    "country": "FR"
  },
  {
    "iata": "XMF",
    "name": "Montbeliard-Courcelles Airport",
    "city": "Montbeliard/Courcelles",
    "country": "FR"
  },
  {
    "iata": "ENC",
    "name": "Nancy-Essey Airport",
    "city": "Nancy/Essey",
    "country": "FR"
  },
  {
    "iata": "BOR",
    "name": "Fontaine Airport",
    "city": "Belfort",
    "country": "FR"
  },
  {
    "iata": "RHE",
    "name": "Reims-Champagne (BA 112) Airport",
    "city": "Reims/Champagne",
    "country": "FR"
  },
  {
    "iata": "SXB",
    "name": "Strasbourg Airport",
    "city": "Strasbourg",
    "country": "FR"
  },
  {
    "iata": "VTL",
    "name": "Vittel Champ De Course Airport",
    "city": "Luxeuil",
    "country": "FR"
  },
  {
    "iata": "TLN",
    "name": "Toulon-Hyeres Airport",
    "city": "Toulon/Hyeres/Le Palyvestre",
    "country": "FR"
  },
  {
    "iata": "FRJ",
    "name": "Frejus Airport",
    "city": "Hyeres",
    "country": "FR"
  },
  {
    "iata": "FNI",
    "name": "Nimes-Arles-Camargue Airport",
    "city": "Nimes/Garons",
    "country": "FR"
  },
  {
    "iata": "LTT",
    "name": "La Mole Airport",
    "city": "La Mole",
    "country": "FR"
  },
  {
    "iata": "PYR",
    "name": "Andravida Airport",
    "city": "Andravida",
    "country": "GR"
  },
  {
    "iata": "AGQ",
    "name": "Agrinion Airport",
    "city": "Agrinion",
    "country": "GR"
  },
  {
    "iata": "AXD",
    "name": "Dimokritos Airport",
    "city": "Alexandroupolis",
    "country": "GR"
  },
  {
    "iata": "HEW",
    "name": "Athen Helenikon Airport",
    "city": "Athens",
    "country": "GR"
  },
  {
    "iata": "ATH",
    "name": "Eleftherios Venizelos International Airport",
    "city": "Athens",
    "country": "GR"
  },
  {
    "iata": "VOL",
    "name": "Nea Anchialos Airport",
    "city": "Nea Anchialos",
    "country": "GR"
  },
  {
    "iata": "JKH",
    "name": "Chios Island National Airport",
    "city": "Chios Island",
    "country": "GR"
  },
  {
    "iata": "PKH",
    "name": "Porto Cheli Airport",
    "city": "Porto Cheli",
    "country": "GR"
  },
  {
    "iata": "JIK",
    "name": "Ikaria Airport",
    "city": "Ikaria Island",
    "country": "GR"
  },
  {
    "iata": "IOA",
    "name": "Ioannina Airport",
    "city": "Ioannina",
    "country": "GR"
  },
  {
    "iata": "HER",
    "name": "Heraklion International Nikos Kazantzakis Airport",
    "city": "Heraklion",
    "country": "GR"
  },
  {
    "iata": "KSO",
    "name": "Kastoria National Airport",
    "city": "Kastoria",
    "country": "GR"
  },
  {
    "iata": "KIT",
    "name": "Kithira Airport",
    "city": "Kithira Island",
    "country": "GR"
  },
  {
    "iata": "EFL",
    "name": "Kefallinia Airport",
    "city": "Kefallinia Island",
    "country": "GR"
  },
  {
    "iata": "KZS",
    "name": "Kastelorizo Airport",
    "city": "Kastelorizo Island",
    "country": "GR"
  },
  {
    "iata": "KLX",
    "name": "Kalamata Airport",
    "city": "Kalamata",
    "country": "GR"
  },
  {
    "iata": "KGS",
    "name": "Kos Airport",
    "city": "Kos Island",
    "country": "GR"
  },
  {
    "iata": "AOK",
    "name": "Karpathos Airport",
    "city": "Karpathos Island",
    "country": "GR"
  },
  {
    "iata": "CFU",
    "name": "Ioannis Kapodistrias International Airport",
    "city": "Kerkyra Island",
    "country": "GR"
  },
  {
    "iata": "KSJ",
    "name": "Kasos Airport",
    "city": "Kasos Island",
    "country": "GR"
  },
  {
    "iata": "KVA",
    "name": "Alexander the Great International Airport",
    "city": "Kavala",
    "country": "GR"
  },
  {
    "iata": "JKL",
    "name": "Kalymnos Airport",
    "city": "Kalymnos Island",
    "country": "GR"
  },
  {
    "iata": "KZI",
    "name": "Filippos Airport",
    "city": "Kozani",
    "country": "GR"
  },
  {
    "iata": "LRS",
    "name": "Leros Airport",
    "city": "Leros Island",
    "country": "GR"
  },
  {
    "iata": "LXS",
    "name": "Limnos Airport",
    "city": "Limnos Island",
    "country": "GR"
  },
  {
    "iata": "LRA",
    "name": "Larisa Airport",
    "city": "Larisa",
    "country": "GR"
  },
  {
    "iata": "JMK",
    "name": "Mikonos Airport",
    "city": "Mykonos Island",
    "country": "GR"
  },
  {
    "iata": "MLO",
    "name": "Milos Airport",
    "city": "Milos Island",
    "country": "GR"
  },
  {
    "iata": "MJT",
    "name": "Mytilene International Airport",
    "city": "Mytilene",
    "country": "GR"
  },
  {
    "iata": "JNX",
    "name": "Naxos Airport",
    "city": "Naxos Island",
    "country": "GR"
  },
  {
    "iata": "PAS",
    "name": "Paros Airport",
    "city": "Paros Island",
    "country": "GR"
  },
  {
    "iata": "JTY",
    "name": "Astypalaia Airport",
    "city": "Astypalaia Island",
    "country": "GR"
  },
  {
    "iata": "PVK",
    "name": "Aktion National Airport",
    "city": "Preveza/Lefkada",
    "country": "GR"
  },
  {
    "iata": "RHO",
    "name": "Diagoras Airport",
    "city": "Rodes Island",
    "country": "GR"
  },
  {
    "iata": "GPA",
    "name": "Araxos Airport",
    "city": "Patras",
    "country": "GR"
  },
  {
    "iata": "CHQ",
    "name": "Chania International Airport",
    "city": "Souda",
    "country": "GR"
  },
  {
    "iata": "JSI",
    "name": "Skiathos Island National Airport",
    "city": "Skiathos",
    "country": "GR"
  },
  {
    "iata": "SMI",
    "name": "Samos Airport",
    "city": "Samos Island",
    "country": "GR"
  },
  {
    "iata": "JSY",
    "name": "Syros Airport",
    "city": "Syros Island",
    "country": "GR"
  },
  {
    "iata": "SPJ",
    "name": "Sparti Airport",
    "city": "Sparti",
    "country": "GR"
  },
  {
    "iata": "JTR",
    "name": "Santorini Airport",
    "city": "Santorini Island",
    "country": "GR"
  },
  {
    "iata": "JSH",
    "name": "Sitia Airport",
    "city": "Crete Island",
    "country": "GR"
  },
  {
    "iata": "SKU",
    "name": "Skiros Airport",
    "city": "Skiros Island",
    "country": "GR"
  },
  {
    "iata": "SKG",
    "name": "Thessaloniki Macedonia International Airport",
    "city": "Thessaloniki",
    "country": "GR"
  },
  {
    "iata": "ZTH",
    "name": "Dionysios Solomos Airport",
    "city": "Zakynthos Island",
    "country": "GR"
  },
  {
    "iata": "BUD",
    "name": "Budapest Ferenc Liszt International Airport",
    "city": "Budapest",
    "country": "HU"
  },
  {
    "iata": "DEB",
    "name": "Debrecen International Airport",
    "city": "Debrecen",
    "country": "HU"
  },
  {
    "iata": "MCQ",
    "name": "Miskolc Airport",
    "city": "Miskolc",
    "country": "HU"
  },
  {
    "iata": "PEV",
    "name": "Pecs-Pogany Airport",
    "city": "Pecs-Pogany",
    "country": "HU"
  },
  {
    "iata": "QGY",
    "name": "Gyor-Per International Airport",
    "city": "Gyor",
    "country": "HU"
  },
  {
    "iata": "SOB",
    "name": "Sarmellek International Airport",
    "city": "Sarmellek",
    "country": "HU"
  },
  {
    "iata": "TZR",
    "name": "Taszar Air Base",
    "city": "Taszar",
    "country": "HU"
  },
  {
    "iata": "QZD",
    "name": "Szeged Glider Airport",
    "city": "Szeged",
    "country": "HU"
  },
  {
    "iata": "QAQ",
    "name": "L'Aquila / Preturo Airport",
    "city": "L'Aquila",
    "country": "IT"
  },
  {
    "iata": "CRV",
    "name": "Crotone Airport",
    "city": "Crotone",
    "country": "IT"
  },
  {
    "iata": "BRI",
    "name": "Bari / Palese International Airport",
    "city": "Bari",
    "country": "IT"
  },
  {
    "iata": "FOG",
    "name": "Foggia / Gino Lisa Airport",
    "city": "Foggia",
    "country": "IT"
  },
  {
    "iata": "TAR",
    "name": "Taranto / Grottaglie Airport",
    "city": "Grottaglie",
    "country": "IT"
  },
  {
    "iata": "LCC",
    "name": "Lecce Airport",
    "city": "",
    "country": "IT"
  },
  {
    "iata": "PSR",
    "name": "Pescara International Airport",
    "city": "Pescara",
    "country": "IT"
  },
  {
    "iata": "BDS",
    "name": "Brindisi / Casale Airport",
    "city": "Brindisi",
    "country": "IT"
  },
  {
    "iata": "SUF",
    "name": "Lamezia Terme Airport",
    "city": "Lamezia Terme",
    "country": "IT"
  },
  {
    "iata": "CIY",
    "name": "Comiso Airport Vincenzo Magliocco",
    "city": "Comiso",
    "country": "IT"
  },
  {
    "iata": "CTA",
    "name": "Catania / Fontanarossa Airport",
    "city": "Catania",
    "country": "IT"
  },
  {
    "iata": "LMP",
    "name": "Lampedusa Airport",
    "city": "Lampedusa",
    "country": "IT"
  },
  {
    "iata": "PNL",
    "name": "Pantelleria Airport",
    "city": "Pantelleria",
    "country": "IT"
  },
  {
    "iata": "PMO",
    "name": "Palermo / Punta Raisi Airport",
    "city": "Palermo",
    "country": "IT"
  },
  {
    "iata": "REG",
    "name": "Reggio Calabria Airport",
    "city": "Reggio Calabria",
    "country": "IT"
  },
  {
    "iata": "TPS",
    "name": "Trapani / Birgi Airport",
    "city": "Trapani",
    "country": "IT"
  },
  {
    "iata": "NSY",
    "name": "Sigonella Airport",
    "city": "",
    "country": "IT"
  },
  {
    "iata": "BLX",
    "name": "Belluno Airport",
    "city": "Belluno",
    "country": "IT"
  },
  {
    "iata": "CDF",
    "name": "Cortina Airport",
    "city": "Cortina D'Ampezzo",
    "country": "IT"
  },
  {
    "iata": "RAN",
    "name": "Ravenna Airport",
    "city": "Ravenna",
    "country": "IT"
  },
  {
    "iata": "AHO",
    "name": "Alghero / Fertilia Airport",
    "city": "Alghero",
    "country": "IT"
  },
  {
    "iata": "DCI",
    "name": "Decimomannu Airport",
    "city": "Decimomannu",
    "country": "IT"
  },
  {
    "iata": "CAG",
    "name": "Cagliari / Elmas Airport",
    "city": "Cagliari",
    "country": "IT"
  },
  {
    "iata": "OLB",
    "name": "Olbia / Costa Smeralda Airport",
    "city": "Olbia",
    "country": "IT"
  },
  {
    "iata": "FNU",
    "name": "Oristano / Fenosu Airport",
    "city": "Oristano",
    "country": "IT"
  },
  {
    "iata": "TTB",
    "name": "Tortoli' / Arbatax Airport",
    "city": "Arbatax",
    "country": "IT"
  },
  {
    "iata": "QVA",
    "name": "Varese / Venegono Airport",
    "city": "Varese",
    "country": "IT"
  },
  {
    "iata": "QMM",
    "name": "Massa Cinquale Airport",
    "city": "Marina Di Massa",
    "country": "IT"
  },
  {
    "iata": "MXP",
    "name": "Malpensa International Airport",
    "city": "Milan",
    "country": "IT"
  },
  {
    "iata": "BGY",
    "name": "Bergamo / Orio Al Serio Airport",
    "city": "Bergamo",
    "country": "IT"
  },
  {
    "iata": "TRN",
    "name": "Torino / Caselle International Airport",
    "city": "Torino",
    "country": "IT"
  },
  {
    "iata": "ALL",
    "name": "Villanova D'Albenga International Airport",
    "city": "Albenga",
    "country": "IT"
  },
  {
    "iata": "GOA",
    "name": "Genova / Sestri Cristoforo Colombo Airport",
    "city": "Genova",
    "country": "IT"
  },
  {
    "iata": "LIN",
    "name": "Linate Airport",
    "city": "Milan",
    "country": "IT"
  },
  {
    "iata": "PMF",
    "name": "Parma Airport",
    "city": "Parma",
    "country": "IT"
  },
  {
    "iata": "QPZ",
    "name": "Piacenza Airport",
    "city": "Piacenza",
    "country": "IT"
  },
  {
    "iata": "AOT",
    "name": "Aosta Airport",
    "city": "Aosta",
    "country": "IT"
  },
  {
    "iata": "CUF",
    "name": "Cuneo / Levaldigi Airport",
    "city": "Cuneo",
    "country": "IT"
  },
  {
    "iata": "AVB",
    "name": "Aviano Air Base",
    "city": "Aviano",
    "country": "IT"
  },
  {
    "iata": "BZO",
    "name": "Bolzano Airport",
    "city": "Bolzano",
    "country": "IT"
  },
  {
    "iata": "UDN",
    "name": "Udine / Campoformido Air Base",
    "city": "Udine",
    "country": "IT"
  },
  {
    "iata": "BLQ",
    "name": "Bologna / Borgo Panigale Airport",
    "city": "Bologna",
    "country": "IT"
  },
  {
    "iata": "TSF",
    "name": "Treviso / Sant'Angelo Airport",
    "city": "Treviso",
    "country": "IT"
  },
  {
    "iata": "FRL",
    "name": "Forli Airport",
    "city": "Forli",
    "country": "IT"
  },
  {
    "iata": "VBS",
    "name": "Brescia / Montichiari Airport",
    "city": "Brescia",
    "country": "IT"
  },
  {
    "iata": "TRS",
    "name": "Trieste / Ronchi Dei Legionari",
    "city": "Trieste",
    "country": "IT"
  },
  {
    "iata": "RMI",
    "name": "Rimini / Miramare - Federico Fellini International Airport",
    "city": "Rimini",
    "country": "IT"
  },
  {
    "iata": "VIC",
    "name": "Vicenza Airport",
    "city": "Vicenza",
    "country": "IT"
  },
  {
    "iata": "QPA",
    "name": "Padova Airport",
    "city": "Padova",
    "country": "IT"
  },
  {
    "iata": "VRN",
    "name": "Verona / Villafranca Airport",
    "city": "Verona",
    "country": "IT"
  },
  {
    "iata": "AOI",
    "name": "Ancona / Falconara Airport",
    "city": "Ancona",
    "country": "IT"
  },
  {
    "iata": "VCE",
    "name": "Venezia / Tessera -  Marco Polo Airport",
    "city": "Venezia",
    "country": "IT"
  },
  {
    "iata": "QZO",
    "name": "Arezzo Airport",
    "city": "Arezzo",
    "country": "IT"
  },
  {
    "iata": "LCV",
    "name": "Lucca / Tassignano Airport",
    "city": "Lucca",
    "country": "IT"
  },
  {
    "iata": "QRT",
    "name": "Rieti Airport",
    "city": "Rieti",
    "country": "IT"
  },
  {
    "iata": "SAY",
    "name": "Siena / Ampugnano Airport",
    "city": "Siena",
    "country": "IT"
  },
  {
    "iata": "CIA",
    "name": "Ciampino Airport",
    "city": "Roma",
    "country": "IT"
  },
  {
    "iata": "FCO",
    "name": "Leonardo Da Vinci (Fiumicino) International Airport",
    "city": "Rome",
    "country": "IT"
  },
  {
    "iata": "QFR",
    "name": "Frosinone Military Airport",
    "city": "Frosinone",
    "country": "IT"
  },
  {
    "iata": "QSR",
    "name": "Salerno / Pontecagnano Airport",
    "city": "Salerno",
    "country": "IT"
  },
  {
    "iata": "EBA",
    "name": "Marina Di Campo Airport",
    "city": "Marina  Di Campo",
    "country": "IT"
  },
  {
    "iata": "QLT",
    "name": "Latina Airport",
    "city": "Latina",
    "country": "IT"
  },
  {
    "iata": "NAP",
    "name": "Napoli / Capodichino International Airport",
    "city": "Napoli",
    "country": "IT"
  },
  {
    "iata": "PSA",
    "name": "Pisa / San Giusto - Galileo Galilei International Airport",
    "city": "Pisa",
    "country": "IT"
  },
  {
    "iata": "FLR",
    "name": "Firenze / Peretola Airport",
    "city": "Firenze",
    "country": "IT"
  },
  {
    "iata": "GRS",
    "name": "Grosseto Airport",
    "city": "Grosetto",
    "country": "IT"
  },
  {
    "iata": "PEG",
    "name": "Perugia / San Egidio Airport",
    "city": "Perugia",
    "country": "IT"
  },
  {
    "iata": "LJU",
    "name": "Ljubljana Joze Pucnik Airport",
    "city": "Ljubljana",
    "country": "SI"
  },
  {
    "iata": "MBX",
    "name": "Maribor Airport",
    "city": "",
    "country": "SI"
  },
  {
    "iata": "POW",
    "name": "Portoroz Airport",
    "city": "Portoroz",
    "country": "SI"
  },
  {
    "iata": "GTW",
    "name": "Holesov Airport",
    "city": "Holesov",
    "country": "CZ"
  },
  {
    "iata": "UHE",
    "name": "Kunovice Airport",
    "city": "Uherske Hradiste",
    "country": "CZ"
  },
  {
    "iata": "KLV",
    "name": "Karlovy Vary International Airport",
    "city": "Karlovy Vary",
    "country": "CZ"
  },
  {
    "iata": "MKA",
    "name": "Marianske Lazne Airport",
    "city": "Marianske Lazne",
    "country": "CZ"
  },
  {
    "iata": "OSR",
    "name": "Ostrava Leos Janacek Airport",
    "city": "Ostrava",
    "country": "CZ"
  },
  {
    "iata": "OLO",
    "name": "Olomouc Glider Airport",
    "city": "Olomouc",
    "country": "CZ"
  },
  {
    "iata": "PED",
    "name": "Pardubice Airport",
    "city": "Pardubice",
    "country": "CZ"
  },
  {
    "iata": "PRV",
    "name": "Prerov Air Base",
    "city": "Prerov",
    "country": "CZ"
  },
  {
    "iata": "PRG",
    "name": "Vaclav Havel Airport",
    "city": "Prague",
    "country": "CZ"
  },
  {
    "iata": "BRQ",
    "name": "Brno-Turany Airport",
    "city": "Brno",
    "country": "CZ"
  },
  {
    "iata": "VOD",
    "name": "Vodochody Airport",
    "city": "Vodochoky",
    "country": "CZ"
  },
  {
    "iata": "ZBE",
    "name": "Zabreh Ostrava Airport",
    "city": "Zabreh",
    "country": "CZ"
  },
  {
    "iata": "MLA",
    "name": "Luqa Airport",
    "city": "Luqa",
    "country": "MT"
  },
  {
    "iata": "HOH",
    "name": "Hohenems-Dornbirn Airport",
    "city": "Hohenems / Dornbirn",
    "country": "AT"
  },
  {
    "iata": "GRZ",
    "name": "Graz Airport",
    "city": "Graz",
    "country": "AT"
  },
  {
    "iata": "INN",
    "name": "Innsbruck Airport",
    "city": "Innsbruck",
    "country": "AT"
  },
  {
    "iata": "KLU",
    "name": "Klagenfurt Airport",
    "city": "Klagenfurt am Worthersee",
    "country": "AT"
  },
  {
    "iata": "LNZ",
    "name": "Linz Airport",
    "city": "Linz",
    "country": "AT"
  },
  {
    "iata": "SZG",
    "name": "Salzburg Airport",
    "city": "Salzburg",
    "country": "AT"
  },
  {
    "iata": "VIE",
    "name": "Vienna International Airport",
    "city": "Vienna",
    "country": "AT"
  },
  {
    "iata": "AVR",
    "name": "Alverca Airport",
    "city": "Alverca",
    "country": "PT"
  },
  {
    "iata": "SMA",
    "name": "Santa Maria Airport",
    "city": "Vila do Porto",
    "country": "PT"
  },
  {
    "iata": "BGC",
    "name": "Braganca Airport",
    "city": "",
    "country": "PT"
  },
  {
    "iata": "BYJ",
    "name": "Beja International Airport",
    "city": "Beja",
    "country": "PT"
  },
  {
    "iata": "BGZ",
    "name": "Braga Municipal Aerodrome",
    "city": "Braga",
    "country": "PT"
  },
  {
    "iata": "CHV",
    "name": "Chaves Airport",
    "city": "Chaves",
    "country": "PT"
  },
  {
    "iata": "CBP",
    "name": "Coimbra Airport",
    "city": "",
    "country": "PT"
  },
  {
    "iata": "CVU",
    "name": "Corvo Airport",
    "city": "Corvo",
    "country": "PT"
  },
  {
    "iata": "CAT",
    "name": "Cascais Airport",
    "city": "Cascais",
    "country": "PT"
  },
  {
    "iata": "FLW",
    "name": "Flores Airport",
    "city": "Santa Cruz das Flores",
    "country": "PT"
  },
  {
    "iata": "FAO",
    "name": "Faro Airport",
    "city": "Faro",
    "country": "PT"
  },
  {
    "iata": "GRW",
    "name": "Graciosa Airport",
    "city": "Santa Cruz da Graciosa",
    "country": "PT"
  },
  {
    "iata": "HOR",
    "name": "Horta Airport",
    "city": "Horta",
    "country": "PT"
  },
  {
    "iata": "TER",
    "name": "Lajes Field",
    "city": "Lajes",
    "country": "PT"
  },
  {
    "iata": "FNC",
    "name": "Madeira Airport",
    "city": "Funchal",
    "country": "PT"
  },
  {
    "iata": "PDL",
    "name": "Joao Paulo II Airport",
    "city": "Ponta Delgada",
    "country": "PT"
  },
  {
    "iata": "PIX",
    "name": "Pico Airport",
    "city": "Pico Island",
    "country": "PT"
  },
  {
    "iata": "PRM",
    "name": "Portimao Airport",
    "city": "",
    "country": "PT"
  },
  {
    "iata": "OPO",
    "name": "Francisco de Sa Carneiro Airport",
    "city": "Porto",
    "country": "PT"
  },
  {
    "iata": "PXO",
    "name": "Porto Santo Airport",
    "city": "Vila Baleira",
    "country": "PT"
  },
  {
    "iata": "LIS",
    "name": "Lisbon Portela Airport",
    "city": "Lisbon",
    "country": "PT"
  },
  {
    "iata": "SIE",
    "name": "Sines Airport",
    "city": "",
    "country": "PT"
  },
  {
    "iata": "SJZ",
    "name": "Sao Jorge Airport",
    "city": "Velas",
    "country": "PT"
  },
  {
    "iata": "VRL",
    "name": "Vila Real Airport",
    "city": "",
    "country": "PT"
  },
  {
    "iata": "VSE",
    "name": "Viseu Airport",
    "city": "",
    "country": "PT"
  },
  {
    "iata": "BNX",
    "name": "Banja Luka International Airport",
    "city": "Banja Luka",
    "country": "BA"
  },
  {
    "iata": "OMO",
    "name": "Mostar International Airport",
    "city": "Mostar",
    "country": "BA"
  },
  {
    "iata": "SJJ",
    "name": "Sarajevo International Airport",
    "city": "Sarajevo",
    "country": "BA"
  },
  {
    "iata": "TZL",
    "name": "Tuzla International Airport",
    "city": "Tuzla",
    "country": "BA"
  },
  {
    "iata": "ARW",
    "name": "Arad International Airport",
    "city": "Arad",
    "country": "RO"
  },
  {
    "iata": "BCM",
    "name": "Bacau Airport",
    "city": "Bacau",
    "country": "RO"
  },
  {
    "iata": "BAY",
    "name": "Tautii Magheraus Airport",
    "city": "Baia Mare",
    "country": "RO"
  },
  {
    "iata": "BBU",
    "name": "Baneasa International Airport",
    "city": "Bucharest",
    "country": "RO"
  },
  {
    "iata": "GHV",
    "name": "Brasov Airport",
    "city": "Brasov",
    "country": "RO"
  },
  {
    "iata": "CND",
    "name": "Mihail Kogalniceanu International Airport",
    "city": "Constanta",
    "country": "RO"
  },
  {
    "iata": "CLJ",
    "name": "Cluj-Napoca International Airport",
    "city": "Cluj-Napoca",
    "country": "RO"
  },
  {
    "iata": "CSB",
    "name": "Caransebes Airport",
    "city": "Caransebes",
    "country": "RO"
  },
  {
    "iata": "CRA",
    "name": "Craiova Airport",
    "city": "Craiova",
    "country": "RO"
  },
  {
    "iata": "IAS",
    "name": "Iasi Airport",
    "city": "Iasi",
    "country": "RO"
  },
  {
    "iata": "OMR",
    "name": "Oradea International Airport",
    "city": "Oradea",
    "country": "RO"
  },
  {
    "iata": "OTP",
    "name": "Henri Coanda International Airport",
    "city": "Bucharest",
    "country": "RO"
  },
  {
    "iata": "SBZ",
    "name": "Sibiu International Airport",
    "city": "Sibiu",
    "country": "RO"
  },
  {
    "iata": "SUJ",
    "name": "Satu Mare Airport",
    "city": "Satu Mare",
    "country": "RO"
  },
  {
    "iata": "SCV",
    "name": "Suceava Stefan cel Mare Airport",
    "city": "Suceava",
    "country": "RO"
  },
  {
    "iata": "TCE",
    "name": "Tulcea Airport",
    "city": "Tulcea",
    "country": "RO"
  },
  {
    "iata": "TGM",
    "name": "Transilvania Targu Mures International Airport",
    "city": "Targu Mures",
    "country": "RO"
  },
  {
    "iata": "TSR",
    "name": "Timisoara Traian Vuia Airport",
    "city": "Timisoara",
    "country": "RO"
  },
  {
    "iata": "GVA",
    "name": "Geneva Cointrin International Airport",
    "city": "Geneva",
    "country": "CH"
  },
  {
    "iata": "QLS",
    "name": "Lausanne-la Blecherette Airport",
    "city": "Lausanne",
    "country": "CH"
  },
  {
    "iata": "QNC",
    "name": "Neuchatel Airport",
    "city": "",
    "country": "CH"
  },
  {
    "iata": "SIR",
    "name": "Sion Airport",
    "city": "Sion",
    "country": "CH"
  },
  {
    "iata": "EML",
    "name": "Emmen Airport",
    "city": "",
    "country": "CH"
  },
  {
    "iata": "ZIN",
    "name": "Interlaken Air Base",
    "city": "",
    "country": "CH"
  },
  {
    "iata": "VIP",
    "name": "Payerne Airport",
    "city": "Payerne",
    "country": "CH"
  },
  {
    "iata": "LUG",
    "name": "Lugano Airport",
    "city": "Lugano",
    "country": "CH"
  },
  {
    "iata": "BRN",
    "name": "Bern Belp Airport",
    "city": "Bern",
    "country": "CH"
  },
  {
    "iata": "BXO",
    "name": "Buochs Airport",
    "city": "Buochs",
    "country": "CH"
  },
  {
    "iata": "ZHI",
    "name": "Grenchen Airport",
    "city": "",
    "country": "CH"
  },
  {
    "iata": "ZRH",
    "name": "Zurich Airport",
    "city": "Zurich",
    "country": "CH"
  },
  {
    "iata": "ZJI",
    "name": "Locarno Airport",
    "city": "",
    "country": "CH"
  },
  {
    "iata": "MLH",
    "name": "EuroAirport Basel-Mulhouse-Freiburg Airport",
    "city": "Bale/Mulhouse",
    "country": "CH"
  },
  {
    "iata": "ACH",
    "name": "St Gallen Altenrhein Airport",
    "city": "Altenrhein",
    "country": "CH"
  },
  {
    "iata": "SMV",
    "name": "Samedan Airport",
    "city": "",
    "country": "CH"
  },
  {
    "iata": "ESB",
    "name": "Esenboga International Airport",
    "city": "Ankara",
    "country": "TR"
  },
  {
    "iata": "ANK",
    "name": "Etimesgut Air Base",
    "city": "Ankara",
    "country": "TR"
  },
  {
    "iata": "ADA",
    "name": "Adana Airport",
    "city": "Adana",
    "country": "TR"
  },
  {
    "iata": "UAB",
    "name": "Incirlik Air Base",
    "city": "Adana",
    "country": "TR"
  },
  {
    "iata": "AFY",
    "name": "Afyon Airport",
    "city": "Afyonkarahisar",
    "country": "TR"
  },
  {
    "iata": "AYT",
    "name": "Antalya International Airport",
    "city": "Antalya",
    "country": "TR"
  },
  {
    "iata": "GZT",
    "name": "Gaziantep International Airport",
    "city": "Gaziantep",
    "country": "TR"
  },
  {
    "iata": "KFS",
    "name": "Kastamonu Airport",
    "city": "Kastamonu",
    "country": "TR"
  },
  {
    "iata": "KYA",
    "name": "Konya Airport",
    "city": "Konya",
    "country": "TR"
  },
  {
    "iata": "MZH",
    "name": "Amasya Merzifon Airport",
    "city": "Amasya",
    "country": "TR"
  },
  {
    "iata": "SSX",
    "name": "Samsun Samair Airport",
    "city": "Samsun",
    "country": "TR"
  },
  {
    "iata": "VAS",
    "name": "Sivas Airport",
    "city": "Sivas",
    "country": "TR"
  },
  {
    "iata": "ONQ",
    "name": "Zonguldak Airport",
    "city": "Zonguldak",
    "country": "TR"
  },
  {
    "iata": "MLX",
    "name": "Malatya Erhac Airport",
    "city": "Malatya",
    "country": "TR"
  },
  {
    "iata": "ASR",
    "name": "Kayseri Erkilet Airport",
    "city": "Kayseri",
    "country": "TR"
  },
  {
    "iata": "TJK",
    "name": "Tokat Airport",
    "city": "Tokat",
    "country": "TR"
  },
  {
    "iata": "DNZ",
    "name": "Cardak Airport",
    "city": "Denizli",
    "country": "TR"
  },
  {
    "iata": "NAV",
    "name": "Nevsehir Kapadokya International Airport",
    "city": "Nevsehir",
    "country": "TR"
  },
  {
    "iata": "ISL",
    "name": "Ataturk International Airport",
    "city": "Istanbul",
    "country": "TR"
  },
  {
    "iata": "CII",
    "name": "Cildir Airport",
    "city": "Aydin",
    "country": "TR"
  },
  {
    "iata": "BZI",
    "name": "Balikesir Merkez Airport",
    "city": "Balikesir",
    "country": "TR"
  },
  {
    "iata": "BDM",
    "name": "Bandirma Airport",
    "city": "Bandirma",
    "country": "TR"
  },
  {
    "iata": "CKZ",
    "name": "Canakkale Airport",
    "city": "Canakkale",
    "country": "TR"
  },
  {
    "iata": "ESK",
    "name": "Eskisehir Air Base",
    "city": "Eskisehir",
    "country": "TR"
  },
  {
    "iata": "ADB",
    "name": "Adnan Menderes International Airport",
    "city": "Izmir",
    "country": "TR"
  },
  {
    "iata": "IGL",
    "name": "Cigli Airport",
    "city": "Izmir",
    "country": "TR"
  },
  {
    "iata": "USQ",
    "name": "Usak Airport",
    "city": "Usak",
    "country": "TR"
  },
  {
    "iata": "KCO",
    "name": "Cengiz Topel Airport",
    "city": "",
    "country": "TR"
  },
  {
    "iata": "YEI",
    "name": "Bursa Yenisehir Airport",
    "city": "Bursa",
    "country": "TR"
  },
  {
    "iata": "DLM",
    "name": "Dalaman International Airport",
    "city": "Dalaman",
    "country": "TR"
  },
  {
    "iata": "TEQ",
    "name": "Tekirdag Corlu Airport",
    "city": "Corlu",
    "country": "TR"
  },
  {
    "iata": "BXN",
    "name": "Imsik Airport",
    "city": "Bodrum",
    "country": "TR"
  },
  {
    "iata": "AOE",
    "name": "Anadolu University Airport",
    "city": "Eskisehir",
    "country": "TR"
  },
  {
    "iata": "KZR",
    "name": "Zafer Airport",
    "city": "Altintas",
    "country": "TR"
  },
  {
    "iata": "EZS",
    "name": "Elazig Airport",
    "city": "Elazig",
    "country": "TR"
  },
  {
    "iata": "OGU",
    "name": "Ordu–Giresun Airport",
    "city": "Ordu",
    "country": "TR"
  },
  {
    "iata": "DIY",
    "name": "Diyarbakir Airport",
    "city": "Diyarbakir",
    "country": "TR"
  },
  {
    "iata": "ERC",
    "name": "Erzincan Airport",
    "city": "Erzincan",
    "country": "TR"
  },
  {
    "iata": "ERZ",
    "name": "Erzurum International Airport",
    "city": "Erzurum",
    "country": "TR"
  },
  {
    "iata": "KSY",
    "name": "Kars Airport",
    "city": "Kars",
    "country": "TR"
  },
  {
    "iata": "TZX",
    "name": "Trabzon International Airport",
    "city": "Trabzon",
    "country": "TR"
  },
  {
    "iata": "SFQ",
    "name": "Sanliurfa Airport",
    "city": "Sanliurfa",
    "country": "TR"
  },
  {
    "iata": "VAN",
    "name": "Van Ferit Melen Airport",
    "city": "Van",
    "country": "TR"
  },
  {
    "iata": "BAL",
    "name": "Batman Airport",
    "city": "Batman",
    "country": "TR"
  },
  {
    "iata": "MSR",
    "name": "Mus Airport",
    "city": "Mus",
    "country": "TR"
  },
  {
    "iata": "SXZ",
    "name": "Siirt Airport",
    "city": "Siirt",
    "country": "TR"
  },
  {
    "iata": "NOP",
    "name": "Sinop Airport",
    "city": "Sinop",
    "country": "TR"
  },
  {
    "iata": "KCM",
    "name": "Kahramanmaras Airport",
    "city": "Kahramanmaras",
    "country": "TR"
  },
  {
    "iata": "AJI",
    "name": "Agri Airport",
    "city": "Agri",
    "country": "TR"
  },
  {
    "iata": "ADF",
    "name": "Adiyaman Airport",
    "city": "Adiyaman",
    "country": "TR"
  },
  {
    "iata": "MQM",
    "name": "Mardin Airport",
    "city": "Mardin",
    "country": "TR"
  },
  {
    "iata": "GNY",
    "name": "Sanliurfa GAP Airport",
    "city": "Sanliurfa",
    "country": "TR"
  },
  {
    "iata": "IGD",
    "name": "Igdir Airport",
    "city": "Igdir",
    "country": "TR"
  },
  {
    "iata": "BGG",
    "name": "Bingöl Airport",
    "city": "Bingöl",
    "country": "TR"
  },
  {
    "iata": "YKO",
    "name": "Hakkari Yuksekova Airport",
    "city": "Yuksekova",
    "country": "TR"
  },
  {
    "iata": "HTY",
    "name": "Hatay Airport",
    "city": "Hatay",
    "country": "TR"
  },
  {
    "iata": "COV",
    "name": "Çukurova International Airport",
    "city": "Tarsus",
    "country": "TR"
  },
  {
    "iata": "ISE",
    "name": "Suleyman Demirel International Airport",
    "city": "Isparta",
    "country": "TR"
  },
  {
    "iata": "EDO",
    "name": "Balikesir Korfez Airport",
    "city": "Edremit",
    "country": "TR"
  },
  {
    "iata": "BJV",
    "name": "Milas Bodrum International Airport",
    "city": "Bodrum",
    "country": "TR"
  },
  {
    "iata": "GZP",
    "name": "Gazipasa Airport",
    "city": "Gazipasa",
    "country": "TR"
  },
  {
    "iata": "SZF",
    "name": "Samsun Carsamba Airport",
    "city": "Samsun",
    "country": "TR"
  },
  {
    "iata": "SAW",
    "name": "Sabiha Gokcen International Airport",
    "city": "Istanbul",
    "country": "TR"
  },
  {
    "iata": "GKD",
    "name": "Imroz Airport",
    "city": "Gokceada",
    "country": "TR"
  },
  {
    "iata": "IST",
    "name": "Istanbul Airport",
    "city": "Arnavutkoy",
    "country": "TR"
  },
  {
    "iata": "RZV",
    "name": "Rize–Artvin Airport",
    "city": "",
    "country": "TR"
  },
  {
    "iata": "BZY",
    "name": "Balti International Airport",
    "city": "Strymba",
    "country": "MD"
  },
  {
    "iata": "RMO",
    "name": "Chisinau International Airport",
    "city": "Chisinau",
    "country": "MD"
  },
  {
    "iata": "OHD",
    "name": "Ohrid St. Paul the Apostle Airport",
    "city": "Ohrid",
    "country": "MK"
  },
  {
    "iata": "SKP",
    "name": "Skopje Alexander the Great Airport",
    "city": "Skopje",
    "country": "MK"
  },
  {
    "iata": "BEG",
    "name": "Belgrade Nikola Tesla Airport",
    "city": "Belgrad",
    "country": "RS"
  },
  {
    "iata": "IVG",
    "name": "Berane Airport",
    "city": "Berane",
    "country": "ME"
  },
  {
    "iata": "BJY",
    "name": "Batajnica Air Base",
    "city": "Batajnica",
    "country": "RS"
  },
  {
    "iata": "INI",
    "name": "Nis Airport",
    "city": "Nis",
    "country": "RS"
  },
  {
    "iata": "QND",
    "name": "Cenej Airport",
    "city": "Novi Sad",
    "country": "RS"
  },
  {
    "iata": "TGD",
    "name": "Podgorica Airport",
    "city": "Podgorica",
    "country": "ME"
  },
  {
    "iata": "TIV",
    "name": "Tivat Airport",
    "city": "Tivat",
    "country": "ME"
  },
  {
    "iata": "UZC",
    "name": "Ponikve Airport",
    "city": "Uzice",
    "country": "RS"
  },
  {
    "iata": "QWV",
    "name": "Divci Airport",
    "city": "Valjevo",
    "country": "RS"
  },
  {
    "iata": "ZRE",
    "name": "Zrenjanin Airport",
    "city": "Zrenjanin",
    "country": "RS"
  },
  {
    "iata": "BTS",
    "name": "M. R. Stefanik Airport",
    "city": "Bratislava",
    "country": "SK"
  },
  {
    "iata": "KSC",
    "name": "Kosice Airport",
    "city": "Kosice",
    "country": "SK"
  },
  {
    "iata": "LUE",
    "name": "Lucenec Airport",
    "city": "Lucenec",
    "country": "SK"
  },
  {
    "iata": "PZY",
    "name": "Piestany Airport",
    "city": "Piestany",
    "country": "SK"
  },
  {
    "iata": "POV",
    "name": "Presov Air Base",
    "city": "Presov",
    "country": "SK"
  },
  {
    "iata": "SLD",
    "name": "Sliac Airport",
    "city": "Sliac",
    "country": "SK"
  },
  {
    "iata": "TAT",
    "name": "Poprad-Tatry Airport",
    "city": "Poprad",
    "country": "SK"
  },
  {
    "iata": "ILZ",
    "name": "Zilina Airport",
    "city": "Zilina",
    "country": "SK"
  },
  {
    "iata": "CDJ",
    "name": "Conceicao do Araguaia Airport",
    "city": "Conceicao Do Araguaia",
    "country": "BR"
  },
  {
    "iata": "JTC",
    "name": "Bauru-Arealva Airport",
    "city": "Bauru",
    "country": "BR"
  },
  {
    "iata": "AQA",
    "name": "Araraquara Airport",
    "city": "Araraquara",
    "country": "BR"
  },
  {
    "iata": "AJU",
    "name": "Santa Maria Airport",
    "city": "Aracaju",
    "country": "BR"
  },
  {
    "iata": "AIF",
    "name": "Marcelo Pires Halzhausen Airport",
    "city": "Assis",
    "country": "BR"
  },
  {
    "iata": "AFL",
    "name": "Alta Floresta Airport",
    "city": "Alta Floresta",
    "country": "BR"
  },
  {
    "iata": "ARU",
    "name": "Aracatuba Airport",
    "city": "Aracatuba",
    "country": "BR"
  },
  {
    "iata": "AAX",
    "name": "Araxa Airport",
    "city": "Araxa",
    "country": "BR"
  },
  {
    "iata": "BEL",
    "name": "Val de Cans/Julio Cezar Ribeiro International Airport",
    "city": "Belem",
    "country": "BR"
  },
  {
    "iata": "BGX",
    "name": "Comandante Gustavo Kraemer Airport",
    "city": "Bage",
    "country": "BR"
  },
  {
    "iata": "PLU",
    "name": "Pampulha - Carlos Drummond de Andrade Airport",
    "city": "Belo Horizonte",
    "country": "BR"
  },
  {
    "iata": "BFH",
    "name": "Bacacheri Airport",
    "city": "Curitiba",
    "country": "BR"
  },
  {
    "iata": "BJP",
    "name": "Aeroporto Estadual Arthur Siqueira Airport",
    "city": "Braganca Paulista",
    "country": "BR"
  },
  {
    "iata": "QAK",
    "name": "Major Brigadeiro Doorgal Borges Airport",
    "city": "Barbacena",
    "country": "BR"
  },
  {
    "iata": "BSB",
    "name": "Presidente Juscelino Kubistschek International Airport",
    "city": "Brasilia",
    "country": "BR"
  },
  {
    "iata": "BAT",
    "name": "Chafei Amsei Airport",
    "city": "Barretos",
    "country": "BR"
  },
  {
    "iata": "BAU",
    "name": "Bauru Airport",
    "city": "Bauru",
    "country": "BR"
  },
  {
    "iata": "BVB",
    "name": "Atlas Brasil Cantanhede Airport",
    "city": "Boa Vista",
    "country": "BR"
  },
  {
    "iata": "BPG",
    "name": "Barra do Garcas Airport",
    "city": "Barra Do Garcas",
    "country": "BR"
  },
  {
    "iata": "BZC",
    "name": "Umberto Modiano Airport",
    "city": "Cabo Frio",
    "country": "BR"
  },
  {
    "iata": "CAC",
    "name": "Cascavel Airport",
    "city": "Cascavel",
    "country": "BR"
  },
  {
    "iata": "CFB",
    "name": "Cabo Frio Airport",
    "city": "Cabo Frio",
    "country": "BR"
  },
  {
    "iata": "CFC",
    "name": "Caçador Airport",
    "city": "Caçador",
    "country": "BR"
  },
  {
    "iata": "CNF",
    "name": "Tancredo Neves International Airport",
    "city": "Belo Horizonte",
    "country": "BR"
  },
  {
    "iata": "CGR",
    "name": "Campo Grande Airport",
    "city": "Campo Grande",
    "country": "BR"
  },
  {
    "iata": "XAP",
    "name": "Chapeco Airport",
    "city": "Chapeco",
    "country": "BR"
  },
  {
    "iata": "CLN",
    "name": "Brig. Lysias Augusto Rodrigues Airport",
    "city": "Carolina",
    "country": "BR"
  },
  {
    "iata": "CKS",
    "name": "Carajas Airport",
    "city": "Carajas",
    "country": "BR"
  },
  {
    "iata": "CCM",
    "name": "Forquilhinha - Criciuma Airport",
    "city": "Criciuma",
    "country": "BR"
  },
  {
    "iata": "CLV",
    "name": "Caldas Novas Airport",
    "city": "Caldas Novas",
    "country": "BR"
  },
  {
    "iata": "QNS",
    "name": "Canoas Airport",
    "city": "Porto Alegre",
    "country": "BR"
  },
  {
    "iata": "CAW",
    "name": "Bartolomeu Lisandro Airport",
    "city": "Campos Dos Goytacazes",
    "country": "BR"
  },
  {
    "iata": "CMG",
    "name": "Corumba International Airport",
    "city": "Corumba",
    "country": "BR"
  },
  {
    "iata": "CWB",
    "name": "Afonso Pena Airport",
    "city": "Curitiba",
    "country": "BR"
  },
  {
    "iata": "CRQ",
    "name": "Caravelas Airport",
    "city": "Caravelas",
    "country": "BR"
  },
  {
    "iata": "CXJ",
    "name": "Campo dos Bugres Airport",
    "city": "Caxias Do Sul",
    "country": "BR"
  },
  {
    "iata": "CGB",
    "name": "Marechal Rondon Airport",
    "city": "Cuiaba",
    "country": "BR"
  },
  {
    "iata": "CZS",
    "name": "Cruzeiro do Sul Airport",
    "city": "Cruzeiro Do Sul",
    "country": "BR"
  },
  {
    "iata": "BYO",
    "name": "Bonito Airport",
    "city": "Bonito",
    "country": "BR"
  },
  {
    "iata": "PPB",
    "name": "Presidente Prudente Airport",
    "city": "Presidente Prudente",
    "country": "BR"
  },
  {
    "iata": "MAO",
    "name": "Eduardo Gomes International Airport",
    "city": "Manaus",
    "country": "BR"
  },
  {
    "iata": "JCR",
    "name": "Jacareacanga Airport",
    "city": "Jacareacanga",
    "country": "BR"
  },
  {
    "iata": "ESI",
    "name": "Espinosa Airport",
    "city": "Espinosa",
    "country": "BR"
  },
  {
    "iata": "IGU",
    "name": "Cataratas International Airport",
    "city": "Foz Do Iguacu",
    "country": "BR"
  },
  {
    "iata": "FLN",
    "name": "Hercilio Luz International Airport",
    "city": "Florianopolis",
    "country": "BR"
  },
  {
    "iata": "FEN",
    "name": "Fernando de Noronha Airport",
    "city": "Fernando De Noronha",
    "country": "BR"
  },
  {
    "iata": "FOR",
    "name": "Pinto Martins International Airport",
    "city": "Fortaleza",
    "country": "BR"
  },
  {
    "iata": "GIG",
    "name": "Galeao - Antonio Carlos Jobim International Airport",
    "city": "Rio De Janeiro",
    "country": "BR"
  },
  {
    "iata": "GJM",
    "name": "Guajara-Mirim Airport",
    "city": "Guajara-Mirim",
    "country": "BR"
  },
  {
    "iata": "GYN",
    "name": "Santa Genoveva Airport",
    "city": "Goiania",
    "country": "BR"
  },
  {
    "iata": "GRU",
    "name": "Guarulhos - Governador Andre Franco Montoro International Airport",
    "city": "Sao Paulo",
    "country": "BR"
  },
  {
    "iata": "GPB",
    "name": "Tancredo Thomas de Faria Airport",
    "city": "Guarapuava",
    "country": "BR"
  },
  {
    "iata": "GVR",
    "name": "Governador Valadares Airport",
    "city": "Governador Valadares",
    "country": "BR"
  },
  {
    "iata": "GUJ",
    "name": "Guaratingueta Airport",
    "city": "Guaratingueta",
    "country": "BR"
  },
  {
    "iata": "ATM",
    "name": "Altamira Airport",
    "city": "Altamira",
    "country": "BR"
  },
  {
    "iata": "ITA",
    "name": "Itacoatiara Airport",
    "city": "Itacoatiara",
    "country": "BR"
  },
  {
    "iata": "ITB",
    "name": "Itaituba Airport",
    "city": "Itaituba",
    "country": "BR"
  },
  {
    "iata": "IOS",
    "name": "Bahia - Jorge Amado Airport",
    "city": "Ilheus",
    "country": "BR"
  },
  {
    "iata": "IPN",
    "name": "Usiminas Airport",
    "city": "Ipatinga",
    "country": "BR"
  },
  {
    "iata": "IMP",
    "name": "Prefeito Renato Moreira Airport",
    "city": "Imperatriz",
    "country": "BR"
  },
  {
    "iata": "JJD",
    "name": "Comte. Ariston Pessoa Regional Airport",
    "city": "Jijoca de Jericoacoara",
    "country": "BR"
  },
  {
    "iata": "JDF",
    "name": "Francisco de Assis Airport",
    "city": "Juiz De Fora",
    "country": "BR"
  },
  {
    "iata": "JHF",
    "name": "São Paulo Catarina Executive Airport",
    "city": "São Roque",
    "country": "BR"
  },
  {
    "iata": "JPA",
    "name": "Presidente Castro Pinto Airport",
    "city": "Joao Pessoa",
    "country": "BR"
  },
  {
    "iata": "JDO",
    "name": "Orlando Bezerra de Menezes Airport",
    "city": "Juazeiro Do Norte",
    "country": "BR"
  },
  {
    "iata": "JOI",
    "name": "Lauro Carneiro de Loyola Airport",
    "city": "Joinville",
    "country": "BR"
  },
  {
    "iata": "CPV",
    "name": "Presidente Joao Suassuna Airport",
    "city": "Campina Grande",
    "country": "BR"
  },
  {
    "iata": "VCP",
    "name": "Viracopos International Airport",
    "city": "Campinas",
    "country": "BR"
  },
  {
    "iata": "LEC",
    "name": "Chapada Diamantina Airport",
    "city": "Lencois",
    "country": "BR"
  },
  {
    "iata": "LAJ",
    "name": "Lages Airport",
    "city": "Lages",
    "country": "BR"
  },
  {
    "iata": "LIP",
    "name": "Lins Airport",
    "city": "Lins",
    "country": "BR"
  },
  {
    "iata": "LDB",
    "name": "Governador Jose Richa Airport",
    "city": "Londrina",
    "country": "BR"
  },
  {
    "iata": "LAZ",
    "name": "Bom Jesus da Lapa Airport",
    "city": "Bom Jesus Da Lapa",
    "country": "BR"
  },
  {
    "iata": "MAB",
    "name": "Maraba Airport",
    "city": "Maraba",
    "country": "BR"
  },
  {
    "iata": "MQH",
    "name": "Minacu Airport",
    "city": "Minacu",
    "country": "BR"
  },
  {
    "iata": "MEU",
    "name": "Monte Dourado Airport",
    "city": "Almeirim",
    "country": "BR"
  },
  {
    "iata": "MEA",
    "name": "Macae Airport",
    "city": "Macae",
    "country": "BR"
  },
  {
    "iata": "MGF",
    "name": "Regional de Maringa - Silvio Nane Junior Airport",
    "city": "Maringa",
    "country": "BR"
  },
  {
    "iata": "MOC",
    "name": "Mario Ribeiro Airport",
    "city": "Montes Claros",
    "country": "BR"
  },
  {
    "iata": "MII",
    "name": "Marilia Airport",
    "city": "Marilia",
    "country": "BR"
  },
  {
    "iata": "PLL",
    "name": "Ponta Pelada Airport",
    "city": "Manaus",
    "country": "BR"
  },
  {
    "iata": "MCZ",
    "name": "Zumbi dos Palmares Airport",
    "city": "Maceio",
    "country": "BR"
  },
  {
    "iata": "MCP",
    "name": "Alberto Alcolumbre Airport",
    "city": "Macapa",
    "country": "BR"
  },
  {
    "iata": "MVF",
    "name": "Dix-Sept Rosado Airport",
    "city": "Mossoro",
    "country": "BR"
  },
  {
    "iata": "SAO",
    "name": "Campo de Marte Airport",
    "city": "Sao Paulo",
    "country": "BR"
  },
  {
    "iata": "MNX",
    "name": "Manicore Airport",
    "city": "Manicore",
    "country": "BR"
  },
  {
    "iata": "NVT",
    "name": "Ministro Victor Konder International Airport",
    "city": "Navegantes",
    "country": "BR"
  },
  {
    "iata": "GEL",
    "name": "Santo Angelo Airport",
    "city": "Santo Angelo",
    "country": "BR"
  },
  {
    "iata": "OYK",
    "name": "Oiapoque Airport",
    "city": "Oiapoque",
    "country": "BR"
  },
  {
    "iata": "POA",
    "name": "Salgado Filho Airport",
    "city": "Porto Alegre",
    "country": "BR"
  },
  {
    "iata": "PHB",
    "name": "Prefeito Doutor Joao Silva Filho Airport",
    "city": "Parnaiba",
    "country": "BR"
  },
  {
    "iata": "POO",
    "name": "Pocos de Caldas Airport",
    "city": "Pocos De Caldas",
    "country": "BR"
  },
  {
    "iata": "PFB",
    "name": "Lauro Kurtz Airport",
    "city": "Passo Fundo",
    "country": "BR"
  },
  {
    "iata": "PMW",
    "name": "Brigadeiro Lysias Rodrigues Airport",
    "city": "Palmas",
    "country": "BR"
  },
  {
    "iata": "PET",
    "name": "Pelotas Airport",
    "city": "Pelotas",
    "country": "BR"
  },
  {
    "iata": "PNZ",
    "name": "Senador Nilo Coelho Airport",
    "city": "Petrolina",
    "country": "BR"
  },
  {
    "iata": "PNB",
    "name": "Porto Nacional Airport",
    "city": "Porto Nacional",
    "country": "BR"
  },
  {
    "iata": "PMG",
    "name": "Ponta Pora Airport",
    "city": "Ponta Pora",
    "country": "BR"
  },
  {
    "iata": "BPS",
    "name": "Porto Seguro Airport",
    "city": "Porto Seguro",
    "country": "BR"
  },
  {
    "iata": "PVH",
    "name": "Governador Jorge Teixeira de Oliveira Airport",
    "city": "Porto Velho",
    "country": "BR"
  },
  {
    "iata": "RBR",
    "name": "Placido de Castro Airport",
    "city": "Rio Branco",
    "country": "BR"
  },
  {
    "iata": "REC",
    "name": "Guararapes - Gilberto Freyre International Airport",
    "city": "Recife",
    "country": "BR"
  },
  {
    "iata": "SDU",
    "name": "Santos Dumont Airport",
    "city": "Rio De Janeiro",
    "country": "BR"
  },
  {
    "iata": "RAO",
    "name": "Leite Lopes Airport",
    "city": "Ribeirao Preto",
    "country": "BR"
  },
  {
    "iata": "BRB",
    "name": "Barreirinhas Airport",
    "city": "",
    "country": "BR"
  },
  {
    "iata": "SNZ",
    "name": "Santa Cruz Airport",
    "city": "Rio De Janeiro",
    "country": "BR"
  },
  {
    "iata": "NAT",
    "name": "Greater Natal International Airport",
    "city": "Sao Goncalo Do Amarante",
    "country": "BR"
  },
  {
    "iata": "SJK",
    "name": "Professor Urbano Ernesto Stumpf Airport",
    "city": "Sao Jose Dos Campos",
    "country": "BR"
  },
  {
    "iata": "SLZ",
    "name": "Marechal Cunha Machado International Airport",
    "city": "Sao Luis",
    "country": "BR"
  },
  {
    "iata": "RIA",
    "name": "Santa Maria Airport",
    "city": "Santa Maria",
    "country": "BR"
  },
  {
    "iata": "STM",
    "name": "Maestro Wilson Fonseca Airport",
    "city": "Santarem",
    "country": "BR"
  },
  {
    "iata": "CGH",
    "name": "Congonhas Airport",
    "city": "Sao Paulo",
    "country": "BR"
  },
  {
    "iata": "SJP",
    "name": "Sao Jose do Rio Preto Airport",
    "city": "Sao Jose Do Rio Preto",
    "country": "BR"
  },
  {
    "iata": "SSZ",
    "name": "Base Aerea de Santos Airport",
    "city": "Guaruja",
    "country": "BR"
  },
  {
    "iata": "SSA",
    "name": "Deputado Luiz Eduardo Magalhaes International Airport",
    "city": "Salvador",
    "country": "BR"
  },
  {
    "iata": "QHP",
    "name": "Base de Aviacao de Taubate Airport",
    "city": "Taubate",
    "country": "BR"
  },
  {
    "iata": "TMT",
    "name": "Trombetas Airport",
    "city": "Oriximina",
    "country": "BR"
  },
  {
    "iata": "UNA",
    "name": "Hotel Transamerica Airport",
    "city": "Una",
    "country": "BR"
  },
  {
    "iata": "TOW",
    "name": "Toledo Airport",
    "city": "Toledo",
    "country": "BR"
  },
  {
    "iata": "THE",
    "name": "Senador Petronio Portela Airport",
    "city": "Teresina",
    "country": "BR"
  },
  {
    "iata": "TFF",
    "name": "Tefe Airport",
    "city": "Tefe",
    "country": "BR"
  },
  {
    "iata": "TJL",
    "name": "Plinio Alarcom Airport",
    "city": "Tres Lagoas",
    "country": "BR"
  },
  {
    "iata": "TRQ",
    "name": "Tarauaca Airport",
    "city": "Tarauaca",
    "country": "BR"
  },
  {
    "iata": "TEC",
    "name": "Telemaco Borba Airport",
    "city": "Telemaco Borba",
    "country": "BR"
  },
  {
    "iata": "TBT",
    "name": "Tabatinga Airport",
    "city": "Tabatinga",
    "country": "BR"
  },
  {
    "iata": "TUR",
    "name": "Tucurui Airport",
    "city": "Tucurui",
    "country": "BR"
  },
  {
    "iata": "SJL",
    "name": "Sao Gabriel da Cachoeira Airport",
    "city": "Sao Gabriel Da Cachoeira",
    "country": "BR"
  },
  {
    "iata": "PAV",
    "name": "Paulo Afonso Airport",
    "city": "Paulo Afonso",
    "country": "BR"
  },
  {
    "iata": "URG",
    "name": "Rubem Berta Airport",
    "city": "Uruguaiana",
    "country": "BR"
  },
  {
    "iata": "UDI",
    "name": "Ten. Cel. Aviador Cesar Bombonato Airport",
    "city": "Uberlandia",
    "country": "BR"
  },
  {
    "iata": "UBA",
    "name": "Mario de Almeida Franco Airport",
    "city": "Uberaba",
    "country": "BR"
  },
  {
    "iata": "VDC",
    "name": "Glauber Rocha Airport",
    "city": "Vitória da Conquista",
    "country": "BR"
  },
  {
    "iata": "VAG",
    "name": "Major Brigadeiro Trompowsky Airport",
    "city": "Varginha",
    "country": "BR"
  },
  {
    "iata": "BVH",
    "name": "Vilhena Airport",
    "city": "Vilhena",
    "country": "BR"
  },
  {
    "iata": "VIX",
    "name": "Eurico de Aguiar Salles Airport",
    "city": "Vitoria",
    "country": "BR"
  },
  {
    "iata": "QPS",
    "name": "Campo Fontenelle Airport",
    "city": "Pirassununga",
    "country": "BR"
  },
  {
    "iata": "IZA",
    "name": "Zona da Mata Regional Airport",
    "city": "Juiz De Fora",
    "country": "BR"
  },
  {
    "iata": "CPQ",
    "name": "Amarais Airport",
    "city": "Campinas",
    "country": "BR"
  },
  {
    "iata": "QCJ",
    "name": "Botucatu Airport",
    "city": "Botucatu",
    "country": "BR"
  },
  {
    "iata": "OLC",
    "name": "Senadora Eunice Micheles Airport",
    "city": "Sao Paulo De Olivenca",
    "country": "BR"
  },
  {
    "iata": "SOD",
    "name": "Sorocaba Airport",
    "city": "Sorocaba",
    "country": "BR"
  },
  {
    "iata": "QDC",
    "name": "Dracena Airport",
    "city": "Dracena",
    "country": "BR"
  },
  {
    "iata": "JLS",
    "name": "Jales Airport",
    "city": "Jales",
    "country": "BR"
  },
  {
    "iata": "QOA",
    "name": "Mococa Airport",
    "city": "Mococa",
    "country": "BR"
  },
  {
    "iata": "PBA",
    "name": "Fazenda Pontal Airport",
    "city": "Cairu",
    "country": "BR"
  },
  {
    "iata": "QGC",
    "name": "Lencois Paulista Airport",
    "city": "Lencois Paulista",
    "country": "BR"
  },
  {
    "iata": "QNV",
    "name": "Aeroclube Airport",
    "city": "Nova Iguacu",
    "country": "BR"
  },
  {
    "iata": "OUS",
    "name": "Ourinhos Airport",
    "city": "Ourinhos",
    "country": "BR"
  },
  {
    "iata": "OIA",
    "name": "Ourilandia do Norte Airport",
    "city": "Ourilandia Do Norte",
    "country": "BR"
  },
  {
    "iata": "QHB",
    "name": "Piracicaba Airport",
    "city": "Piracicaba",
    "country": "BR"
  },
  {
    "iata": "QIQ",
    "name": "Rio Claro Airport",
    "city": "Rio Claro",
    "country": "BR"
  },
  {
    "iata": "QVP",
    "name": "Avare-Arandu Airport",
    "city": "Avare",
    "country": "BR"
  },
  {
    "iata": "QRZ",
    "name": "Resende Airport",
    "city": "Resende",
    "country": "BR"
  },
  {
    "iata": "QSC",
    "name": "Sao Carlos Airport",
    "city": "Sao Carlos",
    "country": "BR"
  },
  {
    "iata": "UBT",
    "name": "Ubatuba Airport",
    "city": "Ubatuba",
    "country": "BR"
  },
  {
    "iata": "ITP",
    "name": "Itaperuna Airport",
    "city": "Itaperuna",
    "country": "BR"
  },
  {
    "iata": "QGS",
    "name": "Alagoinhas Airport",
    "city": "Alagoinhas",
    "country": "BR"
  },
  {
    "iata": "VOT",
    "name": "Votuporanga Airport",
    "city": "Votuporanga",
    "country": "BR"
  },
  {
    "iata": "ALT",
    "name": "Alenquer Airport",
    "city": "Alenquer",
    "country": "BR"
  },
  {
    "iata": "QGB",
    "name": "Limeira Airport",
    "city": "Limeira",
    "country": "BR"
  },
  {
    "iata": "MSI",
    "name": "Fazenda Palmital Airport",
    "city": "Morro Agudo",
    "country": "BR"
  },
  {
    "iata": "LVR",
    "name": "Municipal Bom Futuro Airport",
    "city": "Lucas do Rio Verde",
    "country": "BR"
  },
  {
    "iata": "FRC",
    "name": "Franca Airport",
    "city": "Franca",
    "country": "BR"
  },
  {
    "iata": "JUA",
    "name": "Juara Sul Airport",
    "city": "Juara",
    "country": "BR"
  },
  {
    "iata": "CFO",
    "name": "Confresa Airport",
    "city": "Confresa",
    "country": "BR"
  },
  {
    "iata": "NPR",
    "name": "Novo Progresso Airport",
    "city": "Novo Progresso",
    "country": "BR"
  },
  {
    "iata": "RIG",
    "name": "Rio Grande Airport",
    "city": "Rio Grande",
    "country": "BR"
  },
  {
    "iata": "JAW",
    "name": "Araripina Airport",
    "city": "Araripina",
    "country": "BR"
  },
  {
    "iata": "APY",
    "name": "Alto Parnaiba Airport",
    "city": "Alto Parnaiba",
    "country": "BR"
  },
  {
    "iata": "APQ",
    "name": "Arapiraca Airport",
    "city": "Arapiraca",
    "country": "BR"
  },
  {
    "iata": "AMJ",
    "name": "Cirilo Queiroz Airport",
    "city": "Almenara",
    "country": "BR"
  },
  {
    "iata": "BDC",
    "name": "Barra do Corda Airport",
    "city": "Barra Do Corda",
    "country": "BR"
  },
  {
    "iata": "BVM",
    "name": "Belmonte Airport",
    "city": "Belmonte",
    "country": "BR"
  },
  {
    "iata": "BRA",
    "name": "Barreiras Airport",
    "city": "Barreiras",
    "country": "BR"
  },
  {
    "iata": "BSS",
    "name": "Balsas Airport",
    "city": "Balsas",
    "country": "BR"
  },
  {
    "iata": "BMS",
    "name": "Socrates Mariani Bittencourt Airport",
    "city": "Brumado",
    "country": "BR"
  },
  {
    "iata": "BQQ",
    "name": "Barra Airport",
    "city": "Barra",
    "country": "BR"
  },
  {
    "iata": "CTP",
    "name": "Carutapera Airport",
    "city": "Carutapera",
    "country": "BR"
  },
  {
    "iata": "CPU",
    "name": "Cururupu Airport",
    "city": "Cururupu",
    "country": "BR"
  },
  {
    "iata": "QCH",
    "name": "Colatina Airport",
    "city": "Colatina",
    "country": "BR"
  },
  {
    "iata": "RDC",
    "name": "Redencao Airport",
    "city": "Redencao",
    "country": "BR"
  },
  {
    "iata": "LEP",
    "name": "Leopoldina Airport",
    "city": "Leopoldina",
    "country": "BR"
  },
  {
    "iata": "DTI",
    "name": "Diamantina Airport",
    "city": "Diamantina",
    "country": "BR"
  },
  {
    "iata": "DIQ",
    "name": "Divinopolis Airport",
    "city": "Divinopolis",
    "country": "BR"
  },
  {
    "iata": "CNV",
    "name": "Canavieiras Airport",
    "city": "Canavieiras",
    "country": "BR"
  },
  {
    "iata": "SXX",
    "name": "Sao Felix do Xingu Airport",
    "city": "Sao Felix Do Xingu",
    "country": "BR"
  },
  {
    "iata": "GUZ",
    "name": "Guarapari Airport",
    "city": "Guarapari",
    "country": "BR"
  },
  {
    "iata": "GDP",
    "name": "Guadalupe Airport",
    "city": "Guadalupe",
    "country": "BR"
  },
  {
    "iata": "GNM",
    "name": "Guanambi Airport",
    "city": "Guanambi",
    "country": "BR"
  },
  {
    "iata": "GMS",
    "name": "Fazenda Canada Airport",
    "city": "Uberlandia",
    "country": "BR"
  },
  {
    "iata": "QGP",
    "name": "Garanhuns Airport",
    "city": "Garanhuns",
    "country": "BR"
  },
  {
    "iata": "IRE",
    "name": "Irece Airport",
    "city": "Irece",
    "country": "BR"
  },
  {
    "iata": "QIG",
    "name": "Iguatu Airport",
    "city": "Iguatu",
    "country": "BR"
  },
  {
    "iata": "QIT",
    "name": "Itapetinga Airport",
    "city": "Itapetinga",
    "country": "BR"
  },
  {
    "iata": "IPU",
    "name": "Ipiau Airport",
    "city": "Ipiau",
    "country": "BR"
  },
  {
    "iata": "JCM",
    "name": "Jacobina Airport",
    "city": "Jacobina",
    "country": "BR"
  },
  {
    "iata": "FEC",
    "name": "Joao Durval Carneiro Airport",
    "city": "Feira De Santana",
    "country": "BR"
  },
  {
    "iata": "JEQ",
    "name": "Jequie Airport",
    "city": "Jequie",
    "country": "BR"
  },
  {
    "iata": "JNA",
    "name": "Januaria Airport",
    "city": "Januaria",
    "country": "BR"
  },
  {
    "iata": "JDR",
    "name": "Prefeito Octavio de Almeida Neves Airport",
    "city": "Sao Joao Del Rei",
    "country": "BR"
  },
  {
    "iata": "CMP",
    "name": "Santana do Araguaia Airport",
    "city": "Santana Do Araguaia",
    "country": "BR"
  },
  {
    "iata": "QDF",
    "name": "Conselheiro Lafaiete Airport",
    "city": "Conselheiro Lafaiete",
    "country": "BR"
  },
  {
    "iata": "CDI",
    "name": "Cachoeiro do Itapemirim Airport",
    "city": "Cachoeiro Do Itapemirim",
    "country": "BR"
  },
  {
    "iata": "QCP",
    "name": "Currais Novos Airport",
    "city": "Currais Novos",
    "country": "BR"
  },
  {
    "iata": "SSO",
    "name": "Sao Lourenco Airport",
    "city": "Sao Lourenco",
    "country": "BR"
  },
  {
    "iata": "MTE",
    "name": "Monte Alegre Airport",
    "city": "Monte Alegre",
    "country": "BR"
  },
  {
    "iata": "MVS",
    "name": "Mucuri Airport",
    "city": "Mucuri",
    "country": "BR"
  },
  {
    "iata": "SBJ",
    "name": "Sao Mateus Airport",
    "city": "Sao Mateus",
    "country": "BR"
  },
  {
    "iata": "PTQ",
    "name": "Porto de Moz Airport",
    "city": "Porto De Moz",
    "country": "BR"
  },
  {
    "iata": "NNU",
    "name": "Nanuque Airport",
    "city": "Nanuque",
    "country": "BR"
  },
  {
    "iata": "QBX",
    "name": "Sobral Airport",
    "city": "Sobral",
    "country": "BR"
  },
  {
    "iata": "PSW",
    "name": "Municipal Jose Figueiredo Airport",
    "city": "Passos",
    "country": "BR"
  },
  {
    "iata": "FEJ",
    "name": "Feijó Airport ",
    "city": "Feijo",
    "country": "BR"
  },
  {
    "iata": "ORX",
    "name": "Oriximina Airport",
    "city": "Oriximina",
    "country": "BR"
  },
  {
    "iata": "PCS",
    "name": "Picos Airport",
    "city": "Picos",
    "country": "BR"
  },
  {
    "iata": "POJ",
    "name": "Patos de Minas Airport",
    "city": "Patos De Minas",
    "country": "BR"
  },
  {
    "iata": "PIV",
    "name": "Pirapora Airport",
    "city": "Pirapora",
    "country": "BR"
  },
  {
    "iata": "FLB",
    "name": "Cangapara Airport",
    "city": "Floriano",
    "country": "BR"
  },
  {
    "iata": "PDF",
    "name": "Prado Airport",
    "city": "Prado",
    "country": "BR"
  },
  {
    "iata": "CAU",
    "name": "Caruaru Airport",
    "city": "Caruaru",
    "country": "BR"
  },
  {
    "iata": "OPP",
    "name": "Salinopolis Airport",
    "city": "Salinopolis",
    "country": "BR"
  },
  {
    "iata": "SFK",
    "name": "Soure Airport",
    "city": "Soure",
    "country": "BR"
  },
  {
    "iata": "TXF",
    "name": "Teixeira de Freitas Airport",
    "city": "Teixeira De Freitas",
    "country": "BR"
  },
  {
    "iata": "OBI",
    "name": "Obidos Airport",
    "city": "Obidos",
    "country": "BR"
  },
  {
    "iata": "TFL",
    "name": "Juscelino Kubitscheck Airport",
    "city": "Teofilo Otoni",
    "country": "BR"
  },
  {
    "iata": "VAL",
    "name": "Valenca Airport",
    "city": "Valenca",
    "country": "BR"
  },
  {
    "iata": "QID",
    "name": "Melio Viana Airport",
    "city": "Tres Coracoes",
    "country": "BR"
  },
  {
    "iata": "BVS",
    "name": "Breves Airport",
    "city": "Breves",
    "country": "BR"
  },
  {
    "iata": "CMC",
    "name": "Camocim Airport",
    "city": "Camocim",
    "country": "BR"
  },
  {
    "iata": "QXC",
    "name": "Fazenda Sao Braz Airport",
    "city": "Barra De Santo Antonio",
    "country": "BR"
  },
  {
    "iata": "GGF",
    "name": "Almeirim Airport",
    "city": "Almeirim",
    "country": "BR"
  },
  {
    "iata": "PHI",
    "name": "Pinheiro Airport",
    "city": "Pinheiro",
    "country": "BR"
  },
  {
    "iata": "ITI",
    "name": "Agropecuaria Castanhais Airport",
    "city": "Cumaru Do Norte",
    "country": "BR"
  },
  {
    "iata": "PPY",
    "name": "Pouso Alegre Airport",
    "city": "Pouso Alegre",
    "country": "BR"
  },
  {
    "iata": "ITE",
    "name": "Itubera Airport",
    "city": "Itubera",
    "country": "BR"
  },
  {
    "iata": "APU",
    "name": "Apucarana Airport",
    "city": "Apucarana",
    "country": "BR"
  },
  {
    "iata": "BGV",
    "name": "Aeroclube de Bento Goncalves Airport",
    "city": "Bento Goncalves",
    "country": "BR"
  },
  {
    "iata": "BNU",
    "name": "Blumenau Airport",
    "city": "Blumenau",
    "country": "BR"
  },
  {
    "iata": "CCI",
    "name": "Concordia Airport",
    "city": "Concordia",
    "country": "BR"
  },
  {
    "iata": "CSS",
    "name": "Cassilandia Airport",
    "city": "Cassilandia",
    "country": "BR"
  },
  {
    "iata": "CEL",
    "name": "Canela Airport",
    "city": "Canela",
    "country": "BR"
  },
  {
    "iata": "CKO",
    "name": "Cornelio Procopio Airport",
    "city": "Cornelio Procopio",
    "country": "BR"
  },
  {
    "iata": "GGH",
    "name": "Cianorte Airport",
    "city": "Cianorte",
    "country": "BR"
  },
  {
    "iata": "DOU",
    "name": "Dourados Airport",
    "city": "Dourados",
    "country": "BR"
  },
  {
    "iata": "ERM",
    "name": "Erechim Airport",
    "city": "Erechim",
    "country": "BR"
  },
  {
    "iata": "FBE",
    "name": "Francisco Beltrao Airport",
    "city": "Francisco Beltrao",
    "country": "BR"
  },
  {
    "iata": "QGA",
    "name": "Guaira Airport",
    "city": "Guaira",
    "country": "BR"
  },
  {
    "iata": "HRZ",
    "name": "Horizontina Airport",
    "city": "Horizontina",
    "country": "BR"
  },
  {
    "iata": "IJU",
    "name": "Ijui Airport",
    "city": "Ijui",
    "country": "BR"
  },
  {
    "iata": "ITQ",
    "name": "Itaqui Airport",
    "city": "Itaqui",
    "country": "BR"
  },
  {
    "iata": "JCB",
    "name": "Santa Terezinha Airport",
    "city": "Joacaba",
    "country": "BR"
  },
  {
    "iata": "CBW",
    "name": "Campo Mourao Airport",
    "city": "Campo Mourao",
    "country": "BR"
  },
  {
    "iata": "QDB",
    "name": "Cachoeira do Sul Airport",
    "city": "Cachoeira Do Sul",
    "country": "BR"
  },
  {
    "iata": "QCR",
    "name": "Curitibanos Airport",
    "city": "Curitibanos",
    "country": "BR"
  },
  {
    "iata": "OAL",
    "name": "Cacoal Airport",
    "city": "Cacoal",
    "country": "BR"
  },
  {
    "iata": "LOI",
    "name": "Helmuth Baungarten Airport",
    "city": "Lontras",
    "country": "BR"
  },
  {
    "iata": "ALQ",
    "name": "Alegrete Novo Airport",
    "city": "Alegrete",
    "country": "BR"
  },
  {
    "iata": "QMF",
    "name": "Mafra Airport",
    "city": "Mafra",
    "country": "BR"
  },
  {
    "iata": "QGF",
    "name": "Montenegro Airport",
    "city": "Montenegro",
    "country": "BR"
  },
  {
    "iata": "QHV",
    "name": "Novo Hamburgo Airport",
    "city": "Novo Hamburgo",
    "country": "BR"
  },
  {
    "iata": "SQX",
    "name": "Sao Miguel do Oeste Airport",
    "city": "Sao Miguel Do Oeste",
    "country": "BR"
  },
  {
    "iata": "APX",
    "name": "Arapongas Airport",
    "city": "Arapongas",
    "country": "BR"
  },
  {
    "iata": "VRZ",
    "name": "Lavras Airport",
    "city": "Lavras",
    "country": "BR"
  },
  {
    "iata": "AIR",
    "name": "Aripuanã Airport",
    "city": "Aripuanã",
    "country": "BR"
  },
  {
    "iata": "PTO",
    "name": "Pato Branco Airport",
    "city": "Pato Branco",
    "country": "BR"
  },
  {
    "iata": "PNG",
    "name": "Paranagua Airport",
    "city": "Paranagua",
    "country": "BR"
  },
  {
    "iata": "PVI",
    "name": "Paranavai Airport",
    "city": "Paranavai",
    "country": "BR"
  },
  {
    "iata": "PBB",
    "name": "Paranaiba Airport",
    "city": "Paranaiba",
    "country": "BR"
  },
  {
    "iata": "QAC",
    "name": "Castro Airport",
    "city": "Castro",
    "country": "BR"
  },
  {
    "iata": "SQY",
    "name": "Sao Lourenco do Sul Airport",
    "city": "Sao Lourenco Do Sul",
    "country": "BR"
  },
  {
    "iata": "QOJ",
    "name": "Sao Borja Airport",
    "city": "Sao Borja",
    "country": "BR"
  },
  {
    "iata": "CSU",
    "name": "Santa Cruz do Sul Airport",
    "city": "Santa Cruz Do Sul",
    "country": "BR"
  },
  {
    "iata": "TSQ",
    "name": "Torres Airport",
    "city": "Torres",
    "country": "BR"
  },
  {
    "iata": "UMU",
    "name": "Umuarama Airport",
    "city": "Umuarama",
    "country": "BR"
  },
  {
    "iata": "QVB",
    "name": "Uniao da Vitoria Airport",
    "city": "Uniao Da Vitoria",
    "country": "BR"
  },
  {
    "iata": "VIA",
    "name": "Videira Airport",
    "city": "Videira",
    "country": "BR"
  },
  {
    "iata": "CTQ",
    "name": "Santa Vitoria do Palmar Airport",
    "city": "Santa Vitoria Do Palmar",
    "country": "BR"
  },
  {
    "iata": "AXE",
    "name": "Xanxere Airport",
    "city": "Xanxere",
    "country": "BR"
  },
  {
    "iata": "AAG",
    "name": "Arapoti Airport",
    "city": "Arapoti",
    "country": "BR"
  },
  {
    "iata": "SRA",
    "name": "Santa Rosa Airport",
    "city": "Santa Rosa",
    "country": "BR"
  },
  {
    "iata": "PGZ",
    "name": "Ponta Grossa Airport",
    "city": "Ponta Grossa",
    "country": "BR"
  },
  {
    "iata": "BAZ",
    "name": "Barcelos Airport",
    "city": "Barcelos",
    "country": "BR"
  },
  {
    "iata": "RBB",
    "name": "Borba Airport",
    "city": "Borba",
    "country": "BR"
  },
  {
    "iata": "CAF",
    "name": "Carauari Airport",
    "city": "Carauari",
    "country": "BR"
  },
  {
    "iata": "CQS",
    "name": "Costa Marques Airport",
    "city": "Costa Marques",
    "country": "BR"
  },
  {
    "iata": "DMT",
    "name": "Diamantino Airport",
    "city": "Diamantino",
    "country": "BR"
  },
  {
    "iata": "DNO",
    "name": "Dianopolis Airport",
    "city": "Dianopolis",
    "country": "BR"
  },
  {
    "iata": "ARS",
    "name": "Estancia das Cascatas Airport",
    "city": "Aragarcas",
    "country": "BR"
  },
  {
    "iata": "ERN",
    "name": "Eirunepe Airport",
    "city": "Eirunepe",
    "country": "BR"
  },
  {
    "iata": "CQA",
    "name": "Canarana Airport",
    "city": "Canarana",
    "country": "BR"
  },
  {
    "iata": "SXO",
    "name": "Sao Felix do Araguaia Airport",
    "city": "Sao Felix Do Araguaia",
    "country": "BR"
  },
  {
    "iata": "GRP",
    "name": "Gurupi Airport",
    "city": "Gurupi",
    "country": "BR"
  },
  {
    "iata": "AUX",
    "name": "Araguaina Airport",
    "city": "Araguaina",
    "country": "BR"
  },
  {
    "iata": "GGB",
    "name": "Fazenda Olhos D`agua Airport",
    "city": "Agua Boa",
    "country": "BR"
  },
  {
    "iata": "HUW",
    "name": "Humaita Airport",
    "city": "Humaita",
    "country": "BR"
  },
  {
    "iata": "IPG",
    "name": "Ipiranga Airport",
    "city": "Santo Antonio Do Ica",
    "country": "BR"
  },
  {
    "iata": "IDO",
    "name": "Santa Izabel do Morro Airport",
    "city": "Cristalandia",
    "country": "BR"
  },
  {
    "iata": "JPR",
    "name": "Ji-Parana Airport",
    "city": "Ji-Parana",
    "country": "BR"
  },
  {
    "iata": "JIA",
    "name": "Juina Airport",
    "city": "Juina",
    "country": "BR"
  },
  {
    "iata": "JRN",
    "name": "Juruena Airport",
    "city": "Juruena",
    "country": "BR"
  },
  {
    "iata": "JTI",
    "name": "Jatai Airport",
    "city": "Jatai",
    "country": "BR"
  },
  {
    "iata": "CCX",
    "name": "Caceres Airport",
    "city": "Caceres",
    "country": "BR"
  },
  {
    "iata": "CIZ",
    "name": "Coari Airport",
    "city": "Coari",
    "country": "BR"
  },
  {
    "iata": "NSR",
    "name": "Serra da Capivara Airport",
    "city": "Sao Raimundo Nonato",
    "country": "BR"
  },
  {
    "iata": "TLZ",
    "name": "Catalao Airport",
    "city": "Catalao",
    "country": "BR"
  },
  {
    "iata": "LBR",
    "name": "Labrea Airport",
    "city": "Labrea",
    "country": "BR"
  },
  {
    "iata": "RVD",
    "name": "General Leite de Castro Airport",
    "city": "Rio Verde",
    "country": "BR"
  },
  {
    "iata": "MBZ",
    "name": "Maues Airport",
    "city": "Maues",
    "country": "BR"
  },
  {
    "iata": "NVP",
    "name": "Novo Aripuana Airport",
    "city": "Novo Aripuana",
    "country": "BR"
  },
  {
    "iata": "AQM",
    "name": "Nova Vida Airport",
    "city": "Ariquemes",
    "country": "BR"
  },
  {
    "iata": "BCR",
    "name": "Novo Campo Airport",
    "city": "Boca Do Acre",
    "country": "BR"
  },
  {
    "iata": "NQL",
    "name": "Niquelandia Airport",
    "city": "Niquelandia",
    "country": "BR"
  },
  {
    "iata": "APS",
    "name": "Anapolis Airport",
    "city": "Anapolis",
    "country": "BR"
  },
  {
    "iata": "FBA",
    "name": "Fonte Boa Airport",
    "city": "Fonte Boa",
    "country": "BR"
  },
  {
    "iata": "PBV",
    "name": "Porto dos Gauchos Airport",
    "city": "Porto Dos Gauchos",
    "country": "BR"
  },
  {
    "iata": "PIN",
    "name": "Parintins Airport",
    "city": "Parintins",
    "country": "BR"
  },
  {
    "iata": "PBQ",
    "name": "Pimenta Bueno Airport",
    "city": "Pimenta Bueno",
    "country": "BR"
  },
  {
    "iata": "PBX",
    "name": "Fazenda Piraguassu Airport",
    "city": "Porto Alegre Do Norte",
    "country": "BR"
  },
  {
    "iata": "AAI",
    "name": "Arraias Airport",
    "city": "Arraias",
    "country": "BR"
  },
  {
    "iata": "ROO",
    "name": "Rondonopolis Airport",
    "city": "Rondonopolis",
    "country": "BR"
  },
  {
    "iata": "OPS",
    "name": "Presidente Joao Batista Figueiredo Airport",
    "city": "Sinop",
    "country": "BR"
  },
  {
    "iata": "STZ",
    "name": "Santa Terezinha Airport",
    "city": "Santa Terezinha",
    "country": "BR"
  },
  {
    "iata": "IRZ",
    "name": "Tapuruquara Airport",
    "city": "Santa Isabel Do Rio Negro",
    "country": "BR"
  },
  {
    "iata": "TGQ",
    "name": "Tangara da Serra Airport",
    "city": "Tangara Da Serra",
    "country": "BR"
  },
  {
    "iata": "AZL",
    "name": "Fazenda Tucunare Airport",
    "city": "Sapezal",
    "country": "BR"
  },
  {
    "iata": "QHN",
    "name": "Taguatinga Airport",
    "city": "Taguatinga",
    "country": "BR"
  },
  {
    "iata": "SQM",
    "name": "Sao Miguel do Araguaia Airport",
    "city": "Sao Miguel Do Araguaia",
    "country": "BR"
  },
  {
    "iata": "MTG",
    "name": "Vila Bela da Santissima Trindade Airport",
    "city": "Vila Bela Da Santissima Trindade",
    "country": "BR"
  },
  {
    "iata": "VLP",
    "name": "Vila Rica Airport",
    "city": "Vila Rica",
    "country": "BR"
  },
  {
    "iata": "MBK",
    "name": "Regional Orlando Villas Boas Airport",
    "city": "Matupa",
    "country": "BR"
  },
  {
    "iata": "NOK",
    "name": "Xavantina Airport",
    "city": "Nova Xavantina",
    "country": "BR"
  },
  {
    "iata": "KBP",
    "name": "Boryspil International Airport",
    "city": "Kiev",
    "country": "UA"
  },
  {
    "iata": "MXR",
    "name": "Myrhorod Air Base",
    "city": "Myrhorod",
    "country": "UA"
  },
  {
    "iata": "DOK",
    "name": "Donetsk International Airport",
    "city": "Donetsk",
    "country": "UA"
  },
  {
    "iata": "KRQ",
    "name": "Kramatorsk Airport",
    "city": "Kramatorsk",
    "country": "UA"
  },
  {
    "iata": "MPW",
    "name": "Mariupol International Airport",
    "city": "Mariupol",
    "country": "UA"
  },
  {
    "iata": "SEV",
    "name": "Sievierodonetsk Airport",
    "city": "Sievierodonetsk",
    "country": "UA"
  },
  {
    "iata": "VSG",
    "name": "Luhansk International Airport",
    "city": "Luhansk",
    "country": "UA"
  },
  {
    "iata": "ERD",
    "name": "Berdyansk Airport",
    "city": "Berdyansk",
    "country": "UA"
  },
  {
    "iata": "DNK",
    "name": "Dnipropetrovsk International Airport",
    "city": "Dnipropetrovsk",
    "country": "UA"
  },
  {
    "iata": "OZH",
    "name": "Zaporizhzhia International Airport",
    "city": "Zaporizhia",
    "country": "UA"
  },
  {
    "iata": "KWG",
    "name": "Kryvyi Rih International Airport",
    "city": "Kryvyi Rih",
    "country": "UA"
  },
  {
    "iata": "SIP",
    "name": "Simferopol International Airport",
    "city": "Simferopol",
    "country": "UA"
  },
  {
    "iata": "KHC",
    "name": "Kerch Airport",
    "city": "Kerch",
    "country": "UA"
  },
  {
    "iata": "HRK",
    "name": "Kharkiv International Airport",
    "city": "Kharkiv",
    "country": "UA"
  },
  {
    "iata": "PLV",
    "name": "Suprunovka Airport",
    "city": "Poltava",
    "country": "UA"
  },
  {
    "iata": "UMY",
    "name": "Sumy Airport",
    "city": "Sumy",
    "country": "UA"
  },
  {
    "iata": "CKC",
    "name": "Cherkasy International Airport",
    "city": "Cherkasy",
    "country": "UA"
  },
  {
    "iata": "KGO",
    "name": "Kirovograd Airport",
    "city": "Kirovograd",
    "country": "UA"
  },
  {
    "iata": "IEV",
    "name": "Kiev Zhuliany International Airport",
    "city": "Kiev",
    "country": "UA"
  },
  {
    "iata": "GML",
    "name": "Gostomel Airport",
    "city": "Kiev",
    "country": "UA"
  },
  {
    "iata": "ZTR",
    "name": "Zhytomyr Airport",
    "city": "",
    "country": "UA"
  },
  {
    "iata": "UCK",
    "name": "Lutsk Airport",
    "city": "Lutsk",
    "country": "UA"
  },
  {
    "iata": "HMJ",
    "name": "Khmelnytskyi Airport",
    "city": "Khmelnytskyi",
    "country": "UA"
  },
  {
    "iata": "IFO",
    "name": "Ivano-Frankivsk International Airport",
    "city": "Ivano-Frankivsk",
    "country": "UA"
  },
  {
    "iata": "LWO",
    "name": "Lviv International Airport",
    "city": "Lviv",
    "country": "UA"
  },
  {
    "iata": "CWC",
    "name": "Chernivtsi International Airport",
    "city": "Chernivtsi",
    "country": "UA"
  },
  {
    "iata": "RWN",
    "name": "Rivne International Airport",
    "city": "Rivne",
    "country": "UA"
  },
  {
    "iata": "TNL",
    "name": "Ternopil International Airport",
    "city": "Ternopil",
    "country": "UA"
  },
  {
    "iata": "UDJ",
    "name": "Uzhhorod International Airport",
    "city": "Uzhhorod",
    "country": "UA"
  },
  {
    "iata": "KHE",
    "name": "Chernobayevka Airport",
    "city": "Kherson",
    "country": "UA"
  },
  {
    "iata": "NLV",
    "name": "Mykolaiv International Airport",
    "city": "Nikolayev",
    "country": "UA"
  },
  {
    "iata": "ODS",
    "name": "Odessa International Airport",
    "city": "Odessa",
    "country": "UA"
  },
  {
    "iata": "VIN",
    "name": "Vinnytsia/Gavyryshivka Airport",
    "city": "Vinnitsa",
    "country": "UA"
  },
  {
    "iata": "BQT",
    "name": "Brest Airport",
    "city": "Brest",
    "country": "BY"
  },
  {
    "iata": "GME",
    "name": "Gomel Airport",
    "city": "Gomel",
    "country": "BY"
  },
  {
    "iata": "VTB",
    "name": "Vitebsk East Airport",
    "city": "Vitebsk",
    "country": "BY"
  },
  {
    "iata": "GNA",
    "name": "Hrodna Airport",
    "city": "Hrodna",
    "country": "BY"
  },
  {
    "iata": "MHP",
    "name": "Minsk 1 Airport",
    "city": "Minsk",
    "country": "BY"
  },
  {
    "iata": "MSQ",
    "name": "Minsk International Airport",
    "city": "Minsk",
    "country": "BY"
  },
  {
    "iata": "MVQ",
    "name": "Mogilev Airport",
    "city": "Mogilev",
    "country": "BY"
  },
  {
    "iata": "UKS",
    "name": "Belbek Airport",
    "city": "Sevastopol",
    "country": "UA"
  },
  {
    "iata": "SKL",
    "name": "Skye Bridge Ashaig Airport",
    "city": "Broadford",
    "country": "GB"
  }
];
