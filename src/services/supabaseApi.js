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
                user:users(id, full_name, telegram_username, avatar_url, rating)
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
                user:users(id, full_name, telegram_username, avatar_url, rating)
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
            .update({ status })
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
}

export const supabaseApi = new SupabaseApiService();
export default supabaseApi;
