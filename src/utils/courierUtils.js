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

export const getAvailableCities = (couriers) => {
    const uniqueCities = new Set();
    couriers.forEach(courier => {
        uniqueCities.add(courier.from);
        uniqueCities.add(courier.to);
    });
    return Array.from(uniqueCities).sort();
};