'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Upload, 
  Search,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  MoreVertical,
  Filter,
  CheckCircle2,
  AlertCircle,
  Flag,
  Plane,
  Hotel,
  Briefcase,
  Bell,
  Trash2,
  X,
  HelpCircle,
  Settings,
  ChevronDown,
  Grid,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  subDays,
  eachDayOfInterval,
  isToday,
  parseISO,
  setHours,
  setMinutes
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { Sale, CalendarEvent, CalendarEventType, TeamMember } from '@/types';
import { calendarService } from '@/services/supabaseService';

interface CalendarViewProps {
  sales: Sale[];
  manualEvents: CalendarEvent[];
  onRefresh: () => void;
  currentUser?: TeamMember | null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ sales, manualEvents, onRefresh, currentUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(100);
  const [activeFilters, setActiveFilters] = useState<CalendarEventType[]>([
    'Check-in', 'Embarque', 'Hospedagem', 'Follow-up', 'Tarefa', 'Aniversariante', 'Lembrete'
  ]);

  // --- GERAÇÃO DE EVENTOS AUTOMÁTICOS ---
  const autoEvents = useMemo(() => {
    const events: any[] = [];
    sales.forEach(sale => {
      sale.items?.forEach((item, idx) => {
        const passengerLabel = item.passengerName ? ` - ${item.passengerName}` : '';
        if (item.type === 'passagem' && item.departureDate) {
          const depDate = parseISO(item.departureDate);
          events.push({
            id: `sale-dep-${sale.id}-${idx}`,
            title: `Embarque: ${item.origin} ✈️ ${item.destination}${passengerLabel}`,
            type: 'Embarque',
            startDate: item.departureDate,
            userName: sale.emissor || 'Sistema',
            isAuto: true,
            originalData: sale
          });
          const checkInDate = subDays(depDate, 1);
          events.push({
            id: `sale-checkin-${sale.id}-${idx}`,
            title: `Realizar Check-in: ${item.origin} ➔ ${item.destination}${passengerLabel}`,
            type: 'Check-in',
            startDate: format(checkInDate, "yyyy-MM-dd'T'HH:mm:ss"),
            userName: sale.emissor || 'Sistema',
            isAuto: true,
            originalData: sale
          });
        }
        if (item.type === 'hospedagem' && item.checkIn) {
          events.push({
            id: `sale-hotel-${sale.id}-${idx}`,
            title: `Check-in Hotel: ${item.hotelName || 'Hospedagem'}${passengerLabel}`,
            type: 'Hospedagem',
            startDate: item.checkIn,
            userName: sale.emissor || 'Sistema',
            isAuto: true,
            originalData: sale
          });
        }
      });
    });
    return events;
  }, [sales]);

