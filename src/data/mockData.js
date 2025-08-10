export const cities = [
    "Москва", "Санкт-Петербург", "Казань", "Екатеринбург",
    "Новосибирск", "Сочи", "Самара", "Краснодар"
];

// Генерируем данные относительно текущего времени
const generateRelativeDate = (hoursFromNow) => {
    const date = new Date();
    date.setHours(date.getHours() + hoursFromNow);
    return date.toISOString().split('T')[0];
};

const generateRelativeTime = (hoursFromNow) => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + hoursFromNow);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2);
    
    const formatTime = (date) => {
        return date.toTimeString().slice(0, 5);
    };
    
    return `${formatTime(startDate)} → ${formatTime(endDate)}`;
};

export const couriers = [
    {
        name: 'Иван',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: generateRelativeDate(1),
        time: generateRelativeTime(1),
        airport: 'Шереметьево → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=12',
        tripsCount: 47,
        rating: 4.9,
        reviewsCount: 32,
        price: 800,
        tripComment: 'Лечу по работе, могу взять документы или небольшие посылки',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-15', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-06-10', success: true },
            { from: 'Москва', to: 'Екатеринбург', date: '2025-05-20', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Отличный курьер! Быстро и аккуратно доставил документы.', date: '2025-06-16' },
            { rating: 5, text: 'Все супер, рекомендую!', date: '2025-06-11' },
            { rating: 4, text: 'Хорошо, но немного задержался с уведомлением о получении.', date: '2025-05-22' }
        ]
    },
    {
        name: 'Елена',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: generateRelativeDate(3),
        time: generateRelativeTime(3),
        airport: 'Внуково → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=44',
        tripsCount: 28,
        rating: 4.8,
        reviewsCount: 21,
        price: 1200,
        tripComment: 'Утренний рейс, удобно для срочных доставок. Место только для документов',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-08', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-05-28', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Очень пунктуальная! Доставила точно в срок.', date: '2025-06-09' },
            { rating: 5, text: 'Профессиональный подход, рекомендую.', date: '2025-05-29' }
        ]
    },
    {
        name: 'Максим',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: generateRelativeDate(6),
        time: generateRelativeTime(6),
        airport: 'Домодедово → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=68',
        tripsCount: 15,
        rating: 4.6,
        reviewsCount: 12,
        price: 600,
        tripComment: 'Студент, летаю часто к родителям. Недорого, но надежно!',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-01', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-05-15', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Отличный парень! Доставил быстро и недорого.', date: '2025-06-02' },
            { rating: 4, text: 'Все хорошо, молодец!', date: '2025-05-16' }
        ]
    },
    {
        name: 'Анастасия',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: generateRelativeDate(12),
        time: generateRelativeTime(12),
        airport: 'Шереметьево → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=31',
        tripsCount: 52,
        rating: 5.0,
        reviewsCount: 45,
        price: 1500,
        tripComment: 'Премиум доставка. Фото отчеты, трекинг, страховка включена',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-12', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-06-05', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Лучший курьер! Идеальный сервис, всегда на связи.', date: '2025-06-13' },
            { rating: 5, text: 'Профессионал высшего класса. Стоит своих денег.', date: '2025-06-06' }
        ]
    },
    {
        name: 'Дмитрий',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: generateRelativeDate(24),
        time: generateRelativeTime(24),
        airport: 'Внуково → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=17',
        tripsCount: 34,
        rating: 4.7,
        reviewsCount: 28,
        price: 900,
        tripComment: 'Самый ранний рейс. Беру только легкие посылки до 2кг',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-03', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-05-20', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Ранняя доставка - то что нужно! Спасибо!', date: '2025-06-04' },
            { rating: 4, text: 'Хороший курьер, но строго по весу.', date: '2025-05-21' }
        ]
    },
    {
        name: 'Анна',
        from: 'Казань',
        to: 'Екатеринбург',
        date: generateRelativeDate(48),
        time: generateRelativeTime(48),
        airport: 'Казань → Кольцово',
        avatar: 'https://i.pravatar.cc/100?img=25',
        tripsCount: 23,
        rating: 4.7,
        reviewsCount: 18,
        price: 700,
        tripComment: 'Регулярные рейсы, доставляю аккуратно',
        pastTrips: [
            { from: 'Казань', to: 'Екатеринбург', date: '2025-06-20', success: true },
            { from: 'Екатеринбург', to: 'Москва', date: '2025-06-05', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Очень ответственная! Постоянно держала в курсе.', date: '2025-06-21' },
            { rating: 4, text: 'Все хорошо, спасибо!', date: '2025-06-06' }
        ]
    },
    {
        name: 'Олег',
        from: 'Москва',
        to: 'Сочи',
        date: generateRelativeDate(72),
        time: generateRelativeTime(72),
        airport: 'Внуково → Адлер',
        avatar: 'https://i.pravatar.cc/100?img=33',
        tripsCount: 89,
        rating: 5.0,
        reviewsCount: 67,
        price: 1800,
        tripComment: 'Опытный курьер, беру любые посылки. Гарантия доставки',
        pastTrips: [
            { from: 'Москва', to: 'Сочи', date: '2025-06-25', success: true },
            { from: 'Сочи', to: 'Москва', date: '2025-06-15', success: true },
            { from: 'Москва', to: 'Краснодар', date: '2025-06-01', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Профессионал высшего класса! Уже не первый раз пользуюсь услугами.', date: '2025-06-26' },
            { rating: 5, text: 'Идеально! Быстро, надежно, безопасно.', date: '2025-06-16' },
            { rating: 5, text: 'Рекомендую всем! Очень надежный курьер.', date: '2025-06-02' }
        ]
    }
];