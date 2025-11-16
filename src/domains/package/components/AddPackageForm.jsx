import React, { useState } from 'react';
import { usePackageActions } from '../../../hooks/useApi';

const AddPackageForm = ({ onClose, onSuccess }) => {
  const { createPackage } = usePackageActions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    description: '',
    reward: '',
    size: 's',
    weight: 'light',
    tags: [],
    pickup_address: '',
    delivery_address: ''
  });

  const [customTag, setCustomTag] = useState('');

  const availableTags = [
    { id: 'documents', label: '📄 Документы', color: '#007bff' },
    { id: 'urgent', label: '⚡ Срочно', color: '#ff4500' },
    { id: 'fragile', label: '🔸 Хрупкое', color: '#ffc107' },
    { id: 'valuable', label: '💎 Ценное', color: '#6610f2' },
    { id: 'medical', label: '⚕️ Медикаменты', color: '#28a745' },
    { id: 'electronics', label: '💻 Электроника', color: '#17a2b8' },
    { id: 'gift', label: '🎁 Подарок', color: '#e83e8c' },
    { id: 'books', label: '📚 Книги', color: '#6c757d' }
  ];

  const sizeOptions = [
    { value: 'xs', label: 'XS - Конверт (A4)', emoji: '📋' },
    { value: 's', label: 'S - Книга (до 1кг)', emoji: '📘' },
    { value: 'm', label: 'M - Коробка обуви (до 3кг)', emoji: '📦' },
    { value: 'l', label: 'L - Чемодан (до 10кг)', emoji: '🧳' }
  ];

  const weightOptions = [
    { value: 'light', label: 'Легкий (до 0.5кг)' },
    { value: 'medium', label: 'Средний (0.5-2кг)' },
    { value: 'heavy', label: 'Тяжелый (2-5кг)' },
    { value: 'very_heavy', label: 'Очень тяжелый (5-10кг)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
      setCustomTag('');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.from.trim()) {
      alert('Укажите город отправления');
      return;
    }
    if (!formData.to.trim()) {
      alert('Укажите город назначения');
      return;
    }
    if (!formData.description.trim()) {
      alert('Добавьте описание посылки');
      return;
    }
    if (!formData.reward || formData.reward <= 0) {
      alert('Укажите вознаграждение');
      return;
    }
    if (!formData.pickup_address.trim()) {
      alert('Укажите адрес забора');
      return;
    }
    if (!formData.delivery_address.trim()) {
      alert('Укажите адрес доставки');
      return;
    }

    try {
      setLoading(true);
      const response = await createPackage({
        ...formData,
        reward: parseFloat(formData.reward)
      });

      console.log('Package created:', response);
      alert('Посылка успешно создана!');

      if (onSuccess) {
        onSuccess(response);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Ошибка при создании посылки. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      backgroundColor: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '20px',
      padding: 0,
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 20px 16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'linear-gradient(135deg, var(--tg-theme-secondary-bg-color, #232e3c), rgba(35, 46, 60, 0.8))'
    },
    modalTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontSize: '24px',
      cursor: 'pointer',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    },
    modalContent: {
      padding: '20px',
      maxHeight: 'calc(90vh - 140px)',
      overflowY: 'auto'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px',
      display: 'block',
      fontSize: '15px',
      fontWeight: '600'
    },
    hint: {
      color: 'var(--tg-theme-hint-color, #708499)',
      fontSize: '12px',
      marginTop: '4px'
    },
    input: {
      width: '100%',
      padding: '14px',
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border 0.2s ease'
    },
    textarea: {
      width: '100%',
      padding: '14px',
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontSize: '15px',
      minHeight: '100px',
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      lineHeight: '1.5'
    },
    sizeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px'
    },
    sizeOption: {
      padding: '14px',
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center'
    },
    sizeOptionSelected: {
      borderColor: 'var(--tg-theme-button-color, #5288c1)',
      background: 'rgba(82, 136, 193, 0.15)'
    },
    sizeEmoji: {
      fontSize: '24px',
      marginBottom: '6px'
    },
    sizeLabel: {
      fontSize: '13px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontWeight: '500'
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '12px'
    },
    tag: {
      padding: '8px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    tagSelected: {
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      color: 'white',
      border: '1px solid transparent'
    },
    tagUnselected: {
      background: 'var(--tg-theme-bg-color, #17212b)',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    customTagInput: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px'
    },
    addTagButton: {
      padding: '10px 16px',
      background: 'var(--tg-theme-button-color, #5288c1)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    select: {
      width: '100%',
      padding: '14px',
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      cursor: 'pointer'
    },
    modalButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    cancelButton: {
      flex: 1,
      padding: '14px',
      background: 'transparent',
      color: 'var(--tg-theme-hint-color, #708499)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },
    submitButton: {
      flex: 2,
      padding: '14px',
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '15px',
      boxShadow: '0 4px 16px rgba(82, 136, 193, 0.3)',
      transition: 'all 0.2s ease'
    },
    submitButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>
            <span>📦</span>
            <span>Добавить посылку</span>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.modalContent}>
          {/* Route */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Маршрут</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Город отправления"
                  value={formData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Город назначения"
                  value={formData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Описание посылки</label>
            <textarea
              placeholder="Опишите что нужно доставить..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={styles.textarea}
            />
            <div style={styles.hint}>Чем подробнее, тем лучше курьеры поймут задачу</div>
          </div>

          {/* Size */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Размер посылки</label>
            <div style={styles.sizeGrid}>
              {sizeOptions.map(option => (
                <div
                  key={option.value}
                  style={{
                    ...styles.sizeOption,
                    ...(formData.size === option.value ? styles.sizeOptionSelected : {})
                  }}
                  onClick={() => handleInputChange('size', option.value)}
                >
                  <div style={styles.sizeEmoji}>{option.emoji}</div>
                  <div style={styles.sizeLabel}>{option.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Вес посылки</label>
            <select
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              style={styles.select}
            >
              {weightOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Категории (теги)</label>
            <div style={styles.tagsContainer}>
              {availableTags.map(tag => (
                <div
                  key={tag.id}
                  style={{
                    ...styles.tag,
                    ...(formData.tags.includes(tag.id) ? styles.tagSelected : styles.tagUnselected)
                  }}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.label}
                </div>
              ))}
            </div>
            <div style={styles.customTagInput}>
              <input
                type="text"
                placeholder="Свой тег..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                style={{ ...styles.input, flex: 1 }}
              />
              <button
                onClick={addCustomTag}
                style={styles.addTagButton}
              >
                Добавить
              </button>
            </div>
          </div>

          {/* Reward */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Вознаграждение (₽)</label>
            <input
              type="number"
              placeholder="1000"
              value={formData.reward}
              onChange={(e) => handleInputChange('reward', e.target.value)}
              style={styles.input}
              min="0"
            />
            <div style={styles.hint}>Предложите справедливую цену за доставку</div>
          </div>

          {/* Pickup Address */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Адрес забора</label>
            <input
              type="text"
              placeholder="Откуда забрать посылку"
              value={formData.pickup_address}
              onChange={(e) => handleInputChange('pickup_address', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Delivery Address */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Адрес доставки</label>
            <input
              type="text"
              placeholder="Куда доставить посылку"
              value={formData.delivery_address}
              onChange={(e) => handleInputChange('delivery_address', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Buttons */}
          <div style={styles.modalButtons}>
            <button
              style={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {})
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать посылку'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackageForm;
