'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Plane, Backpack, Luggage, Clock, CheckCircle2, Copy, Download,
  CheckCircle, Plus, Trash2, ArrowRight, User, Users, Baby,
  MapPin, ChevronDown, ChevronUp, Zap, Check, MessageSquare, Minus
} from 'lucide-react';
import { toBlob } from 'html-to-image';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { NumericFormat } from 'react-number-format';
import { Lead, TeamMember } from '@/types';

import { supabase } from '@/lib/supabase';
import { correctAirportName, extractIataCode } from '@/lib/airport-utils';

const INTEREST_RATES: Record<number, number> = {
  1: 3.46,
  2: 4.75,
  3: 5.65,
  4: 6.52,
  5: 7.29,
  6: 8.76,
  7: 9.28,
  8: 10.31,
  9: 11.39,
  10: 12.55,
  11: 13.55,
  12: 14.75,
};

interface FastCotationViewProps {
  leads: Lead[];
  currentUser: TeamMember | null;
}

interface FlightLeg {
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

export function FastCotationView({ leads, currentUser }: FastCotationViewProps) {
  const proposalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [isCopying, setIsCopying] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Editable states
  const [travelClass, setTravelClass] = useState('Econômica');
  const [consultantName, setConsultantName] = useState('');
  const [leadManualName, setLeadManualName] = useState('');
  const [quotationDate, setQuotationDate] = useState(new Date().toLocaleDateString('pt-BR'));

  const [flights, setFlights] = useState<FlightLeg[]>([
    { date: '17/jun', origin: 'Lisboa (LIS)', departure: '13:00', arrival: '19:20', destination: 'São Paulo (VCP)', airline: 'Azul', class: 'Econômica' },
    { date: '17/jun', origin: 'São Paulo (VCP)', departure: '23:10', arrival: '01:40', destination: 'Petrolina (PNZ)', airline: 'Azul', class: 'Econômica' },
    { date: '', origin: '', departure: '', arrival: '', destination: '', airline: '', class: '' },
    { date: '30/jun', origin: 'Petrolina (PNZ)', departure: '02:25', arrival: '05:05', destination: 'São Paulo (VCP)', airline: 'Azul', class: 'Econômica', isReturn: true },
    { date: '30/jun', origin: 'São Paulo (VCP)', departure: '17:15', arrival: '07:05', destination: 'Lisboa (LIS)', airline: 'Azul', class: 'Econômica' },
  ]);

  const [pricePerPerson, setPricePerPerson] = useState('5.500');
  const [paymentMethod, setPaymentMethod] = useState('à vista no PIX');
  const [feesType, setFeesType] = useState<'with_interest' | 'interest_free'>('with_interest');
  const [price6x, setPrice6x] = useState('997');
  const [price12x, setPrice12x] = useState('526');

  const [baggageState, setBaggageState] = useState({
    mochila: { enabled: true, qty: 1, weight: 5, label: 'Item Pessoal (Cabine)' },
    mao: { enabled: true, qty: 1, weight: 10, label: 'Mala de Mão (Cabine)' },
    despachada: { enabled: false, qty: 0, weight: 23, label: 'Bagagem Despachada (Porão)' }
  });

  const inclusions = useMemo(() => {
    const items = [];
    if (baggageState.mochila.enabled) {
      items.push({ 
        icon: <Backpack className="w-8 h-8 text-cyan-500" />, 
        label: `${baggageState.mochila.qty} ${baggageState.mochila.label} ${baggageState.mochila.weight}kg` 
      });
    }
    if (baggageState.mao.enabled) {
      items.push({ 
        icon: <Luggage className="w-8 h-8 text-cyan-500" />, 
        label: `${baggageState.mao.qty} ${baggageState.mao.label} ${baggageState.mao.weight}kg` 
      });
    }
    if (baggageState.despachada.enabled) {
      items.push({ 
        icon: <Luggage className="w-8 h-8 text-cyan-500" />, 
        label: `${baggageState.despachada.qty} ${baggageState.despachada.label} ${baggageState.despachada.weight}kg` 
      });
    }
    return items;
  }, [baggageState]);

  const updateBaggage = (key: keyof typeof baggageState, field: string, value: any) => {
    setBaggageState(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const mainRoute = useMemo(() => {
    const validFlights = flights.filter(f => f.date && f.origin && f.destination);
    if (validFlights.length === 0) return null;

    const firstOrigin = validFlights[0].origin.split(' (')[0];

    // Procura o índice onde a volta começa
    const returnIndex = validFlights.findIndex(f => f.isReturn);

    let destLeg;
    if (returnIndex > 0) {
      // O destino principal é a chegada do último trecho ANTES da volta
      destLeg = validFlights[returnIndex - 1];
    } else if (returnIndex === 0) {
      // Se o primeiro já é volta (improvável), mostra o último
      destLeg = validFlights[validFlights.length - 1];
    } else {
      // Se não tem marcação de volta, pega a metade ou o último
      destLeg = validFlights[validFlights.length - 1];
    }

    const mainDestination = destLeg.destination.split(' (')[0];

    return { origin: firstOrigin, destination: mainDestination };
  }, [flights]);

  useEffect(() => {
    if (currentUser) {
      setConsultantName(`${currentUser.name} ${currentUser.lastName || ''}`.trim());
    }
  }, [currentUser]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const maxInstallments = (feesType === 'interest_free' && baggageState.despachada.enabled) ? 10 : 12;

  useEffect(() => {
    const cleanVal = parseFloat(pricePerPerson);
    if (!isNaN(cleanVal)) {
      if (feesType === 'with_interest') {
        const val6x = cleanVal * (1 + (INTEREST_RATES[6] || 0) / 100);
        const valMax = cleanVal * (1 + (INTEREST_RATES[maxInstallments] || 0) / 100);
        setPrice6x(val6x.toFixed(2));
        setPrice12x(valMax.toFixed(2));
      } else {
        setPrice6x(cleanVal.toFixed(2));
        setPrice12x(cleanVal.toFixed(2));
      }
    }
  }, [pricePerPerson, feesType, maxInstallments]);

  const handlePasteImage = async (file: File) => {
    setIsExtracting(true);
    setExtractionStatus('loading');
    setNotification({ message: 'Lendo imagem com IA... Aguarde.', type: 'success' });
    
    // Controlador para timeout do fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 segundos de timeout no front

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/extract-flight', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ image: base64 }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Erro no servidor';
        try {
          const json = JSON.parse(text);
          errorMessage = json.error || errorMessage;
        } catch {
          // Se não for JSON, é provavelmente a página de erro do Vercel
          if (response.status === 504) errorMessage = 'Timeout: O Vercel demorou muito para responder. Tente novamente com uma imagem menor.';
          else errorMessage = `Erro ${response.status}: O servidor não respondeu corretamente.`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.flights && data.flights.length > 0) {
        const newFlights = data.flights.map((f: any) => {
          let arrivalTime = f.arrivalTime || '';
          
          const depDate = f.departureDate || f.date;
          const arrDate = f.arrivalDate;
          
          const cleanTime = (t: string) => (t || '').replace(/[^\d:]/g, '');
          const [depH, depM] = cleanTime(f.departureTime || '').split(':').map(Number);
          const [arrH, arrM] = cleanTime(f.arrivalTime || '').split(':').map(Number);
          
          const hasTimes = !isNaN(depH) && !isNaN(arrH);
          const isNextDayByTime = hasTimes && (arrH * 60 + (arrM || 0)) < (depH * 60 + (depM || 0));

          if ((depDate && arrDate && depDate !== arrDate) || isNextDayByTime) {
            if (!arrivalTime.includes('(+1)')) {
              arrivalTime += ' (+1)';
            }
          }

          return {
            ...f,
            arrivalTime,
            class: travelClass
          };
        });
        
        while (newFlights.length < 5) {
          newFlights.push({ date: '', origin: '', departure: '', arrival: '', destination: '', airline: '', class: travelClass });
        }
        
        setFlights(newFlights);
        
        // Lógica de Bagagem Padrão baseada na Cia Aérea
        const allAirlines = data.flights.map((f: any) => (f.airline || '').toUpperCase());
        const isLatamOrGol = allAirlines.some((name: string) => name.includes('LATAM') || name.includes('GOL'));

        setBaggageState({
          mochila: { enabled: true, qty: 1, weight: isLatamOrGol ? 10 : 5, label: 'Item Pessoal (Cabine)' },
          mao: { enabled: true, qty: 1, weight: isLatamOrGol ? 12 : 10, label: 'Mala de Mão (Cabine)' },
          despachada: { enabled: false, qty: 0, weight: 23, label: 'Bagagem Despachada (Porão)' }
        });

        setExtractionStatus('success');
        setNotification({ message: 'Dados e bagagens atualizados!', type: 'success' });
        
        setTimeout(() => setExtractionStatus('idle'), 5000);
      } else {
        throw new Error('Nenhum dado de voo identificado na imagem.');
      }
    } catch (err: any) {
      console.error('Erro na extração:', err);
      setExtractionStatus('idle');
      const message = err.name === 'AbortError' ? 'A requisição demorou muito e foi cancelada.' : err.message;
      setNotification({ message: 'Falha ao extrair dados: ' + message, type: 'error' });
    } finally {
      setIsExtracting(false);
      clearTimeout(timeoutId);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePasteImage(file);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLeadSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leadId = e.target.value;
    setSelectedLeadId(leadId);
    if (!leadId) return;

    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setLeadManualName(lead.name || '');
      if (lead.items && lead.items.length > 0) {
        const flightItem = lead.items.find(item => item.type === 'passagem');
        if (flightItem) {
          const newFlights: FlightLeg[] = [];

          const processSegments = (segs: any[], isReturn: boolean = false) => {
            segs.forEach((seg, sIdx) => {
              newFlights.push({
                date: seg.departureDate ? new Date(seg.departureDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '',
                origin: `${seg.originName || ''} (${seg.origin || ''})`.trim(),
                departure: seg.departureTime || '',
                arrival: seg.arrivalTime || '',
                destination: `${seg.destinationName || ''} (${seg.destination || ''})`.trim(),
                airline: seg.airline || flightItem.airline || '',
                class: seg.flightClass || flightItem.flightClass || 'Econômica',
                isReturn: isReturn && sIdx === 0,
                duration: seg.duration || '',
                departureTime: seg.departureTime || '',
                arrivalTime: seg.arrivalTime || ''
              });
            });
          };

          if (flightItem.outboundSegments) processSegments(flightItem.outboundSegments);
          if (flightItem.inboundSegments) {
            processSegments(flightItem.inboundSegments, true);
          }

          if (newFlights.length > 0) {
            while (newFlights.length < 5) {
              newFlights.push({ date: '', origin: '', departure: '', arrival: '', destination: '', airline: '', class: '' });
            }
            setFlights(newFlights);
          }
        }
      }

      if (lead.value) {
        setPricePerPerson(lead.value.toString());
      }
    }
  };

  const [openItinerary, setOpenItinerary] = useState(false);

  const updateFlight = (index: number, field: string, value: any) => {
    const newFlights = [...flights];
    if (field === 'isReturn') {
      newFlights[index] = { ...newFlights[index], isReturn: value === 'true' };
    } else {
      const updatedLeg = { ...newFlights[index], [field]: value };

      // Auto-correção de nomes de aeroportos baseados no mapeamento de IATA
      if (field === 'origin' || field === 'destination') {
        const code = extractIataCode(value) || value;
        if (code) {
          const corrected = correctAirportName(code, '___NO_MAP___');
          if (corrected !== '___NO_MAP___') {
            if (field === 'origin') updatedLeg.originAirport = corrected;
            else updatedLeg.destinationAirport = corrected;
          }
        }
      }

      newFlights[index] = updatedLeg;
    }
    setFlights(newFlights);
  };

  const addFlight = () => {
    if (flights.length < 10) {
      setFlights([...flights, { date: '', origin: '', departure: '', arrival: '', destination: '', airline: '', class: travelClass }]);
    }
  };

  const removeFlight = (index: number) => {
    if (flights.length > 1) {
      setFlights(flights.filter((_, i) => i !== index));
    }
  };

  const handleCopyImage = async () => {
    if (!proposalRef.current) return;
    setIsCopying(true);
    
    // Garante que a janela tenha foco no início do gesto do usuário
    window.focus();

    try {
      const options = {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        // @ts-ignore
        skipFonts: true,
        fontEmbedCSS: '',
      };

      // Usamos o padrão de passar a Promise diretamente para o ClipboardItem.
      // Isso é mais robusto em navegadores modernos pois mantém a ativação do usuário
      // enquanto a imagem é processada.
      try {
        const blobPromise = toBlob(proposalRef.current, options);
        const data = [new ClipboardItem({ 'image/png': blobPromise as Promise<Blob> })];
        await navigator.clipboard.write(data);
        setNotification({ message: 'Imagem copiada para a área de transferência!', type: 'success' });
      } catch (clipboardErr: any) {
        console.warn('Falha no método de Promise do Clipboard, tentando fallback...', clipboardErr);
        
        // Fallback: Tenta gerar o blob primeiro e depois escrever (método antigo)
        const blob = await toBlob(proposalRef.current, options);
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setNotification({ message: 'Imagem copiada para a área de transferência!', type: 'success' });
          } catch (finalErr: any) {
            // Se ainda assim falhar por foco, oferecemos o download automático
            if (finalErr.name === 'NotAllowedError' || finalErr.message.includes('focus')) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `cotacao.png`;
              a.click();
              setNotification({ message: 'Sem foco no navegador: Download iniciado.', type: 'warning' });
            } else {
              throw finalErr;
            }
          }
        }
      }
    } catch (err) {
      console.error('Erro ao copiar imagem:', err);
      setNotification({ message: 'Erro ao copiar imagem. Tente novamente.', type: 'error' });
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!proposalRef.current) return;
    try {
      const blob = await toBlob(proposalRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        // @ts-ignore
        skipFonts: true,
        fontEmbedCSS: '',
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cotacao-${selectedLeadId || 'fast'}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Erro ao baixar imagem:', err);
    }
  };

  const generatedMessage = useMemo(() => {
    const origin = mainRoute?.origin || 'ORIGEM';
    const destination = mainRoute?.destination || 'DESTINO';
    const nome = leadManualName || '[nome]';

    // Datas de início da ida e volta
    const departureDate = flights.find(f => !f.isReturn && f.date)?.date;
    const returnDate = flights.find(f => f.isReturn && f.date)?.date;
    
    let datas = departureDate || '[DATAS DO VOO]';
    if (returnDate && returnDate !== departureDate) {
      datas += ` à ${returnDate}`;
    }

    // Bagagens e Inclusões
    const bagagensTexto = inclusions
      .map(item => `☑️${item.label}`)
      .join('\n');

    const isIdaEVolta = flights.some(f => f.isReturn);

    return `Olá, ${nome}! Tudo bem? 😊
Conforme conversamos, encontrei uma ótima opção de voo para sua viagem:

*Proposta de viagem*
*${origin}✈️ ${destination}*
\`${datas}\`

${isIdaEVolta ? '☑️Passagem ida e volta\n' : ''}${bagagensTexto}
☑️Suporte Jurídico contra imprevisto
☑️Acompanhamento durante toda viagem

*R$${parseFloat(pricePerPerson || '0').toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} à vista por pessoa*
\`R$${parseFloat(price6x || '0').toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} em 6x sem juros no cartão\`
\`R$${parseFloat(price12x || '0').toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} em ${maxInstallments}x sem juros no cartão\`

*Te enviei todos os detalhes na imagem acima 👆*

⚠️ Os valores estão sujeitos a alteração a qualquer momento, de acordo com a disponibilidade da companhia aérea.

Aqui na Easy Fly, acompanhamos você durante toda a sua viagem para garantir que tudo ocorra bem e com tranquilidade ✈️`;
  }, [mainRoute, leadManualName, flights, pricePerPerson, price6x, price12x, paymentMethod, inclusions]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedMessage);
    setNotification({ message: 'Texto copiado para a área de transferência!', type: 'success' });
  };

  const groupedFlights = useMemo(() => {
    const groups: { date: string, isReturnGroup: boolean, legs: FlightLeg[] }[] = [];
    let currentIsReturnGroup = false;

    flights.filter(f => f.date || f.origin).forEach((f) => {
      if (f.isReturn) {
        currentIsReturnGroup = true;
      }

      const lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.date !== f.date || lastGroup.isReturnGroup !== currentIsReturnGroup) {
        groups.push({ date: f.date, isReturnGroup: currentIsReturnGroup, legs: [f] });
      } else {
        lastGroup.legs.push(f);
      }
    });
    return groups;
  }, [flights]);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-50 dark:bg-slate-950 overflow-hidden">
      <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col overflow-y-auto p-6 space-y-6 shrink-0">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Configurações</h2>

