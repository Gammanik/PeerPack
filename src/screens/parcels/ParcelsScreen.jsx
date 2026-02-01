import React, { useState } from 'react';
import PackagesSection from '../profile/components/PackagesSection.jsx';
import AddParcelForm from '../../domains/user/components/AddParcelForm.jsx';
import { supabaseApi } from '../../services/supabaseApi.js';

const ParcelsScreen = ({ onNavigate }) => {
  const [showAddParcelForm, setShowAddParcelForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const availableCities = ['Москва', 'Санкт-Петербург', 'Дубай', 'Сочи', 'Казань', 'Новосибирск', 'Екатеринбург', 'Стамбул', 'Анталья', 'Милан', 'Париж'];
  const currentUserId = 1; // TODO: replace with real user ID from Telegram

  const handleAddParcel = async (parcelData) => {
    try {
      const { success, parcel_id, error: parcelError } = await supabaseApi.createParcel({
        user_id: currentUserId,
        title: parcelData.title,
        origin: parcelData.from,
        destination: parcelData.to,
        description: parcelData.description || null,
        weight_kg: parseFloat(parcelData.weight),
        reward: parseInt(parcelData.reward),
        pickup_address: parcelData.pickupLocation || null,
        delivery_address: parcelData.deliveryLocation || null,
        status: 'open'
      });

      if (parcelError) {
        alert('Ошибка: ' + parcelError.message);
        return;
      }

      alert('Посылка успешно создана!');
      setShowAddParcelForm(false);
      // Обновляем список посылок
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error adding parcel:', err);
      alert('Произошла ошибка');
    }
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, var(--tg-theme-bg-color, #17212b) 0%, rgba(23, 33, 43, 0.95) 100%)',
      minHeight: '100vh',
      padding: '16px',
      paddingBottom: '80px' // Отступ для нижней навигации
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
      padding: '20px 0'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-text-color, #ffffff), var(--tg-theme-accent-text-color, #64b5ef))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '15px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    addButton: {
      width: '100%',
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      border: 'none',
      borderRadius: '16px',
      padding: '16px',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 16px rgba(82, 136, 193, 0.3)',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>📦 Мои посылки</div>
        <div style={styles.subtitle}>Управляйте своими посылками и откликами</div>
      </div>

      <button
        style={styles.addButton}
        onClick={() => setShowAddParcelForm(true)}
      >
        <span style={{ fontSize: '20px' }}>+</span>
        <span>Добавить посылку</span>
      </button>

      <PackagesSection key={refreshKey} onNavigate={onNavigate} />

      <AddParcelForm
        showAddParcelForm={showAddParcelForm}
        setShowAddParcelForm={setShowAddParcelForm}
        onAddParcel={handleAddParcel}
        availableCities={availableCities}
      />
    </div>
  );
};

export default ParcelsScreen;
