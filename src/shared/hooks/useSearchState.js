import { useState, useCallback } from 'react';
import { getAvailableCities } from '../../utils/courierUtils';

export const useSearchState = (couriers) => {
  const [from, setFrom] = useState('Москва');
  const [to, setTo] = useState('Санкт-Петербург');
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sortBy, setSortBy] = useState('time');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const availableCities = getAvailableCities(couriers);
  
  const clearFromCity = useCallback(() => {
    setFrom('');
    setResults([]);
    setSearchPerformed(false);
  }, []);
  
  const clearToCity = useCallback(() => {
    setTo('');
    setResults([]);
    setSearchPerformed(false);
  }, []);
  
  const getDatePresets = useCallback(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const week = new Date(today);
    week.setDate(today.getDate() + 7);

    return [
      { 
        label: 'Сегодня-завтра', 
        action: () => {
          setDateFrom(today.toISOString().split('T')[0]);
          setDateTo(tomorrow.toISOString().split('T')[0]);
        }
      },
      { 
        label: 'Эта неделя', 
        action: () => {
          setDateFrom(today.toISOString().split('T')[0]);
          setDateTo(week.toISOString().split('T')[0]);
        }
      },
      { 
        label: 'Очистить', 
        action: () => {
          setDateFrom('');
          setDateTo('');
        }
      }
    ];
  }, []);
  
  const getDateRangeLabel = useCallback(() => {
    if (!dateFrom && !dateTo) return 'Любые даты';
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      return `${fromDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${toDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
    }
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      return `c ${fromDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      return `до ${toDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
    }
    return 'Любые даты';
  }, [dateFrom, dateTo]);
  
  return {
    // State
    from,
    to,
    results,
    searchPerformed,
    dateFrom,
    dateTo,
    showDatePicker,
    sortBy,
    showSortMenu,
    availableCities,
    
    // Setters
    setFrom,
    setTo,
    setResults,
    setSearchPerformed,
    setDateFrom,
    setDateTo,
    setShowDatePicker,
    setSortBy,
    setShowSortMenu,
    
    // Actions
    clearFromCity,
    clearToCity,
    getDatePresets,
    getDateRangeLabel
  };
};