  const allEvents = useMemo(() => {
    return [...autoEvents, ...manualEvents].filter(event => 
      activeFilters.includes(event.type as CalendarEventType) &&
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       event.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [autoEvents, manualEvents, activeFilters, searchQuery]);

  // --- NAVEGAÇÃO ---
  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
    else if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === 'year') setCurrentDate(addMonths(currentDate, 12));
  };
  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addDays(currentDate, -7));
    else if (viewMode === 'day') setCurrentDate(addDays(currentDate, -1));
    else if (viewMode === 'year') setCurrentDate(addMonths(currentDate, -12));
  };
  const goToToday = () => setCurrentDate(new Date());

  // --- HELPERS DE ESTILO ---
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Check-in': return 'bg-orange-500';
      case 'Embarque': return 'bg-sky-500';
      case 'Hospedagem': return 'bg-green-500';
      case 'Follow-up': return 'bg-purple-600';
      case 'Tarefa': return 'bg-blue-600';
      case 'Aniversariante': return 'bg-pink-600';
      case 'Lembrete': return 'bg-orange-400';
      default: return 'bg-gray-300';
    }
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'Check-in': return 'bg-orange-50 text-orange-700 border-orange-400';
      case 'Embarque': return 'bg-blue-50 text-blue-700 border-blue-400';
      case 'Hospedagem': return 'bg-purple-50 text-purple-700 border-purple-400';
      case 'Aniversariante': return 'bg-pink-50 text-pink-700 border-pink-400';
      case 'Tarefa': return 'bg-gray-100 text-gray-700 border-gray-400';
      case 'Follow-up': return 'bg-teal-50 text-teal-700 border-teal-400';
      case 'Lembrete': return 'bg-yellow-50 text-yellow-700 border-yellow-400';
      default: return 'bg-gray-50 text-gray-600 border-gray-300';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Check-in': return <CheckCircle2 size={16} className="text-orange-500" />;
      case 'Embarque': return <Plane size={16} className="text-blue-500" />;
      case 'Hospedagem': return <Hotel size={16} className="text-purple-500" />;
      case 'Aniversariante': return <User size={16} className="text-pink-500" />;
      case 'Tarefa': return <Clock size={16} className="text-gray-500" />;
      case 'Follow-up': return <Flag size={16} className="text-teal-500" />;
      case 'Lembrete': return <Bell size={16} className="text-yellow-500" />;
      default: return <CalendarIcon size={16} />;
    }
  };

  // --- RENDERERS ---
  const renderHeader = () => {
    let dateTitle = "";
    if (viewMode === 'month') dateTitle = format(currentDate, "MMMM 'De' yyyy", { locale: ptBR });
    else if (viewMode === 'year') dateTitle = format(currentDate, 'yyyy');
    else if (viewMode === 'day') dateTitle = format(currentDate, "d 'De' MMMM 'De' yyyy", { locale: ptBR });
    else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (isSameMonth(start, end)) dateTitle = `${format(start, 'MMMM', { locale: ptBR })} De ${format(start, 'yyyy')}`;
      else dateTitle = `${format(start, 'MMM', { locale: ptBR })}. – ${format(end, 'MMM', { locale: ptBR })}. ${format(end, 'yyyy')}`;
    }

    dateTitle = dateTitle.split(' ').map(word => {
        if (word === 'De' || word === 'de') return 'De';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    return (
      <div className="flex items-center justify-between mb-2 px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800 -mx-4 -mt-4">
        <div className="flex items-center gap-4">
          <button onClick={goToToday} className="px-5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95">Hoje</button>
          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
            <button onClick={handlePrev} className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><ChevronLeft size={24} strokeWidth={2} /></button>
            <button onClick={handleNext} className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><ChevronRight size={24} strokeWidth={2} /></button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white ml-4">{dateTitle}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100/50 dark:bg-slate-800 p-1 rounded-2xl border border-gray-100 dark:border-slate-700">
            {(['day', 'week', 'month', 'year'] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white shadow-sm ring-1 ring-black/5' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>{mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : mode === 'month' ? 'Mês' : 'Ano'}</button>
            ))}
          </div>
          <div className="flex items-center gap-1 pl-4 border-l border-gray-100 dark:border-slate-700 ml-2 mr-2">
            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><Search size={22} /></button>
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-slate-700 ml-2">
              <button 
                onClick={() => setZoom(Math.max(zoom - 10, 80))} 
                title="Diminuir zoom"
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all active:scale-95 shadow-sm"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 w-12 text-center select-none">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(zoom + 10, 150))} 
                title="Aumentar zoom"
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all active:scale-95 shadow-sm"
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <button onClick={() => setIsEventModalOpen(true)} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-5 py-2 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 group">
              <Plus size={18} className="text-gray-400 group-hover:text-[#1a5b65]" />
              Criar
              <ChevronDown size={14} className="text-gray-400 ml-1" />
            </button>
            <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-5 py-2 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95">
              <Upload size={18} className="text-gray-400" />
              Importar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="grid grid-cols-7 border-b border-gray-50 dark:border-slate-800">
          {weekDays.map((day, idx) => <div key={`${day}-${idx}`} className="py-4 text-center text-[11px] font-black text-gray-400 dark:text-gray-500 tracking-widest uppercase">{day}</div>)}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr">
          {days.map((day, i) => {
            const dayEvents = allEvents.filter(event => isSameDay(parseISO(event.startDate), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDay = isToday(day);
            return (
              <div key={day.toISOString()} className={`min-h-[120px] p-2 border-r border-b border-gray-50 dark:border-slate-800 transition-all group ${!isCurrentMonth ? 'bg-gray-50/10 dark:bg-slate-800/10 text-gray-200 dark:text-gray-800' : isTodayDay ? 'bg-[#7c3aed]/5 dark:bg-[#7c3aed]/10' : 'text-gray-700 dark:text-gray-300'}`}>
                <div className="flex justify-end items-start mb-1">
                  <span className={`text-xs font-bold w-10 h-10 flex items-center justify-center rounded-full transition-all ${isTodayDay ? 'bg-[#3b32c3] text-white shadow-lg' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>{format(day, 'd')}</span>
                </div>
                <div className="space-y-1.5 max-h-[85px] overflow-y-auto custom-scrollbar-mini">
                  {dayEvents.slice(0, 4).map(event => (
                    <div key={event.id} onClick={() => setSelectedEvent(event)} className={`text-[10px] px-2 py-1 rounded-md border-l-2 truncate cursor-pointer hover:brightness-95 dark:hover:brightness-110 transition-all shadow-sm ${getEventStyle(event.type)}`}>{event.title}</div>
                  ))}
                  {dayEvents.length > 4 && <div className="text-[9px] text-[#1a5b65] dark:text-cyan-400 font-semibold pl-2 cursor-pointer hover:underline">+ {dayEvents.length - 4} mais</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    const dayEvents = allEvents.filter(event => isSameDay(parseISO(event.startDate), currentDate));
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 relative group">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 pl-[85px]">
          <div className="flex flex-col items-center w-fit">
            <span className="text-[10px] font-black text-[#1a5b65] dark:text-cyan-400 uppercase tracking-widest mb-1">{format(currentDate, 'EEE.', { locale: ptBR })}</span>
            <div className="w-12 h-12 rounded-full bg-[#1a5b65] text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-teal-900/20">{format(currentDate, 'd')}</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-white dark:bg-slate-900" id="day-timeline-scroll">
          <div className="relative min-h-[1440px]">
            <div className="absolute left-4 top-2 text-[10px] font-bold text-gray-400 dark:text-gray-600">GMT-03</div>
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b border-gray-50 dark:border-slate-800 flex group/row">
                <div className="w-[85px] pr-4 flex justify-end items-center -mt-7 shrink-0">
                  <span className="text-[10px] font-bold text-gray-300 dark:text-gray-700 group-hover/row:text-gray-500 dark:group-hover/row:text-gray-500 transition-colors uppercase whitespace-nowrap">{hour !== 0 ? (hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`) : ''}</span>
                </div>
                <div className="flex-1 group-hover/row:bg-gray-50/30 dark:group-hover/row:bg-slate-800/20 transition-colors" />
              </div>
            ))}
            {isToday(currentDate) && (
              <div className="absolute left-[85px] right-0 flex items-center z-10 pointer-events-none" style={{ top: `${(new Date().getHours() * 60) + new Date().getMinutes()}px` }}>
                <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5 shadow-sm" />
                <div className="h-[2px] flex-1 bg-red-500/50" />
              </div>
            )}
            <div className="absolute top-0 left-[85px] right-4 bottom-0 pointer-events-none">
              {dayEvents.map(event => {
                const date = parseISO(event.startDate);
                const top = (date.getHours() * 60) + date.getMinutes();
                return (
                  <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onClick={() => setSelectedEvent(event)} className={`absolute left-0 right-0 p-3 rounded-xl border-l-[6px] shadow-lg cursor-pointer pointer-events-auto transition-all hover:scale-[1.01] hover:z-20 ${getEventStyle(event.type)}`} style={{ top: `${top}px`, height: 'auto', minHeight: '50px', maxWidth: '95%' }}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black truncate">{event.title}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold opacity-70"><Clock size={10} /><span>{format(date, 'HH:mm')}h</span></div>
                      </div>
                      <div className="shrink-0 p-1 bg-white/40 rounded-lg">{getIconForType(event.type)}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start, end: endOfWeek(currentDate, { weekStartsOn: 0 }) });
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 relative group">
        <div className="grid grid-cols-[85px_repeat(7,1fr)] border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="border-r border-gray-50 dark:border-slate-800 flex items-end justify-center pb-2"><span className="text-[10px] font-bold text-gray-400 dark:text-gray-600">GMT-03</span></div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="py-4 border-r border-gray-50 dark:border-slate-800 flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isToday(day) ? 'text-[#1a5b65] dark:text-cyan-400' : 'text-gray-400 dark:text-gray-600'}`}>{format(day, 'EEE.', { locale: ptBR })}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${isToday(day) ? 'bg-[#1a5b65] text-white shadow-lg shadow-teal-900/20 scale-110' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>{format(day, 'd')}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar relative" id="week-timeline-scroll">
           <div className="relative min-h-[1440px] grid grid-cols-[85px_repeat(7,1fr)]">
             <div className="bg-white dark:bg-slate-900 border-r border-gray-50 dark:border-slate-800">
               {hours.map(hour => (
                 <div key={hour} className="h-[60px] border-b border-gray-50 dark:border-slate-800 flex justify-end items-center pr-4 -mt-7">
                    <span className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase whitespace-nowrap">{hour !== 0 ? (hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`) : ''}</span>
                 </div>
               ))}
             </div>
             {weekDays.map(day => {
               const dayEvents = allEvents.filter(event => isSameDay(parseISO(event.startDate), day));
               return (
                 <div key={day.toISOString()} className="relative border-r border-gray-50 dark:border-slate-800 group/col hover:bg-gray-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    {hours.map(h => <div key={h} className="h-[60px] border-b border-gray-50 dark:border-slate-800" />)}
                    <div className="absolute inset-0 pointer-events-none py-1">
                      {dayEvents.map(event => {
                        const date = parseISO(event.startDate);
                        const top = (date.getHours() * 60) + date.getMinutes();
                        return (
                          <motion.div key={event.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }} className={`absolute left-1 right-1 p-1 rounded-lg border-l-4 shadow-sm cursor-pointer pointer-events-auto transition-all hover:scale-[1.02] hover:z-20 overflow-hidden ${getEventStyle(event.type)}`} style={{ top: `${top}px`, minHeight: '30px' }}>
                            <p className="text-[9px] font-black truncate leading-tight">{event.title}</p>
                            <p className="text-[8px] opacity-70 font-bold">{format(date, 'HH:mm')}h</p>
                          </motion.div>
                        );
                      })}
                    </div>
                    {isToday(day) && (
                      <div className="absolute left-0 right-0 h-[2px] bg-red-500/50 z-10 pointer-events-none" style={{ top: `${(new Date().getHours() * 60) + new Date().getMinutes()}px` }}>
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 -ml-1" />
                      </div>
                    )}
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const monthsArr = Array.from({ length: 12 }).map((_, i) => i);
    const currYear = currentDate.getFullYear();
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800">
        <div className="grid grid-cols-4 gap-x-12 gap-y-16">
          {monthsArr.map(m => {
            const firstDay = new Date(currYear, m, 1);
            return (
              <div key={m} className="flex flex-col gap-4">
                <button onClick={() => { setCurrentDate(firstDay); setViewMode('month'); }} className="text-left group w-full">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 capitalize group-hover:text-[#1a5b65] dark:group-hover:text-cyan-400 transition-colors">{format(firstDay, 'MMMM', { locale: ptBR })}</h3>
                </button>
                <div className="grid grid-cols-7 text-[10px] text-center font-bold text-gray-300 dark:text-gray-600 mb-2 border-b border-gray-50 dark:border-slate-800 pb-2">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, id) => <div key={`${d}-${id}`}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                   {getYearGridDays(currYear, m).map((day, ix) => {
                     const isCurrMonth = day.getMonth() === m;
                     const isTodayDate = isToday(day);
                     const hasEvents = allEvents.some(e => isSameDay(parseISO(e.startDate), day));
                     return (
                       <div key={ix} className="flex flex-col items-center gap-0.5">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${!isCurrMonth ? 'text-gray-200 dark:text-gray-800' : isTodayDate ? 'bg-[#1a5b65] text-white shadow-md scale-110' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer text-gray-600 dark:text-gray-300'}`}>{day.getDate()}</div>
                         {hasEvents && isCurrMonth && (<div className="w-1 h-1 rounded-full bg-[#1a5b65]/40 dark:bg-cyan-400/40" />)}
                       </div>
                     );
                   })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getYearGridDays = (year: number, month: number) => {
    const s = startOfWeek(new Date(year, month, 1), { weekStartsOn: 0 });
    const e = endOfWeek(new Date(year, month + 1, 0), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: s, end: e });
  };

  const renderSidebar = () => {
    return (
      <div className="w-80 flex flex-col gap-8 p-1 pr-6 mr-4 h-full overflow-y-auto custom-scrollbar">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white px-1 mb-2">Calendário</h1>
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-transparent dark:border-slate-800">
          <div className="flex justify-between items-center mb-6 px-1">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 lowercase">{format(currentDate, 'MMMM yyyy', { locale: ptBR })}</span>
            <div className="flex gap-4">
              <ChevronLeft size={18} className="text-gray-300 dark:text-gray-600 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" onClick={handlePrev} />
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" onClick={handleNext} />
            </div>
          </div>
          <div className="grid grid-cols-7 text-[10px] text-center font-bold text-gray-300 dark:text-gray-600 mb-4 px-1">
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-3 px-1">
            {getYearGridDays(currentDate.getFullYear(), currentDate.getMonth()).map((day, idx) => {
              const isCurrMonth = day.getMonth() === currentDate.getMonth();
              const isTodayDay = isToday(day);
              return (
                <div key={idx} className={`text-[11px] h-7 w-7 flex items-center justify-center rounded-full cursor-pointer transition-colors mx-auto ${isTodayDay ? 'bg-[#7c3aed]/10 dark:bg-[#7c3aed]/20 text-[#7c3aed] dark:text-[#a78bfa] font-black' : !isCurrMonth ? 'text-gray-200 dark:text-gray-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium'}`}>{day.getDate()}</div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Tipos de Evento</h3>
          <div className="space-y-3 pl-1">
            {(['Check-in', 'Embarque', 'Hospedagem', 'Follow-up', 'Tarefa', 'Aniversariante', 'Lembrete'] as CalendarEventType[]).map(type => (
              <label key={type} className={`flex items-center justify-between cursor-pointer group transition-all ${activeFilters.includes(type) ? 'opacity-100' : 'opacity-40 italic'}`}>
                <div className="flex items-center gap-3">
                   <div className="w-5 h-5 flex items-center justify-center">{activeFilters.includes(type) ? <Eye size={14} className="text-gray-400 dark:text-gray-500" /> : <EyeOff size={14} className="text-gray-400 dark:text-gray-500" />}</div>
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`} />
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{type}</span>
                </div>
                <input type="checkbox" checked={activeFilters.includes(type)} className="hidden" onChange={() => {
                    if (activeFilters.includes(type)) setActiveFilters(prev => prev.filter(t => t !== type));
                    else setActiveFilters(prev => [...prev, type]);
                }} />
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const scrollId = viewMode === 'day' ? 'day-timeline-scroll' : viewMode === 'week' ? 'week-timeline-scroll' : null;
    if (scrollId) {
      const scrollContainer = document.getElementById(scrollId);
      if (scrollContainer) scrollContainer.scrollTop = (new Date().getHours() * 60) - 100;
    }
  }, [viewMode, currentDate]);

  return (
    <div className="h-[calc(100vh-160px)] flex bg-gray-50/50 dark:bg-[#0f172a]/20 p-2 overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col min-w-0 pt-2 px-2">
        {renderHeader()}
        <div className="flex-1 overflow-auto custom-scrollbar pt-1">
          <div style={{ zoom: `${zoom}%`, transformOrigin: 'top left' }} className="min-h-full">
            {viewMode === 'month' ? renderMonthDays() : 
            viewMode === 'day' ? renderDayView() : 
            viewMode === 'week' ? renderWeekView() :
            viewMode === 'year' ? renderYearView() : null}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isEventModalOpen && (
          <EventModal 
            onClose={() => setIsEventModalOpen(false)} 
            onSave={async (event) => {
              const eventWithUser = {
                ...event,
                userId: currentUser?.id,
                userName: currentUser?.name
              };
              await calendarService.save(eventWithUser);
              onRefresh();
              setIsEventModalOpen(false);
            }} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)}
            currentUser={currentUser}
            onDelete={async (id) => {
              if (confirm('Deseja realmente excluir este evento?')) {
                await calendarService.delete(id);
                onRefresh();
                setSelectedEvent(null);
              }
            }}
          />
        )}
      </AnimatePresence>
      <style jsx global>{`
        .custom-scrollbar-mini::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-mini::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar-mini::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        .dark .custom-scrollbar-mini::-webkit-scrollbar-thumb { background: #334155; }
        .dark .custom-scrollbar-mini::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const EventModal = ({ onClose, onSave }: { onClose: () => void, onSave: (event: any) => Promise<void> }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Tarefa' as CalendarEventType,
    startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    description: '',
    isAllDay: false
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(formData); } finally { setLoading(false); }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-transparent dark:border-slate-800">
        <div className="bg-[#1a5b65] p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Novo Evento</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2"><label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Título</label><input required autoFocus value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Reunião com Fornecedor..." className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-[#1a5b65] text-gray-800 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Tipo</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-[#1a5b65] text-gray-800 dark:text-white outline-none transition-all appearance-none"><option value="Reunião">Reunião</option><option value="Tarefa">Tarefa</option><option value="Follow-up">Follow-up</option><option value="Lembrete">Lembrete</option></select></div>
            <div className="space-y-2"><label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Início</label><input type={formData.isAllDay ? "date" : "datetime-local"} required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-[#1a5b65] text-gray-800 dark:text-white outline-none transition-all" /></div>
          </div>
          <div className="space-y-2"><label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Descrição</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detalhes adicionais..." className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-700 focus:border-[#1a5b65] text-gray-800 dark:text-white outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600" /></div>
          <div className="flex items-center gap-3 py-2 pl-1"><input type="checkbox" id="allDay" checked={formData.isAllDay} onChange={e => setFormData({...formData, isAllDay: e.target.checked})} className="w-5 h-5 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1a5b65] focus:ring-[#1a5b65]" /><label htmlFor="allDay" className="text-sm font-semibold text-gray-600 dark:text-gray-400 cursor-pointer">Evento dia inteiro</label></div>
          <button type="submit" disabled={loading} className="w-full bg-[#1a5b65] text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-900/10 hover:bg-[#154a52] transition-all disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar Evento'}</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const EventDetailsModal = ({ event, onClose, onDelete, currentUser }: { 
  event: any, 
  onClose: () => void, 
  onDelete: (id: string) => void,
  currentUser?: TeamMember | null
}) => {
  const canModify = !event.isAuto && (
    currentUser?.role === 'Administrador' || 
    currentUser?.role === 'Gerente' || 
    currentUser?.id === event.userId
  );

  // Fallback para eventos antigos ou específicos do Cleber
  const displayName = event.userName || (event.isAuto ? 'Sistema' : 'Cleber Andrade');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-transparent dark:border-slate-800">
        <div className={`h-24 flex items-end p-6 ${getDetailsBg(event.type)}`}>
           <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-lg -mb-10 text-xl font-bold border border-transparent dark:border-slate-800">{getIconForTypeDetails(event.type)}</div>
        </div>
        <div className="p-8 pt-12 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1"><span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${getBadgeStyle(event.type)}`}>{event.type}</span><h3 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">{event.title}</h3></div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-400 dark:text-gray-500"><X size={20} /></button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0"><CalendarIcon size={20} className="text-gray-400 dark:text-gray-500" /></div>
              <div><p className="text-sm font-bold text-gray-700 dark:text-gray-200">{format(parseISO(event.startDate), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
                {!event.isAllDay && <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{format(parseISO(event.startDate), "HH:mm")}h</p>}
              </div>
            </div>
            {event.description && (
              <div className="flex gap-4 text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Filter size={20} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Descrição</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-gray-50 dark:border-slate-800 italic">
                      "{event.description}"
                    </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 border-t border-gray-50 dark:border-slate-800 pt-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <User size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-wider">Criado por</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{displayName}</p>
              </div>
            </div>
          </div>
          {event.isAuto && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3"><AlertCircle size={20} className="text-blue-500 shrink-0" /><div><p className="text-xs font-bold text-blue-800">Evento Automático</p><p className="text-[11px] text-blue-600 font-medium">Este evento foi gerado com base na venda #{event.originalData?.orderNumber}. Não pode ser editado manualmente.</p></div></div>
          )}
          <div className="flex gap-3 pt-2">
            {canModify && (
              <>
                <button className="flex-1 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(event.id)}
                  className="w-14 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 py-3 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center border border-transparent dark:border-red-900/50"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
            {!canModify && !event.isAuto && (
               <button onClick={onClose} className="w-full bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-600 py-4 rounded-2xl font-bold cursor-not-allowed border border-transparent dark:border-slate-700">
                 Somente Leitura
               </button>
            )}
            {event.isAuto && (
               <button onClick={onClose} className="w-full bg-[#1a5b65] text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-900/10 hover:bg-[#154a52] transition-all">
                 Entendido
               </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const getDetailsBg = (type: string) => {
  switch (type) {
    case 'Check-in': return 'bg-orange-600';
    case 'Embarque': return 'bg-blue-600';
    case 'Hospedagem': return 'bg-purple-600';
    case 'Aniversariante': return 'bg-pink-600';
    case 'Tarefa': return 'bg-gray-700';
    case 'Follow-up': return 'bg-teal-600';
    case 'Lembrete': return 'bg-yellow-500';
    default: return 'bg-gray-700';
  }
};

const getBadgeStyle = (type: string) => {
  switch (type) {
    case 'Check-in': return 'bg-orange-100 text-orange-700';
    case 'Embarque': return 'bg-blue-100 text-blue-700';
    case 'Hospedagem': return 'bg-purple-100 text-purple-700';
    case 'Aniversariante': return 'bg-pink-100 text-pink-700';
    case 'Tarefa': return 'bg-gray-100 text-gray-700';
    case 'Follow-up': return 'bg-teal-100 text-teal-700';
    case 'Lembrete': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getIconForTypeDetails = (type: string) => {
  switch (type) {
    case 'Check-in': return <CheckCircle2 size={32} className="text-orange-500" />;
    case 'Embarque': return <Plane size={32} className="text-blue-500" />;
    case 'Hospedagem': return <Hotel size={32} className="text-purple-500" />;
    case 'Aniversariante': return <User size={32} className="text-pink-500" />;
    case 'Tarefa': return <Clock size={32} className="text-gray-500" />;
    case 'Follow-up': return <Flag size={32} className="text-teal-500" />;
    case 'Lembrete': return <Bell size={32} className="text-yellow-500" />;
    default: return <CalendarIcon size={32} className="text-gray-500" />;
  }
};
