export const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars.push('★');
    }
    if (hasHalfStar) {
        stars.push('☆');
    }
    while (stars.length < 5) {
        stars.push('☆');
    }
    
    return stars.join('');
};

export const sortCouriers = (couriersList, sortType) => {
    const sorted = [...couriersList];
    switch (sortType) {
        case 'time':
            return sorted.sort((a, b) => {
                const timeA = a.time.split(' → ')[0];
                const timeB = b.time.split(' → ')[0];
                return timeA.localeCompare(timeB);
            });
        case 'price':
            return sorted.sort((a, b) => a.price - b.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted;
    }
};

// Mapping between Russian and English city names
const cityMapping = {
    'Москва': 'Moscow',
    'Санкт-Петербург': 'Saint Petersburg',
    'Сочи': 'Sochi',
    'Казань': 'Kazan',
    'Новосибирск': 'Novosibirsk',
    'Екатеринбург': 'Yekaterinburg',
    'Нижний Новгород': 'Nizhny Novgorod',
    'Челябинск': 'Chelyabinsk',
    'Самара': 'Samara',
    'Ростов-на-Дону': 'Rostov-on-Don',
    'Уфа': 'Ufa',
    'Красноярск': 'Krasnoyarsk',
    'Пермь': 'Perm',
    'Воронеж': 'Voronezh',
    'Волгоград': 'Volgograd'
};

export const getAvailableCities = (couriers) => {
    const uniqueCities = new Set();
    couriers.forEach(courier => {
        // Get English names for backend consistency
        const fromEn = cityMapping[courier.from] || courier.from;
        const toEn = cityMapping[courier.to] || courier.to;
        uniqueCities.add(fromEn);
        uniqueCities.add(toEn);
    });
    return Array.from(uniqueCities).sort();
};

export const translateCityName = (cityName, toRussian = true) => {
    if (toRussian) {
        // Find Russian name by English name
        const entry = Object.entries(cityMapping).find(([ru, en]) => en === cityName);
        return entry ? entry[0] : cityName;
    } else {
        // Find English name by Russian name
        return cityMapping[cityName] || cityName;
    }
};