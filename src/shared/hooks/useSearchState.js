import { useState, useCallback, useEffect } from 'react';
import { getAvailableCities } from '../../utils/courierUtils';
import { useLocale } from '../../contexts/LanguageContext';
import { translateCityName } from '../../utils/courierUtils';

export const useSearchState = (couriers) => {
  const { t, isRussian, language } = useLocale();
  const [from, setFrom] = useState(isRussian ? 'Москва' : 'Moscow');
  const [to, setTo] = useState(isRussian ? 'Санкт-Петербург' : 'Saint Petersburg');
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sortBy, setSortBy] = useState('time');
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const availableCities = getAvailableCities(couriers);
  
  // Update city names when language changes
  useEffect(() => {
    if (from) {
      const translatedFrom = translateCityName(from, isRussian);
      if (translatedFrom !== from) {
        setFrom(translatedFrom);
      }
    }
    if (to) {
      const translatedTo = translateCityName(to, isRussian);
      if (translatedTo !== to) {
        setTo(translatedTo);
      }
    }
  }, [language]); // Only depend on language, not from/to to avoid infinite loops
  
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
        label: t('today'), 
        action: () => {
          setDateFrom(today.toISOString().split('T')[0]);
          setDateTo(today.toISOString().split('T')[0]);
        }
      },
      { 
        label: t('tomorrow'), 
        action: () => {
          setDateFrom(tomorrow.toISOString().split('T')[0]);
          setDateTo(tomorrow.toISOString().split('T')[0]);
        }
      },
      { 
        label: t('thisWeek'), 
        action: () => {
          setDateFrom(today.toISOString().split('T')[0]);
          setDateTo(week.toISOString().split('T')[0]);
        }
      },
      { 
        label: t('thisMonth'), 
        action: () => {
          const month = new Date(today);
          month.setMonth(today.getMonth() + 1);
          setDateFrom(today.toISOString().split('T')[0]);
          setDateTo(month.toISOString().split('T')[0]);
        }
      },
      { 
        label: t('nextMonth'), 
        action: () => {
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          const monthAfter = new Date(nextMonth);
          monthAfter.setMonth(nextMonth.getMonth() + 1);
          setDateFrom(nextMonth.toISOString().split('T')[0]);
          setDateTo(monthAfter.toISOString().split('T')[0]);
        }
      },
      { 
        label: t('flexible'), 
        action: () => {
          setDateFrom('');
          setDateTo('');
        }
      }
    ];
  }, [t, language]);
  
  const getDateRangeLabel = useCallback(() => {
    const locale = isRussian ? 'ru-RU' : 'en-US';
    const anyDates = isRussian ? 'Любые даты' : 'Any dates';
    const fromText = isRussian ? 'с' : 'from';
    const toText = isRussian ? 'до' : 'to';
    
    if (!dateFrom && !dateTo) return anyDates;
    if (dateFrom && dateTo) {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      return `${fromDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} - ${toDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`;
    }
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      return `${fromText} ${fromDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`;
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      return `${toText} ${toDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`;
    }
    return anyDates;
  }, [dateFrom, dateTo, isRussian, language]);
  
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