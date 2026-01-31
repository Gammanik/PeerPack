import mockApiData from '../data/api-mock-data.json';

// Симуляция HTTP задержки
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Симуляция успешного ответа
const mockResponse = (data, status = 200) => ({
    status,
    data,
    ok: status >= 200 && status < 300
});

// Симуляция ошибки
const mockError = (message, status = 400) => {
    throw new Error(`HTTP ${status}: ${message}`);
};

class ApiService {
    constructor() {
        this.baseUrl = 'https://api.peerpack.com/v1';
        this.token = 'mock_jwt_token_123';
    }

    // Общий метод для HTTP запросов
    async request(endpoint, options = {}) {
        await delay(300 + Math.random() * 700); // Имитация сетевой задержки
        
        console.log(`API Call: ${options.method || 'GET'} ${endpoint}`, options.body || '');
        
        // В реальном приложении здесь был бы fetch
        // return fetch(`${this.baseUrl}${endpoint}`, {
        //     headers: {
        //         'Authorization': `Bearer ${this.token}`,
        //         'Content-Type': 'application/json',
        //         ...options.headers
        //     },
        //     ...options
        // });

        // Симуляция ответов на основе эндпоинтов
        return this.getMockResponse(endpoint, options);
    }

    // Генерирует относительные даты для курьеров
    generateDynamicCourierDates(couriers) {
        const now = new Date();
        
        return couriers.map((courier, index) => {
            // Генерируем разные времена для каждого курьера
            const hoursFromNow = [1, 3, 5, 8, 12][index] || (index + 1); // 1ч, 3ч, 5ч, 8ч, 12ч
            const departureTime = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
            
            // Форматируем дату в YYYY-MM-DD
            const formattedDate = departureTime.toISOString().split('T')[0];
            
            // Генерируем время выезда на основе нового времени
            const startHour = departureTime.getHours();
            const startMinute = departureTime.getMinutes();
            const endTime = new Date(departureTime.getTime() + 2.5 * 60 * 60 * 1000); // +2.5 часа полёта
            const endHour = endTime.getHours();
            const endMinute = endTime.getMinutes();
            
            const timeString = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} → ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
            
            return {
                ...courier,
                date: formattedDate,
                time: timeString
            };
        });
    }

    getMockResponse(endpoint, options) {
        const method = options.method || 'GET';
        
        // GET /api/couriers
        if (endpoint.includes('/couriers') && method === 'GET') {
            const couriersData = mockApiData.endpoints['GET /api/couriers'].response;
            const dynamicCouriers = this.generateDynamicCourierDates(couriersData.couriers);
            return mockResponse({ couriers: dynamicCouriers });
        }
        
        // GET /api/user/packages
        if (endpoint === '/user/packages' && method === 'GET') {
            return mockResponse(mockApiData.endpoints['GET /api/user/packages'].response);
        }
        
        // GET /api/user/trips
        if (endpoint === '/user/trips' && method === 'GET') {
            return mockResponse(mockApiData.endpoints['GET /api/user/trips'].response);
        }
        
        
        // GET /api/trips/{id}/package-requests
        if (endpoint.includes('/trips/') && endpoint.includes('/package-requests') && method === 'GET') {
            return mockResponse(mockApiData.endpoints['GET /api/trips/{trip_id}/package-requests'].response);
        }
        
        // POST /api/packages
        if (endpoint === '/packages' && method === 'POST') {
            return mockResponse(mockApiData.endpoints['POST /api/packages'].response);
        }
        
        // POST /api/trips
        if (endpoint === '/trips' && method === 'POST') {
            return mockResponse(mockApiData.endpoints['POST /api/trips'].response);
        }
        
        // PUT /api/package-requests/{id}/accept
        if (endpoint.includes('/package-requests/') && endpoint.includes('/accept') && method === 'PUT') {
            return mockResponse(mockApiData.endpoints['PUT /api/package-requests/{request_id}/accept'].response);
        }
        
        // PUT /api/package-requests/{id}/mark-delivered
        if (endpoint.includes('/package-requests/') && endpoint.includes('/mark-delivered') && method === 'PUT') {
            return mockResponse(mockApiData.endpoints['PUT /api/package-requests/{request_id}/mark-delivered'].response);
        }

        // POST /api/couriers/{courier_id}/send-package
        if (endpoint.includes('/couriers/') && endpoint.includes('/send-package') && method === 'POST') {
            return mockResponse(mockApiData.endpoints['POST /api/couriers/{courier_id}/send-package'].response);
        }

        return mockError('Endpoint not found', 404);
    }

    // API методы
    async getCouriers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await this.request(`/couriers?${queryString}`);
        return response.data;
    }

    async getUserPackages() {
        const response = await this.request('/user/packages');
        return response.data;
    }

    async getUserTrips() {
        const response = await this.request('/user/trips');
        return response.data;
    }


    async getTripPackageRequests(tripId) {
        const response = await this.request(`/trips/${tripId}/package-requests`);
        return response.data;
    }

    async createPackage(packageData) {
        const response = await this.request('/packages', {
            method: 'POST',
            body: JSON.stringify(packageData)
        });
        return response.data;
    }

    async createTrip(tripData) {
        const response = await this.request('/trips', {
            method: 'POST',
            body: JSON.stringify(tripData)
        });
        return response.data;
    }

    async acceptPackageRequest(requestId) {
        const response = await this.request(`/package-requests/${requestId}/accept`, {
            method: 'PUT'
        });
        return response.data;
    }

    async markPackageDelivered(requestId) {
        const response = await this.request(`/package-requests/${requestId}/mark-delivered`, {
            method: 'PUT'
        });
        return response.data;
    }


    async sendPackageToCourier(courierId, packageData) {
        const response = await this.request(`/couriers/${courierId}/send-package`, {
            method: 'POST',
            body: JSON.stringify(packageData)
        });
        return response.data;
    }
}

export const apiService = new ApiService();
export default apiService;