          <div className="space-y-4">
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <button
              onClick={() => {
                if (extractionStatus === 'idle') {
                  fileInputRef.current?.click();
                } else {
                  setExtractionStatus('idle');
                }
              }}
              disabled={isExtracting}
              className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                extractionStatus === 'loading'
                ? 'bg-cyan-50 border-cyan-300 text-cyan-600' 
                : extractionStatus === 'success'
                ? 'bg-green-50 border-green-400 text-green-600 scale-[1.02]'
                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-500 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              {extractionStatus === 'loading' ? (
                <>
                  <div className="relative">
                    <Clock className="w-8 h-8 animate-spin text-cyan-500" />
                    <Zap className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-600 fill-cyan-600 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1cb0c6]">EASY IA EXTRAINDO DADOS...</span>
                </>
              ) : extractionStatus === 'success' ? (
                <>
                  <div className="bg-green-500 rounded-full p-1.5 animate-bounce shadow-lg shadow-green-200">
                    <Check className="w-5 h-5 text-white stroke-[4]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Extração Concluída!</span>
                </>
              ) : (
                <>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Faça Upload da imagem</span>
                </>
              )}
            </button>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Classe da Viagem</label>
              <select
                value={travelClass}
                onChange={(e) => {
                  const newClass = e.target.value;
                  setTravelClass(newClass);
                  setFlights(flights.map(f => ({ ...f, class: newClass })));
                }}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="Econômica">Econômica</option>
                <option value="Executiva">Executiva</option>
                <option value="1º Classe">1º Classe</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Consultor</label>
                <input
                  type="text"
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nome lead</label>
                <input
                  type="text"
                  value={leadManualName}
                  onChange={(e) => setLeadManualName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Data</label>
                <input
                  type="text"
                  value={quotationDate}
                  readOnly
                  className="w-full bg-gray-100 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none cursor-not-allowed opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Itinerário Sidebar */}
        <div>
          <button
            onClick={() => setOpenItinerary(!openItinerary)}
            className="w-full flex items-center justify-between group"
          >
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-cyan-500 transition-colors">Itinerário</h3>
            {openItinerary ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {openItinerary && (
            <div className="mt-4 space-y-4">
              {flights.map((flight, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-3 relative group">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Data (ex: 17/jun)</label>
                      <input
                        type="text"
                        value={flight.date}
                        onChange={(e) => updateFlight(idx, 'date', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Origem</label>
                      <input
                        type="text"
                        value={flight.origin}
                        onChange={(e) => updateFlight(idx, 'origin', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Destino</label>
                      <input
                        type="text"
                        value={flight.destination}
                        onChange={(e) => updateFlight(idx, 'destination', e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Duração do Voo</label>
                      <input
                        type="text"
                        value={flight.duration || ''}
                        onChange={(e) => updateFlight(idx, 'duration', e.target.value)}
                        placeholder="Ex: 10H15"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Saída (Partida)</label>
                      <input
                        type="text"
                        value={flight.departureTime || ''}
                        onChange={(e) => updateFlight(idx, 'departureTime', e.target.value)}
                        placeholder="Ex: 09:30"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Chegada</label>
                      <input
                        type="text"
                        value={flight.arrivalTime || ''}
                        onChange={(e) => updateFlight(idx, 'arrivalTime', e.target.value)}
                        placeholder="Ex: 01:20 (+1)"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      />
                    </div>
                    {idx > 0 && (
                      <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-slate-700/50 mt-1">
                        <input
                          type="checkbox"
                          checked={!!flight.isReturn}
                          onChange={(e) => updateFlight(idx, 'isReturn', e.target.checked)}
                          id={`return-${idx}`}
                          className="w-3 h-3 text-cyan-500 rounded border-gray-300 focus:ring-cyan-500"
                        />
                        <label htmlFor={`return-${idx}`} className="text-[9px] font-bold text-gray-500 uppercase cursor-pointer">Início da volta</label>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFlight(idx)}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={addFlight}
                className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-gray-400 hover:text-cyan-500 hover:border-cyan-500 transition-all flex items-center justify-center gap-2 text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                Adicionar Trecho
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block">Valor à vista</label>
              <NumericFormat
                value={pricePerPerson}
                onValueChange={(values) => setPricePerPerson(values.value)}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={0}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="R$ 0"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block">Parcelamento</label>
              <select
                value={feesType}
                onChange={(e) => setFeesType(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="with_interest">Com juros</option>
                <option value="interest_free">Sem juros</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bagagens Sidebar */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Bagagem</h3>
          <div className="space-y-2">
            {(Object.entries(baggageState) as [keyof typeof baggageState, any][]).map(([key, data]) => (
              <div key={key} className={`p-2 rounded-xl border transition-all duration-300 ${
                data.enabled 
                  ? 'bg-white dark:bg-slate-800/50 border-cyan-100 dark:border-cyan-900/30' 
                  : 'bg-gray-50/50 dark:bg-slate-900/10 border-gray-100 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-1 rounded-lg ${data.enabled ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                      {key === 'mochila' ? <Backpack className="w-3 h-3" /> : <Luggage className="w-3 h-3" />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${data.enabled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
                      {data.label}
                    </span>
                  </div>
                  <button
                    onClick={() => updateBaggage(key, 'enabled', !data.enabled)}
                    className={`w-7 h-4 rounded-full relative transition-all duration-300 ${data.enabled ? 'bg-cyan-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${data.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
                
                {data.enabled && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50 dark:border-slate-700/50 animate-in fade-in duration-300">
                    {/* Qtd compact */}
                    <div className="flex items-center bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg overflow-hidden flex-1">
                      <button 
                        onClick={() => updateBaggage(key, 'qty', Math.max(0, data.qty - 1))} 
                        className="p-1 hover:text-cyan-500 transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="flex-1 text-center text-[9px] font-black text-gray-700 dark:text-gray-200">{data.qty}x</span>
                      <button 
                        onClick={() => updateBaggage(key, 'qty', data.qty + 1)} 
                        className="p-1 hover:text-cyan-500 transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Peso compact */}
                    <div className="flex items-center bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-lg overflow-hidden flex-[1.5]">
                      <button 
                        onClick={() => updateBaggage(key, 'weight', Math.max(0, data.weight - 1))} 
                        className="p-1 hover:text-cyan-500 transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="flex-1 text-center text-[9px] font-black text-gray-700 dark:text-gray-200">{data.weight}kg</span>
                      <button 
                        onClick={() => updateBaggage(key, 'weight', data.weight + 1)} 
                        className="p-1 hover:text-cyan-500 transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <button
            onClick={handleCopyImage}
            disabled={isCopying}
            className="w-full bg-[#19727d] hover:bg-[#15616a] disabled:bg-[#19727d]/50 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isCopying ? <Clock className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            {isCopying ? 'Capturando...' : 'Copiar Imagem'}
          </button>
          <button
            onClick={handleCopyText}
            className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-slate-600"
          >
            <MessageSquare className="w-4 h-4" />
            Copiar Texto
          </button>

          {/* Preview do Texto */}
          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Preview da mensagem
            </p>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
              {generatedMessage}
            </div>
          </div>
        </div>
      </div>

      {/* Área de Visualização */}
      <div className="flex-1 p-8 overflow-y-auto flex items-start justify-center">
        <div className="relative">
          {/* Notificação */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`fixed top-8 right-8 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'
                  }`}
              >
                {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                <span className="text-xs font-bold uppercase tracking-widest">{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* O DESIGN DA COTAÇÃO (Ref para html-to-image) */}
          <div
            ref={proposalRef}
            className="w-[850px] relative bg-cover bg-center bg-no-repeat text-black p-0 shadow-2xl origin-top overflow-hidden"
            style={{
              minHeight: '900px',
              backgroundImage: 'url(/fundofastcotation.png)'
            }}
          >
            {/* Header Area */}
            <div className="p-10 pb-6 grid grid-cols-3 gap-4 items-center w-full relative">
              {/* Logo Esquerda */}
              <div className="flex justify-start items-center">
                <div className="w-40 h-40 relative">
                  <Image src="/logo2.png" alt="Easy Fly" layout="fill" objectFit="contain" priority unoptimized={true} />
                </div>
              </div>

              {/* Título Central - ABSOLUTE CENTERED */}
              <div className="absolute left-1/2 top-14 -translate-x-1/2 flex flex-col items-center justify-center w-full max-w-[400px] z-10 pointer-events-none">
                <h1 className="text-[34px] font-[900] text-center tracking-tight text-[#0a192f] uppercase m-0 p-0">
                  PROPOSTA DE VIAGEM
                </h1>
                <div className="flex flex-col items-center justify-center w-full mt-1.5 gap-8">
                  <div className="flex items-center justify-center w-full gap-3 opacity-90">
                    <div className="h-[2px] w-12 sm:w-16 bg-gradient-to-l from-cyan-500 to-transparent"></div>
                    <span className="text-2xl font-black text-[#1cb0c6] uppercase tracking-wide leading-none">{travelClass}</span>
                    <div className="h-[2px] w-12 sm:w-16 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  </div>
                  {mainRoute && (
                    <div className="flex items-center gap-1 animate-in fade-in slide-in-from-bottom-1 duration-500">
                      <span className="text-xl font-black text-gray-400 uppercase tracking-[0.2em]">
                        {mainRoute.origin}
                      </span>
                      <div className="relative w-14 h-6 opacity-80">
                        <Image src="/aviaoparacinza.png" alt="Para" layout="fill" objectFit="contain" unoptimized />
                      </div>
                      <span className="text-xl font-black text-gray-400 uppercase tracking-[0.2em]">
                        {mainRoute.destination}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Espaçador para manter o grid de 3 colunas funcionando para as laterais */}
              <div></div>

              {/* Info Direita */}
              <div className="flex flex-col items-end justify-center gap-1">
                <div className="relative w-36 h-12">
                  <Image src="/cadastur.png" alt="Cadastur" layout="fill" objectFit="contain" priority unoptimized />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-4">CNPJ: 45.480.207-0001-49</p>
                <div className="text-right space-y-0.5 mt-2">
                  <p className="text-sm font-bold text-gray-700 whitespace-nowrap">Data da cotação: <span className="font-black text-black ml-1">{quotationDate}</span></p>
                  <p className="text-sm font-bold text-gray-700 whitespace-nowrap">Consultor: <span className="font-black text-black ml-1">{consultantName}</span></p>
                </div>
              </div>
            </div>



            {/* Exact Replica Visual Itinerary */}
            <div className="px-8 mb-6 space-y-6">
              {/* Group Rendering */}
              {groupedFlights.map((group, gIdx, grpArr) => {
                const isFirstIda = gIdx === 0 && !group.isReturnGroup;
                const isFirstVolta = group.isReturnGroup && (gIdx === 0 || !grpArr[gIdx - 1].isReturnGroup);

                return (
                  <React.Fragment key={gIdx}>

                    {/* Banners for IDA / VOLTA */}
                    {isFirstIda && (
                      <div className="flex items-center w-full mb-8 relative drop-shadow-sm">
                        <div className="h-10 bg-[#1c558c] flex items-center pr-12 pl-12 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0 100%)', marginLeft: '-2rem' }}>
                          {/* Text and Icon (Front) */}
                          <span className="text-white font-black italic uppercase text-lg tracking-wider mr-3 relative z-10 drop-shadow-md">
                            VOO DE IDA
                          </span>
                          <div className="relative w-6 h-6 z-10 drop-shadow-md shrink-0">
                            <Image src="/aviaocimabranco.png" alt="Avião Ida" layout="fill" objectFit="contain" unoptimized />
                          </div>
                        </div>
                        {/* Trailing Lines */}
                        <div className="flex-1 flex flex-col justify-center space-y-[2px] ml-[-20px] z-[0]">
                          <div className="h-[1.5px] bg-gradient-to-r from-[#1c558c] to-transparent w-full opacity-80" />
                          <div className="h-[2px] bg-gradient-to-r from-[#1c558c] to-transparent w-full opacity-50" />
                          <div className="h-[1.5px] bg-gradient-to-r from-[#1c558c] to-transparent w-full opacity-30" />
                        </div>
                      </div>
                    )}

                    {isFirstVolta && (
                      <div className="flex items-center w-full mb-2 mt-4 relative drop-shadow-sm">
                        {/* Trailing Lines */}
                        <div className="flex-1 flex flex-col justify-center space-y-[2px] mr-[-20px] z-[0] transform rotate-180">
                          <div className="h-[1.5px] bg-gradient-to-r from-[#317336] to-transparent w-full opacity-80" />
                          <div className="h-[2px] bg-gradient-to-r from-[#317336] to-transparent w-full opacity-50" />
                          <div className="h-[1.5px] bg-gradient-to-r from-[#317336] to-transparent w-full opacity-30" />
                        </div>
                        <div className="h-10 bg-[#317336] flex items-center pr-8 pl-12 relative overflow-hidden" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)', marginRight: '-2rem' }}>
                          {/* Text and Icon (Front) */}
                          <span className="text-white font-black italic uppercase text-lg tracking-wider mr-3 ml-2 relative z-10 drop-shadow-md">
                            VOO DE VOLTA
                          </span>
                          <div className="relative w-6 h-6 z-10 drop-shadow-md shrink-0">
                            <Image src="/aviaobaixobranco.png" alt="Avião Volta" layout="fill" objectFit="contain" unoptimized />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FOLDER CARD */}
                    <div className="relative mt-10 mb-4">
                      {/* Slanted Tab */}
                      <div
                        className={`absolute -top-6 left-0 h-7 flex items-center px-4 pt-1 rounded-t-lg text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest z-10 ${group.isReturnGroup ? 'bg-[#3e8c46]' : 'bg-[#1c558c]'}`}
                        style={{ clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0 100%)', paddingRight: '24px' }}
                      >
                        DATA: {group.date}
                      </div>

                      {/* Card Body */}
                      <div className="relative z-20 bg-white/80 backdrop-blur-sm rounded-2xl rounded-tl-none shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-white/50 px-6 py-2 w-full">
                        {group.legs.map((leg, lIdx) => (
                          <div key={lIdx} className="grid grid-cols-3 gap-0 py-3 border-b border-gray-200 last:border-0 relative min-h-[90px] items-center">
                            {/* ORIGEM */}
                            <div className="flex flex-col justify-center h-full pl-2">
                              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest leading-none">ORIGEM</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg sm:text-xl font-black text-[#1a2b3c] uppercase tracking-tight leading-none">
                                  {leg.origin?.split('(')[0] || '---'}
                                </span>
                                {leg.origin?.includes('(') && (
                                  <span className="text-[11px] sm:text-[13px] font-bold text-gray-400 uppercase leading-none">
                                    ({leg.origin.split('(')[1]}
                                  </span>
                                )}
                              </div>
                              {leg.originAirport && (
                                <span className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase leading-tight truncate max-w-full italic mt-1">
                                  {leg.originAirport}
                                </span>
                              )}
                              {leg.departureTime && (
                                <div className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase mt-0.5">
                                  Partida: <span className="text-[#1a2b3c] font-black">{leg.departureTime}</span>
                                </div>
                              )}
                            </div>

                             {/* MIDDLE / DURATION */}
                             <div className="flex flex-col items-center justify-center relative gap-1 px-4">
                               <div className="w-full flex items-center justify-center relative">
                                 <div className="h-[1.5px] border-t-[1.5px] border-dashed border-gray-300 flex-1" />
                                 <div className="mx-2 shrink-0">
                                   <div className="relative w-5 h-5">
                                     <Image
                                       src={group.isReturnGroup ? "/aviaobaixoverde.png" : "/aviaocimaazul.png"}
                                       alt="Avião"
                                       layout="fill"
                                       objectFit="contain"
                                       unoptimized={true}
                                     />
                                   </div>
                                 </div>
                                 <div className="h-[1.5px] border-t-[1.5px] border-dashed border-gray-300 flex-1" />
                               </div>
                               {leg.duration && (
                                 <div className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase text-center leading-none">
                                   <span className="text-[#1a2b3c] font-black">{leg.duration}</span>
                                 </div>
                               )}
                               {leg.airline && (
                                 <div className="text-[9px] sm:text-[10px] font-[800] text-cyan-600 uppercase tracking-tighter text-center leading-none">
                                   {leg.airline}
                                 </div>
                               )}
                             </div>

                            {/* DESTINO */}
                            <div className="flex flex-col items-end justify-center h-full pr-2">
                              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest leading-none">DESTINO</span>
                                <MapPin className="w-3 h-3 shrink-0" />
                              </div>
                              <div className="flex items-baseline gap-1 justify-end">
                                {leg.destination?.includes('(') && (
                                  <span className="text-[11px] sm:text-[13px] font-bold text-gray-400 uppercase leading-none">
                                    ({leg.destination.split('(')[1]}
                                  </span>
                                )}
                                <span className="text-lg sm:text-xl font-black text-[#1a2b3c] uppercase tracking-tight leading-none text-right">
                                  {leg.destination?.split('(')[0] || '---'}
                                </span>
                              </div>
                              {leg.destinationAirport && (
                                <span className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase leading-tight truncate max-w-full italic text-right mt-1">
                                  {leg.destinationAirport}
                                </span>
                              )}
                              {leg.arrivalTime && (
                                <div className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase text-right mt-0.5">
                                  Chegada: <span className="text-[#1a2b3c] font-black">{leg.arrivalTime}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Pricing & Inclusions Section */}
            <div className="flex h-48 mb-8 border-t-2 border-b-2 border-gray-100">
              {/* Pricing Box */}
              <div className="w-1/2 flex flex-col">
                <div className="bg-cyan-500 py-3 px-8">
                  <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter">Preço por pessoa:</h2>
                </div>
                <div className="flex-1 bg-white flex items-center px-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[#1a2b3c] text-4xl font-black whitespace-nowrap">
                      R$ {parseFloat(pricePerPerson || '0').toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-lg font-black text-[#1a2b3c] uppercase tracking-tight pt-1">
                      {paymentMethod}
                    </span>
                  </div>
                </div>
                <div className="bg-[#111827] flex flex-col justify-center py-4 px-8 space-y-2">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-3xl font-black italic">R$ {parseFloat(price6x || '0').toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    <span className="text-xl font-bold uppercase tracking-tight">
                      EM 6X SEM JUROS
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white">
                    <span className="text-3xl font-black italic">R$ {parseFloat(price12x || '0').toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    <span className="text-xl font-bold uppercase tracking-tight">
                      {`EM ${maxInstallments}X SEM JUROS`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inclusions Box */}
              <div className="w-1/2 bg-gray-50 p-6 flex flex-col justify-center border-l-2 border-gray-100">
                <h3 className="text-2xl font-black uppercase italic mb-4">BAGAGEM:</h3>
                <div className="space-y-3">
                  {inclusions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="text-lg font-black uppercase tracking-tight">{item.label}</span>
                    </div>
                  ))}
                </div>
                {inclusions.length > 0 && (
                  <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase italic leading-tight">
                    * Itens de cabine acompanham você no avião. Itens de porão são entregues no balcão da companhia.
                  </p>
                )}
              </div>
            </div>

            {/* Banner Cheap Find */}
            <div className="mx-8 bg-cyan-500 py-4 px-6 rounded-sm mb-8 text-center shadow-lg shadow-cyan-500/10">
              <p className="text-white text-lg font-black uppercase italic tracking-tighter">
                Encontrou mais barato? Fale conosco e garanta a melhor opção!
              </p>
            </div>

            {/* Footer Columns */}
            <div className="px-8 grid grid-cols-2 gap-12 mb-12">
              <div>
                <div className="bg-cyan-100/50 border-l-8 border-cyan-500 py-2 px-4 mb-4">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">NOSSAS FORMAS DE<br /><span className="text-3xl italic">PAGAMENTO</span></h4>
                </div>
                <ul className="space-y-2 text-sm font-bold">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    À vista PIX ou Moedas internacional
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Cartão de crédito em até 12x
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Cartão de crédito internacional em 1x
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Boleto Financiado utilizando o CPF
                  </li>
                </ul>
              </div>

              <div>
                <div className="bg-cyan-100/50 border-l-8 border-cyan-500 py-2 px-4 mb-4">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">DIFERENCIAL DA<br /><span className="text-3xl italic">EASY FLY</span></h4>
                </div>
                <ul className="space-y-2 text-sm font-bold pr-4">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                    Equipe especializada e experiente
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                    Assistência 24 horas durante sua viagem
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                    Agência certificada pelo Ministério do Turismo
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                    Assistência jurídica gratuita em casos de atrasos, cancelamentos, bagagem atrasada ou extraviada.
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="bg-[#111827] py-4 px-8 text-center">
              <p className="text-white text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                Os valores apresentados podem sofrer alterações a qualquer momento. De acordo com as regras das companhias aéreas. A reserva só é garantida após confirmação de pagamento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
