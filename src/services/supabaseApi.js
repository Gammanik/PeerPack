import { supabase } from './supabase.js';

/**
 * Supabase API Service - заменяет mock API
 * Реализация всех методов для работы с реальной БД
 */

class SupabaseApiService {
    checkSupabase() {
        if (!supabase) {
            throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
        }
    }
    // ========================================
    // USERS
    // ========================================

    async getOrCreateUser(telegramUser) {
        this.checkSupabase();
        try {
            // Попытка найти пользователя
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('telegram_id', telegramUser.id)
                .single();

            if (existingUser) {
                return { user: existingUser, error: null };
            }

            // Создание нового пользователя
            const fullName = [telegramUser.first_name, telegramUser.last_name]
                .filter(Boolean)
                .join(' ');

            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    telegram_id: telegramUser.id,
                    telegram_username: telegramUser.username,
                    full_name: fullName,
                    avatar_url: telegramUser.photo_url
                })
                .select()
                .single();

            if (createError) {
                return { user: null, error: createError };
            }

            // Инициализируем демо-данные для нового пользователя
            console.log('🎬 New user created, initializing demo data...');
            await this.initializeDemoDataForUser(newUser.id);

            return { user: newUser, error: null };
        } catch (error) {
            console.error('Error in getOrCreateUser:', error);
            return { user: null, error };
        }
    }

    // ========================================
    // TRIPS (Поездки)
    // ========================================

    async getTrips(params = {}) {
        this.checkSupabase();
        let query = supabase
            .from('trips')
            .select(`
                *,
                user:users(id, full_name, telegram_username, avatar_url, rating)
            `)
            .eq('status', 'active')
            .gte('depart_at', new Date().toISOString());

        // Фильтр по маршруту
        if (params.origin) {
            query = query.ilike('origin', `%${params.origin}%`);
        }
        if (params.destination) {
            query = query.ilike('destination', `%${params.destination}%`);
        }

        // Фильтр по датам
        if (params.date_from) {
            query = query.gte('depart_at', params.date_from);
        }
        if (params.date_to) {
            query = query.lte('depart_at', params.date_to);
        }

        const { data, error } = await query.order('depart_at', { ascending: true });

        if (error) {
            console.error('Error fetching trips:', error);
            return { trips: [], error };
        }

        return { trips: data || [], error: null };
    }

    async getUserTrips(userId) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('user_id', userId)
            .order('depart_at', { ascending: false });

        if (error) {
            console.error('Error fetching user trips:', error);
            return { trips: [], error };
        }

        return { trips: data || [], error: null };
    }

    async createTrip(tripData) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('trips')
            .insert(tripData)
            .select()
            .single();

        if (error) {
            console.error('Error creating trip:', error);
            return { trip: null, error };
        }

        return { success: true, trip_id: data.id, trip: data };
    }

    // ========================================
    // PARCELS (Посылки)
    // ========================================

    async getParcels(params = {}) {
        this.checkSupabase();
        let query = supabase
            .from('parcels')
            .select(`
                *,
                user:users(id, full_name, telegram_username, avatar_url, rating)
            `)
            .eq('status', 'open');

        if (params.origin) {
            query = query.ilike('origin', `%${params.origin}%`);
        }
        if (params.destination) {
            query = query.ilike('destination', `%${params.destination}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching parcels:', error);
            return { parcels: [], error };
        }

        return { parcels: data || [], error: null };
    }

    async getUserParcels(userId) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('parcels')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user parcels:', error);
            return { parcels: [], error };
        }

        return { parcels: data || [], error: null };
    }

    async createParcel(parcelData) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('parcels')
            .insert(parcelData)
            .select()
            .single();

        if (error) {
            console.error('Error creating parcel:', error);
            return { parcel: null, error };
        }

        return { success: true, parcel_id: data.id, parcel: data };
    }

    // ========================================
    // OFFERS (Отклики)
    // ========================================

    async getOffersForTrip(tripId) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('offers')
            .select(`
                *,
                parcel:parcels(*),
                user:users(id, full_name, telegram_username, avatar_url, rating, reviews_count)
            `)
            .eq('trip_id', tripId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching trip offers:', error);
            return { offers: [], error };
        }

        return { offers: data || [], error: null };
    }

    async getOffersForParcel(parcelId) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('offers')
            .select(`
                *,
                trip:trips(*),
                user:users(id, full_name, telegram_username, avatar_url, rating, reviews_count)
            `)
            .eq('parcel_id', parcelId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching parcel offers:', error);
            return { offers: [], error };
        }

        return { offers: data || [], error: null };
    }

    async createOffer(offerData) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('offers')
            .insert(offerData)
            .select()
            .single();

        if (error) {
            console.error('Error creating offer:', error);
            return { offer: null, error };
        }

        return { success: true, offer_id: data.id, offer: data };
    }

    async updateOfferStatus(offerId, status) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('offers')
            .update({ status, is_viewed: true })
            .eq('id', offerId)
            .select()
            .single();

        if (error) {
            console.error('Error updating offer status:', error);
            return { success: false, error };
        }

        // Если оффер принят, создаем delivery
        if (status === 'accepted' && data) {
            await this.createDeliveryFromOffer(data);
        }

        return { success: true, offer: data };
    }

    async markOfferAsViewed(offerId) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('offers')
            .update({ is_viewed: true })
            .eq('id', offerId)
            .select()
            .single();

        if (error) {
            console.error('Error marking offer as viewed:', error);
            return { success: false, error };
        }

        return { success: true, offer: data };
    }

    // ========================================
    // DELIVERIES (Доставки)
    // ========================================

    async createDeliveryFromOffer(offer) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('deliveries')
            .insert({
                parcel_id: offer.parcel_id,
                trip_id: offer.trip_id,
                carrier_user_id: offer.type === 'parcel_to_trip'
                    ? (await supabase.from('trips').select('user_id').eq('id', offer.trip_id).single()).data.user_id
                    : offer.user_id,
                status: 'assigned'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating delivery:', error);
            return { delivery: null, error };
        }

        return { success: true, delivery_id: data.id, delivery: data };
    }

    async getUserDeliveries(userId) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('deliveries')
            .select(`
                *,
                parcel:parcels(*),
                trip:trips(*),
                carrier:users!carrier_user_id(id, full_name, telegram_username, avatar_url, rating)
            `)
            .eq('carrier_user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user deliveries:', error);
            return { deliveries: [], error };
        }

        return { deliveries: data || [], error: null };
    }

    async updateDeliveryStatus(deliveryId, status) {
        this.checkSupabase();
        const updateData = { status };

        if (status === 'in_transit') {
            updateData.pickup_time = new Date().toISOString();
        } else if (status === 'delivered') {
            updateData.delivery_time = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('deliveries')
            .update(updateData)
            .eq('id', deliveryId)
            .select()
            .single();

        if (error) {
            console.error('Error updating delivery status:', error);
            return { success: false, error };
        }

        return { success: true, delivery: data };
    }

    async confirmPickup(deliveryId) {
        this.checkSupabase();
        return await this.updateDeliveryStatus(deliveryId, 'in_transit');
    }

    async confirmDelivery(deliveryId) {
        this.checkSupabase();
        return await this.updateDeliveryStatus(deliveryId, 'delivered');
    }

    async getActiveDeliveriesForUser(userId) {
        this.checkSupabase();

        // Получаем доставки где пользователь - путешественник (carrier)
        const { data: asCarrier, error: carrierError } = await supabase
            .from('deliveries')
            .select(`
                *,
                parcel:parcels(
                    *,
                    user:users(id, full_name, telegram_username, avatar_url, rating, reviews_count)
                ),
                trip:trips(*)
            `)
            .eq('carrier_user_id', userId)
            .in('status', ['assigned', 'in_transit'])
            .order('created_at', { ascending: false });

        // Получаем доставки где пользователь - отправитель посылки
        const { data: parcels } = await supabase
            .from('parcels')
            .select('id')
            .eq('user_id', userId);

        const parcelIds = (parcels || []).map(p => p.id);

        const { data: asSender, error: senderError } = parcelIds.length > 0
            ? await supabase
                .from('deliveries')
                .select(`
                    *,
                    parcel:parcels(*),
                    trip:trips(*),
                    carrier:users!carrier_user_id(id, full_name, telegram_username, avatar_url, rating, reviews_count)
                `)
                .in('parcel_id', parcelIds)
                .in('status', ['assigned', 'in_transit'])
                .order('created_at', { ascending: false })
            : { data: [], error: null };

        if (carrierError || senderError) {
            console.error('Error fetching active deliveries:', carrierError || senderError);
            return { deliveries: [], error: carrierError || senderError };
        }

        // Объединяем и помечаем роль пользователя
        const deliveries = [
            ...(asCarrier || []).map(d => ({ ...d, userRole: 'carrier' })),
            ...(asSender || []).map(d => ({ ...d, userRole: 'sender' }))
        ];

        return { deliveries, error: null };
    }

    // ========================================
    // REVIEWS (Отзывы)
    // ========================================

    async getReviewsForUser(userId) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                reviewer:users!reviewer_user_id(id, full_name, telegram_username, avatar_url, rating),
                delivery:deliveries(id, parcel_id, trip_id)
            `)
            .eq('reviewed_user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            return { reviews: [], error };
        }

        return { reviews: data || [], error: null };
    }

    async createReview(reviewData) {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('reviews')
            .insert(reviewData)
            .select()
            .single();

        if (error) {
            console.error('Error creating review:', error);
            return { review: null, error };
        }

        return { success: true, review_id: data.id, review: data };
    }

    async canUserReviewDelivery(userId, deliveryId) {
        this.checkSupabase();

        // Проверяем, участвует ли пользователь в доставке
        const { data: delivery } = await supabase
            .from('deliveries')
            .select(`
                *,
                parcel:parcels(user_id)
            `)
            .eq('id', deliveryId)
            .single();

        if (!delivery) return { canReview: false, reason: 'Доставка не найдена' };
        if (delivery.status !== 'delivered') return { canReview: false, reason: 'Доставка еще не завершена' };

        // Проверяем, не оставлял ли пользователь отзыв уже
        const { data: existingReview } = await supabase
            .from('reviews')
            .select('id')
            .eq('delivery_id', deliveryId)
            .eq('reviewer_user_id', userId)
            .single();

        if (existingReview) return { canReview: false, reason: 'Вы уже оставили отзыв' };

        // Определяем кого можно оценить
        const isParcelOwner = delivery.parcel.user_id === userId;
        const isCarrier = delivery.carrier_user_id === userId;

        if (!isParcelOwner && !isCarrier) {
            return { canReview: false, reason: 'Вы не участвуете в этой доставке' };
        }

        const reviewedUserId = isParcelOwner ? delivery.carrier_user_id : delivery.parcel.user_id;

        return {
            canReview: true,
            reviewedUserId,
            role: isParcelOwner ? 'parcel_owner' : 'carrier'
        };
    }

    // ========================================
    // PLATFORM FEES (Комиссии)
    // ========================================

    async getPlatformFees(params = {}) {
        this.checkSupabase();
        let query = supabase
            .from('platform_fees')
            .select(`
                *,
                delivery:deliveries(
                    id,
                    parcel:parcels(title, reward),
                    carrier:users!carrier_user_id(full_name)
                )
            `)
            .order('created_at', { ascending: false });

        if (params.status) {
            query = query.eq('status', params.status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching platform fees:', error);
            return { fees: [], error };
        }

        return { fees: data || [], error: null };
    }

    async getTotalPlatformRevenue() {
        this.checkSupabase();
        const { data, error } = await supabase
            .from('platform_fees')
            .select('amount, status');

        if (error) {
            console.error('Error fetching revenue:', error);
            return { total: 0, pending: 0, paid: 0, error };
        }

        const total = data.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
        const paid = data.filter(f => f.status === 'paid').reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
        const pending = data.filter(f => f.status === 'pending').reduce((sum, fee) => sum + parseFloat(fee.amount), 0);

        return { total, paid, pending, error: null };
    }

    // ========================================
    // DEMO DATA INITIALIZATION
    // ========================================

    /**
     * Инициализация демо-данных для нового пользователя
     * Создает 2 поездки через неделю и 2 недели + отклики на них от других пользователей
     */
    async initializeDemoDataForUser(userId) {
        this.checkSupabase();

        try {
            console.log(`🎬 Initializing demo data for user ${userId}`);

            // 1. Проверяем, есть ли уже данные у пользователя
            const { trips: existingTrips } = await this.getUserTrips(userId);
            if (existingTrips && existingTrips.length > 0) {
                console.log('✅ User already has trips, skipping demo data initialization');
                return { success: true, skipped: true };
            }

            // 2. Получаем других пользователей для создания откликов
            const { data: otherUsers } = await supabase
                .from('users')
                .select('id, full_name')
                .neq('id', userId)
                .limit(3);

            if (!otherUsers || otherUsers.length < 2) {
                console.warn('⚠️ Not enough users in DB to create demo offers');
                // Создаем только поездки без откликов
                return await this.createDemoTripsOnly(userId);
            }

            // 3. Создаем 2 демо-поездки
            const now = new Date();
            const trip1Date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 дней
            const trip2Date = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 дней

            const demoTrips = [
                {
                    user_id: userId,
                    origin: 'Москва, Россия',
                    destination: 'Санкт-Петербург, Россия',
                    depart_at: trip1Date.toISOString(),
                    capacity_kg: 5,
                    price: 800.00,
                    flight_number: 'SU100',
                    comment: 'Регулярная поездка, могу взять посылки',
                    status: 'active'
                },
                {
                    user_id: userId,
                    origin: 'Санкт-Петербург, Россия',
                    destination: 'Казань, Россия',
                    depart_at: trip2Date.toISOString(),
                    capacity_kg: 3,
                    price: 600.00,
                    flight_number: 'S7250',
                    comment: 'Еду в командировку',
                    status: 'active'
                }
            ];

            const createdTripIds = [];
            for (const tripData of demoTrips) {
                const { trip } = await this.createTrip(tripData);
                if (trip) {
                    createdTripIds.push(trip.id);
                    console.log(`✅ Created demo trip ${trip.id}: ${trip.origin} → ${trip.destination}`);
                }
            }

            if (createdTripIds.length === 0) {
                console.error('❌ Failed to create demo trips');
                return { success: false, error: 'Failed to create trips' };
            }

            // 4. Создаем демо-посылки от других пользователей
            const demoParcels = [
                {
                    user_id: otherUsers[0].id,
                    title: 'Документы',
                    origin: 'Москва, Россия',
                    destination: 'Санкт-Петербург, Россия',
                    weight_kg: 0.5,
                    reward: 500.00,
                    pickup_address: 'Красная площадь',
                    delivery_address: 'Невский проспект',
                    description: 'Срочные документы',
                    status: 'open'
                },
                {
                    user_id: otherUsers[1].id,
                    title: 'Подарок',
                    origin: 'Санкт-Петербург, Россия',
                    destination: 'Казань, Россия',
                    weight_kg: 1.2,
                    reward: 700.00,
                    pickup_address: 'Центр города',
                    delivery_address: 'Кремль',
                    description: 'Сувениры для друзей',
                    status: 'open'
                }
            ];

            const createdParcelIds = [];
            for (const parcelData of demoParcels) {
                const { parcel } = await this.createParcel(parcelData);
                if (parcel) {
                    createdParcelIds.push({ id: parcel.id, userId: parcelData.user_id, reward: parcelData.reward });
                    console.log(`✅ Created demo parcel ${parcel.id}: ${parcel.title}`);
                }
            }

            // 5. Создаем отклики на поездки пользователя
            const demoOffers = [];

            // Отклик на первую поездку
            if (createdParcelIds.length > 0 && createdTripIds.length > 0) {
                demoOffers.push({
                    trip_id: createdTripIds[0],
                    parcel_id: createdParcelIds[0].id,
                    user_id: createdParcelIds[0].userId,
                    type: 'parcel_to_trip',
                    price: createdParcelIds[0].reward,
                    message: 'Здравствуйте! Можете взять мои документы? Очень срочно нужно!',
                    status: 'pending'
                });
            }

            // Если есть вторая посылка и вторая поездка
            if (createdParcelIds.length > 1 && createdTripIds.length > 1) {
                demoOffers.push({
                    trip_id: createdTripIds[1],
                    parcel_id: createdParcelIds[1].id,
                    user_id: createdParcelIds[1].userId,
                    type: 'parcel_to_trip',
                    price: createdParcelIds[1].reward,
                    message: 'Привет! Подходит ваша поездка для моего подарка?',
                    status: 'pending'
                });
            }

            // Если есть третий пользователь, создаем еще один отклик на первую поездку
            if (otherUsers.length > 2 && createdTripIds.length > 0) {
                // Создаем еще одну посылку от третьего пользователя
                const { parcel: extraParcel } = await this.createParcel({
                    user_id: otherUsers[2].id,
                    title: 'Сувениры',
                    origin: 'Москва, Россия',
                    destination: 'Санкт-Петербург, Россия',
                    weight_kg: 0.8,
                    reward: 600.00,
                    pickup_address: 'Тверская',
                    delivery_address: 'Эрмитаж',
                    description: 'Небольшие сувениры',
                    status: 'open'
                });

                if (extraParcel) {
                    demoOffers.push({
                        trip_id: createdTripIds[0],
                        parcel_id: extraParcel.id,
                        user_id: otherUsers[2].id,
                        type: 'parcel_to_trip',
                        price: 600.00,
                        message: 'Добрый день! Могу я отправить с вами сувениры?',
                        status: 'pending'
                    });
                }
            }

            // Создаем отклики
            let offersCreated = 0;
            for (const offerData of demoOffers) {
                const { success } = await this.createOffer(offerData);
                if (success) {
                    offersCreated++;
                    console.log(`✅ Created demo offer on trip ${offerData.trip_id}`);
                }
            }

            console.log(`🎉 Demo data initialization complete:
            - ${createdTripIds.length} trips created
            - ${createdParcelIds.length + (offersCreated > 2 ? 1 : 0)} parcels created
            - ${offersCreated} offers created`);

            return {
                success: true,
                stats: {
                    trips: createdTripIds.length,
                    parcels: createdParcelIds.length + (offersCreated > 2 ? 1 : 0),
                    offers: offersCreated
                }
            };

        } catch (error) {
            console.error('Error initializing demo data:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Fallback: создание только поездок без откликов
     * Используется когда в БД недостаточно других пользователей
     */
    async createDemoTripsOnly(userId) {
        try {
            const now = new Date();
            const trip1Date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            const { trip } = await this.createTrip({
                user_id: userId,
                origin: 'Москва, Россия',
                destination: 'Санкт-Петербург, Россия',
                depart_at: trip1Date.toISOString(),
                capacity_kg: 5,
                price: 800.00,
                comment: 'Первая поездка',
                status: 'active'
            });

            if (trip) {
                console.log('✅ Created fallback demo trip (no offers due to insufficient users)');
            }

            return {
                success: true,
                stats: { trips: trip ? 1 : 0, parcels: 0, offers: 0 }
            };
        } catch (error) {
            console.error('Error creating demo trip:', error);
            return { success: false, error: error.message };
        }
    }
}

export const supabaseApi = new SupabaseApiService();
export default supabaseApi;
