import { useState, useEffect } from 'react';
import { supabaseApi } from '../services/supabaseApi';
import { useUser } from '../shared/context/UserContext';

export const useUserData = () => {
    const { user } = useUser();
    const [packages, setPackages] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUserData = async () => {
        if (!user?.id) {
            console.log('User not loaded yet, skipping data fetch');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const [packagesResponse, tripsResponse] = await Promise.all([
                supabaseApi.getUserParcels(user.id),
                supabaseApi.getUserTrips(user.id)
            ]);

            setPackages(packagesResponse.parcels || []);
            setTrips(tripsResponse.trips || []);
        } catch (err) {
            setError(err.message);
            console.error('Error loading user data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, [user?.id]);

    const refreshUserData = () => loadUserData();

    return {
        packages,
        setPackages,
        trips,
        setTrips,
        loading,
        error,
        refreshUserData
    };
};

export const useTripRequests = (tripId) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadRequests = async () => {
        if (!tripId) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await supabaseApi.getOffersForTrip(tripId);
            setRequests(response.offers || []);
        } catch (err) {
            setError(err.message);
            console.error('Error loading trip requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [tripId]);

    const acceptRequest = async (offerId) => {
        try {
            await supabaseApi.updateOfferStatus(offerId, 'accepted');
            setRequests(prev => prev.map(req =>
                req.id === offerId ? {...req, status: 'accepted'} : req
            ));
        } catch (err) {
            console.error('Error accepting request:', err);
            throw err;
        }
    };

    const markDelivered = async (deliveryId) => {
        try {
            await supabaseApi.updateDeliveryStatus(deliveryId, 'delivered');
            // Reload requests to reflect changes
            await loadRequests();
        } catch (err) {
            console.error('Error marking delivered:', err);
            throw err;
        }
    };

    return {
        requests,
        setRequests,
        loading,
        error,
        acceptRequest,
        markDelivered,
        refreshRequests: loadRequests
    };
};

export const useCourierSearch = () => {
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const searchCouriers = async (searchParams) => {
        try {
            setLoading(true);
            setError(null);
            const response = await supabaseApi.getTrips(searchParams);
            setCouriers(response.trips || []);
            return response.trips || [];
        } catch (err) {
            setError(err.message);
            console.error('Ошибка поиска курьеров:', err);
            return [];
        } finally {
            setLoading(false);
        }
    };
    
    return {
        couriers,
        setCouriers,
        loading,
        error,
        searchCouriers
    };
};

export const usePackageActions = () => {
    const { user } = useUser();

    const createPackage = async (packageData) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await supabaseApi.createParcel({
                ...packageData,
                user_id: user.id
            });
            return response;
        } catch (err) {
            console.error('Error creating package:', err);
            throw err;
        }
    };

    const createTrip = async (tripData) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await supabaseApi.createTrip({
                ...tripData,
                user_id: user.id
            });
            return response;
        } catch (err) {
            console.error('Error creating trip:', err);
            throw err;
        }
    };

    const sendPackageToCourier = async (tripId, parcelId, offerData) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await supabaseApi.createOffer({
                trip_id: tripId,
                parcel_id: parcelId,
                user_id: user.id,
                ...offerData
            });
            return response;
        } catch (err) {
            console.error('Error sending package to courier:', err);
            throw err;
        }
    };

    return {
        createPackage,
        createTrip,
        sendPackageToCourier
    };
};