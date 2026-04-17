'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, Search, Settings, Plane, ArrowRight, ArrowLeftRight,
  Package, Users, Calendar, AlertCircle, CheckCircle2,
  ChevronDown, X, RefreshCw, TrendingDown, DollarSign,
  Info, Loader2, Star, Trophy, Zap, MapPin
} from 'lucide-react';
import {
  FlightSearchParams, FlightResult, MilesOption, MilesRates, QuoteAgentResult,
  searchGoogleFlights, calculateMilesOptions, searchAirports, searchSmartFlexibleFlights
} from '@/services/quoteAgentService';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtNum = (v: number) => v.toLocaleString('pt-BR');

// ─────────────────────────────────────────────
// Airport Autocomplete
// ─────────────────────────────────────────────
function AirportInput({
  label, value, onChange, placeholder
}: {
  label: string;
  value: string;
  onChange: (iata: string, name: string) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchAirports>>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (q: string) => {
    setQuery(q);
    const results = searchAirports(q);
    setSuggestions(results);
    setOpen(results.length > 0);
    if (q.length < 2) onChange('', '');
  };

  const select = (iata: string, city: string, name: string) => {
    setQuery(`${iata} — ${city} (${name})`);
    onChange(iata, city);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#19727d]" />
        <input
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => query.length >= 2 && suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19727d]/30 focus:border-[#19727d] transition-all"
        />
      </div>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {suggestions.map(a => {
            const isCity = (a as any).isCity;
            return (
              <button
                key={a.iata}
                onMouseDown={() => select(a.iata, a.city, a.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                  isCity 
                    ? 'bg-[#19727d]/5 hover:bg-[#19727d]/10 border-l-4 border-[#19727d]' 
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700 border-l-4 border-transparent'
                }`}
              >
                <span className={`w-12 text-center font-black text-xs rounded-lg py-1 flex-shrink-0 ${
                  isCity 
                    ? 'bg-[#19727d] text-white' 
                    : 'bg-[#19727d]/10 text-[#19727d]'
                }`}>
                  {a.iata}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{a.city}</p>
                    {isCity && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Cidade</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isCity ? 'Pesquisa todos os aeroportos' : a.name} · {a.country}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Painel de Configuração de Taxas
// ─────────────────────────────────────────────
function RatesPanel({
  rates, onChange, onSave, saving
}: {
  rates: MilesRates;
  onChange: (k: keyof MilesRates, v: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const fields: { key: keyof MilesRates; label: string; prefix: string }[] = [
    { key: 'smiles', label: 'Smiles (GOL)', prefix: 'R$/mil' },
    { key: 'azul', label: 'Azul pelo Mundo', prefix: 'R$/mil' },
    { key: 'latam', label: 'LATAM Pass', prefix: 'R$/mil' },
    { key: 'iberia', label: 'Iberia / Avios', prefix: 'R$/mil' },
    { key: 'tap', label: 'TAP Miles&Go', prefix: 'R$/mil' },
    { key: 'usdRate', label: 'Dólar (USD)', prefix: 'R$' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-[#19727d]" />
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Taxas de Milhas</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{f.label}</label>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2">
              <span className="text-[10px] font-bold text-gray-400">{f.prefix}</span>
              <input
                type="number"
                step="0.50"
                value={String(rates[f.key])}
                onChange={e => onChange(f.key, e.target.value)}
                className="flex-1 bg-transparent text-sm font-bold text-gray-900 dark:text-white text-right outline-none w-16"
              />
            </div>
          </div>
        ))}
      </div>
        {/* Campo SerpAPI Key removido e fixado no código para segurança */}
      <button
        onClick={onSave}
        disabled={saving}
        className="w-full py-2 bg-[#19727d] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#145d66] transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
        {saving ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Card de Resultado do Google Flights
// ─────────────────────────────────────────────
function FlightCard({ flight, index }: { flight: FlightResult; index: number }) {
  const isBest = index === 0;
  return (
    <div className={`relative p-4 rounded-2xl border-2 transition-all ${
      isBest
        ? 'border-[#19727d] bg-[#19727d]/5 dark:bg-[#19727d]/10'
        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
    }`}>
      {isBest && (
        <span className="absolute -top-2.5 left-4 bg-[#19727d] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
          Menor Preço
        </span>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-gray-900 dark:text-white">{flight.airline}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-500">{flight.stops === 0 ? 'Direto' : `${flight.stops} conexão`}</span>
            {flight.connection && <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">{flight.connection}</span>}
            <span className="text-xs text-gray-400">· {flight.duration}</span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${isBest ? 'text-[#19727d]' : 'text-gray-900 dark:text-white'}`}>
            {fmtBRL(flight.price)}
          </p>
          <p className="text-[10px] text-gray-400">
            {flight.hasBaggage ? '✓ Com bagagem' : '✗ Sem bagagem'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Card de Opção de Milhas
// ─────────────────────────────────────────────
function MilesCard({
  option, index, googleBest
}: {
  option: MilesOption;
  index: number;
  googleBest: number | null
}) {
  const isBest = index === 0;
  const saving = googleBest ? googleBest - option.totalCostBrl : null;
  const savingPct = saving && googleBest ? Math.round((saving / googleBest) * 100) : null;

  return (
    <div className={`relative p-4 rounded-2xl border-2 transition-all ${
      isBest
        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
    }`}>
      {isBest && (
        <span className="absolute -top-2.5 left-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Trophy className="w-3 h-3" /> Melhor Opção
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-black text-gray-900 dark:text-white">{option.program}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {fmtNum(option.miles)} milhas + {fmtBRL(option.taxesBrl)} taxas
          </p>
          <p className="text-[10px] text-gray-400">Taxa: R$ {option.ratePerThousand.toFixed(2)}/mil pts</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
            {fmtBRL(option.totalCostBrl)}
          </p>
          {saving !== null && saving > 0 && (
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Economia de {savingPct}% vs GF
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Painel de Milhas Manuais
// ─────────────────────────────────────────────
function ManualMilesPanel({
  values, onChange
}: {
  values: { smiles: string; azul: string; latam: string; iberia: string; taxisUsd: string };
  onChange: (k: string, v: string) => void;
}) {
  const fields = [
    { key: 'smiles', label: 'Milhas Smiles', ph: 'Ex: 70000' },
    { key: 'azul', label: 'Milhas Azul', ph: 'Ex: 65000' },
    { key: 'latam', label: 'Milhas LATAM', ph: 'Ex: 80000' },
    { key: 'iberia', label: 'Avios (Iberia)', ph: 'Ex: 99000' },
    { key: 'taxisUsd', label: 'Taxas Iberia (USD)', ph: 'Ex: 254.30' },
  ];

  return (
    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-600" />
        <p className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">Milhas Encontradas (opcional)</p>
      </div>
      <p className="text-[11px] text-amber-700 dark:text-amber-300">
        Se você já consultou os programas, insira as milhas reais para um cálculo preciso. Deixe em branco para usar estimativas.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1">{f.label}</label>
            <input
              type="number"
              value={values[f.key as keyof typeof values]}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.ph}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────
export function AgenteCotacaoView() {
  const [showSettings, setShowSettings] = useState(false);
  const [savingRates, setSavingRates] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRates, setLoadingRates] = useState(true);

  // Formulário
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('roundtrip');
  const [originIata, setOriginIata] = useState('');
  const [destIata, setDestIata] = useState('');
  const [originLabel, setOriginLabel] = useState('');
  const [destLabel, setDestLabel] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [hasBaggage, setHasBaggage] = useState(false);

  // Milhas manuais
  const [manualMiles, setManualMiles] = useState({
    smiles: '', azul: '', latam: '', iberia: '', taxisUsd: ''
  });

  // Taxas e resultados
  const [rates, setRates] = useState<MilesRates>({
    smiles: 16.50, azul: 14.00, latam: 25.50, iberia: 54.00, tap: 50.00,
    usdRate: 5.80, serpApiKey: ''
  });
  const [result, setResult] = useState<QuoteAgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Novos estados para Flexibilidade e Estadia
  const [flexibility, setFlexibility] = useState(0);
  const [stayMode, setStayMode] = useState<'date' | 'duration'>('date');
  const [minStay, setMinStay] = useState(7);
  const [maxStay, setMaxStay] = useState(14);
  const [scanningMsg, setScanningMsg] = useState<string | null>(null);
  const [bestDateInfo, setBestDateInfo] = useState<string | null>(null);

  // Carregar taxas do Supabase
  useEffect(() => {
    const loadRates = async () => {
      try {
        const { data } = await supabase.from('financial_settings').select('key, value');
        if (data) {
          const map: Record<string, string> = {};
          data.forEach(r => { map[r.key] = r.value || ''; });
          setRates({
            smiles: parseFloat(map['miles_rate_smiles'] || '16.50'),
            azul: parseFloat(map['miles_rate_azul'] || '14.00'),
            latam: parseFloat(map['miles_rate_latam'] || '25.50'),
            iberia: parseFloat(map['miles_rate_iberia'] || '54.00'),
            tap: parseFloat(map['miles_rate_tap'] || '50.00'),
            usdRate: parseFloat(map['usd_rate_manual'] || '5.80'),
            serpApiKey: map['serpapi_key'] || '',
          });
        }
      } catch (e) {
        console.error('Erro ao carregar taxas:', e);
      } finally {
        setLoadingRates(false);
      }
    };
    loadRates();
  }, []);

  const handleRateChange = (k: keyof MilesRates, v: string) => {
    setRates(prev => ({ ...prev, [k]: typeof prev[k] === 'number' ? parseFloat(v) || 0 : v }));
  };

  const saveRates = async () => {
    setSavingRates(true);
    try {
      const payloads = [
        { key: 'miles_rate_smiles', value: String(rates.smiles) },
        { key: 'miles_rate_azul', value: String(rates.azul) },
        { key: 'miles_rate_latam', value: String(rates.latam) },
        { key: 'miles_rate_iberia', value: String(rates.iberia) },
        { key: 'miles_rate_tap', value: String(rates.tap) },
        { key: 'usd_rate_manual', value: String(rates.usdRate) },
        { key: 'serpapi_key', value: rates.serpApiKey },
      ];
      await supabase.from('financial_settings').upsert(payloads);
      setShowSettings(false);
    } catch (e) {
      console.error('Erro ao salvar taxas:', e);
    } finally {
      setSavingRates(false);
    }
  };

  // Calcular dias
  const qtdDias = departureDate && returnDate
    ? Math.max(0, Math.round((new Date(returnDate).getTime() - new Date(departureDate).getTime()) / 86400000))
    : 0;

  const canSearch = originIata && destIata && departureDate && (tripType === 'oneway' || stayMode === 'duration' || returnDate);

  const handleSearch = async () => {
    if (!canSearch) return;
    setLoadingSearch(true);
    setError(null);
    setResult(null);
    setScanningMsg(null);
    setBestDateInfo(null);

    const params: FlightSearchParams = {
      origin: originIata.toUpperCase(),
      destination: destIata.toUpperCase(),
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      adults,
      hasBaggage,
      tripType,
      flexibility,
      useStayDuration: stayMode === 'duration',
      minStay,
      maxStay
    };

    try {
      // Busca no Google Flights (Smart Flexibility)
      let googleFlights: FlightResult[] = [];
      try {
        const { results, bestDateInfo: info } = await searchSmartFlexibleFlights(
          params, 
          rates.serpApiKey,
          (msg) => setScanningMsg(msg)
        );
        googleFlights = results;
        setBestDateInfo(info || null);
      } catch (gfErr: any) {
        setError(gfErr.message);
      }

      // Cálculo de milhas
      const manual = {
        smiles: manualMiles.smiles ? parseInt(manualMiles.smiles) : undefined,
        azul: manualMiles.azul ? parseInt(manualMiles.azul) : undefined,
        latam: manualMiles.latam ? parseInt(manualMiles.latam) : undefined,
        iberia: manualMiles.iberia ? parseInt(manualMiles.iberia) : undefined,
        taxis_usd: manualMiles.taxisUsd ? parseFloat(manualMiles.taxisUsd) : undefined,
      };
      const milesOptions = calculateMilesOptions(params, rates, manual);

      const bestGoogle = googleFlights.length > 0
        ? Math.min(...googleFlights.map(f => f.price))
        : null;

      setResult({
        googleFlights: [...googleFlights].sort((a, b) => a.price - b.price),
        bestGooglePrice: bestGoogle,
        milesOptions,
        bestMilesOption: milesOptions[0] || null,
        searchedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      setError(e.message || 'Erro inesperado na busca.');
    } finally {
      setLoadingSearch(false);
      setScanningMsg(null);
    }
  };

  const swapAirports = () => {
    const tempIata = originIata;
    const tempLabel = originLabel;
    setOriginIata(destIata);
    setOriginLabel(destLabel);
    setDestIata(tempIata);
    setDestLabel(tempLabel);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#0f172a]">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#19727d] to-[#0d4f57] rounded-2xl flex items-center justify-center shadow-xl shadow-[#19727d]/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Agente de Cotação</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pesquise voos e compare com milhas automaticamente</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(s => !s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
              showSettings
                ? 'bg-[#19727d] text-white border-[#19727d]'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-[#19727d] hover:text-[#19727d]'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configurar Taxas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda — Formulário + Configurações */}
          <div className="lg:col-span-1 space-y-4">

            {showSettings && (
              <RatesPanel
                rates={rates}
                onChange={handleRateChange}
                onSave={saveRates}
                saving={savingRates}
              />
            )}

            {/* Formulário de Busca */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 space-y-4">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#19727d]" />
                Dados do Voo
              </h2>

              {/* Tipo de viagem */}
              <div className="grid grid-cols-2 gap-2">
                {(['roundtrip', 'oneway'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTripType(t)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      tripType === t
                        ? 'bg-[#19727d] text-white border-[#19727d]'
                        : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    {t === 'roundtrip' ? <ArrowLeftRight className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    {t === 'roundtrip' ? 'Ida e Volta' : 'Só Ida'}
                  </button>
                ))}
              </div>

              {/* Aeroportos */}
              <div className="relative space-y-3">
                <AirportInput
                  label="Origem"
                  value={originLabel}
                  onChange={(iata, city) => { setOriginIata(iata); setOriginLabel(iata ? `${iata} — ${city}` : ''); }}
                  placeholder="Cidade ou código IATA..."
                />
                <button
                  onClick={swapAirports}
                  className="absolute right-3 top-[82px] -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-800 hover:bg-[#19727d] hover:text-white text-[#19727d] rounded-full shadow-md flex items-center justify-center transition-all z-10 border border-gray-200 dark:border-slate-700 hover:border-[#19727d]"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
                <AirportInput
                  label="Destino"
                  value={destLabel}
                  onChange={(iata, city) => { setDestIata(iata); setDestLabel(iata ? `${iata} — ${city}` : ''); }}
                  placeholder="Cidade ou código IATA..."
                />
              </div>

              {/* Datas e Flexibilidade */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      Data de Ida
                    </label>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={e => setDepartureDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19727d]/30 focus:border-[#19727d]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Flexibilidade</label>
                    <select
                      value={flexibility}
                      onChange={e => setFlexibility(parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19727d]/30 focus:border-[#19727d]"
                    >
                      <option value="0">Data Exata</option>
                      <option value="1">+- 1 dia</option>
                      <option value="2">+- 2 dias</option>
                      <option value="3">+- 3 dias</option>
                      <option value="7">+- 7 dias</option>
                    </select>
                  </div>
                </div>

                {tripType === 'roundtrip' && (
                  <div className="space-y-3">
                    <div className="flex bg-gray-50 dark:bg-slate-700/50 p-1 rounded-xl border border-gray-100 dark:border-slate-700">
                      <button
                        onClick={() => setStayMode('date')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${stayMode === 'date' ? 'bg-white dark:bg-slate-600 shadow-sm text-[#19727d] dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        Data Fixa
                      </button>
                      <button
                        onClick={() => setStayMode('duration')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${stayMode === 'duration' ? 'bg-white dark:bg-slate-600 shadow-sm text-[#19727d] dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        Duração
                      </button>
                    </div>

                    {stayMode === 'date' ? (
                      <div>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={e => setReturnDate(e.target.value)}
                          min={departureDate}
                          className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19727d]/30 focus:border-[#19727d]"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Mínimo dias</label>
                          <input
                            type="number"
                            value={minStay}
                            onChange={e => setMinStay(parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19727d]/30 focus:border-[#19727d]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Máximo dias</label>
                          <input
                            type="number"
                            value={maxStay}
                            onChange={e => setMaxStay(parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#19727d]/30 focus:border-[#19727d]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Qtd dias (informativo) */}
              {tripType === 'roundtrip' && qtdDias > 0 && (
                <div className="bg-[#19727d]/5 dark:bg-[#19727d]/10 rounded-xl px-4 py-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#19727d]" />
                  <p className="text-sm font-bold text-[#19727d]">{qtdDias} dias de viagem</p>
                </div>
              )}

              {/* Passageiros e Bagagem */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Passageiros</label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5">
                    <Users className="w-4 h-4 text-[#19727d]" />
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#19727d] font-black text-lg leading-none">−</button>
                    <span className="flex-1 text-center text-sm font-black text-gray-900 dark:text-white">{adults}</span>
                    <button onClick={() => setAdults(Math.min(9, adults + 1))} className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#19727d] font-black text-lg leading-none">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Bagagem 23kg</label>
                  <button
                    onClick={() => setHasBaggage(b => !b)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      hasBaggage
                        ? 'bg-[#19727d] text-white border-[#19727d]'
                        : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    {hasBaggage ? 'Com bagagem' : 'Sem bagagem'}
                  </button>
                </div>
              </div>

              {/* Botão de busca */}
              <button
                onClick={handleSearch}
                disabled={!canSearch || loadingSearch}
                className="w-full py-3 bg-gradient-to-r from-[#19727d] to-[#0d4f57] text-white rounded-xl font-black text-sm flex flex-col items-center justify-center gap-1 hover:shadow-lg hover:shadow-[#19727d]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-12"
              >
                {loadingSearch ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Pesquisando...</span>
                    </div>
                    {scanningMsg && <span className="text-[10px] font-medium opacity-80 animate-pulse">{scanningMsg}</span>}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Pesquisar e Comparar</span>
                  </div>
                )}
              </button>
            </div>

            {/* Milhas Manuais */}
            <ManualMilesPanel
              values={manualMiles}
              onChange={(k, v) => setManualMiles(prev => ({ ...prev, [k]: v }))}
            />
          </div>

          {/* Coluna Direita — Resultados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mensagem de Melhor Data */}
            {bestDateInfo && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <Zap className="w-5 h-5 text-emerald-500" />
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">{bestDateInfo}</p>
              </div>
            )}

            {/* Estado inicial */}
            {!result && !loadingSearch && !error && (
              <div className="flex flex-col items-center justify-center h-80 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 text-center p-8">
                <div className="w-16 h-16 bg-[#19727d]/10 rounded-2xl flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-[#19727d]" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Pronto para Cotar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs">Preencha o formulário ao lado e clique em <strong>"Pesquisar e Comparar"</strong> para ver os resultados.</p>
              </div>
            )}

            {/* Carregando */}
            {loadingSearch && (
              <div className="flex flex-col items-center justify-center h-80 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center">
                <div className="w-16 h-16 border-4 border-[#19727d]/10 border-t-[#19727d] rounded-full animate-spin mb-4" />
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Escaneando Ofertas</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs leading-relaxed transition-all">
                  {scanningMsg || "Aguarde enquanto o robô busca os melhores preços para você em datas próximas..."}
                </p>
              </div>
            )}

            {/* Alertas de Erro (Google Flights ou outros) */}
            {error && !loadingSearch && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-amber-800 dark:text-amber-400">Aviso do Sistema</p>
                  <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Resultados */}
            {result && !loadingSearch && (
              <>
                {/* Resumo Hero */}
                {result.bestGooglePrice && result.bestMilesOption && (
                  <div className="bg-gradient-to-r from-[#19727d] to-[#0d4f57] rounded-2xl p-5 text-white shadow-xl shadow-[#19727d]/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <p className="text-sm font-black uppercase tracking-wider text-white/90">Análise do Agente</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/70 uppercase tracking-wider">Google Flights (base)</p>
                        <p className="text-2xl font-black">{fmtBRL(result.bestGooglePrice)}</p>
                        <p className="text-xs text-white/60 mt-0.5">{hasBaggage ? '(c/ bagagem)' : '(sem bagagem)'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70 uppercase tracking-wider">Melhor via Milhas</p>
                        <p className="text-2xl font-black text-emerald-300">{fmtBRL(result.bestMilesOption.totalCostBrl)}</p>
                        <p className="text-xs text-white/60 mt-0.5">{result.bestMilesOption.program}</p>
                      </div>
                    </div>
                    {result.bestGooglePrice > result.bestMilesOption.totalCostBrl && (
                      <div className="mt-3 bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-300" />
                        <p className="text-sm font-bold text-emerald-200">
                          Economia de {fmtBRL(result.bestGooglePrice - result.bestMilesOption.totalCostBrl)} usando milhas!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Google Flights */}
                {result.googleFlights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#19727d]" />
                      Google Flights ({result.googleFlights.length} resultados)
                    </h3>
                    <div className="space-y-2">
                      {result.googleFlights.slice(0, 5).map((f, i) => (
                        <FlightCard key={i} flight={f} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Opções de Milhas */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    Comparativo de Milhas
                  </h3>
                  <div className="space-y-2">
                    {result.milesOptions.map((opt, i) => (
                      <MilesCard
                        key={opt.program}
                        option={opt}
                        index={i}
                        googleBest={result.bestGooglePrice}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3 flex items-start gap-1.5 bg-gray-50 dark:bg-slate-800 rounded-xl p-3">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    As milhas usam estimativas para rotas não consultadas manualmente. Para valores precisos, insira as milhas reais encontradas nos programas no painel "Milhas Encontradas".
                  </p>
                </div>

                {/* Rodapé */}
                <p className="text-xs text-gray-400 text-right">
                  Cotação realizada em {new Date(result.searchedAt).toLocaleString('pt-BR')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
