import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useUserData = () => {
    const [packages, setPackages] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [packagesResponse, tripsResponse] = await Promise.all([
                apiService.getUserPackages(),
                apiService.getUserTrips()
            ]);
            
            setPackages(packagesResponse.packages || []);
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
    }, []);

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
            const response = await apiService.getTripPackageRequests(tripId);
            setRequests(response.requests || []);
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

    const acceptRequest = async (requestId) => {
        try {
            await apiService.acceptPackageRequest(requestId);
            setRequests(prev => prev.map(req => 
                req.id === requestId ? {...req, status: 'accepted'} : req
            ));
        } catch (err) {
            console.error('Error accepting request:', err);
            throw err;
        }
    };

    const markDelivered = async (requestId) => {
        try {
            await apiService.markPackageDelivered(requestId);
            setRequests(prev => prev.map(req => 
                req.id === requestId ? {...req, status: 'delivered'} : req
            ));
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
            const response = await apiService.getCouriers(searchParams);
            setCouriers(response.couriers || []);
            return response.couriers || [];
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
    const createPackage = async (packageData) => {
        try {
            const response = await apiService.createPackage(packageData);
            return response;
        } catch (err) {
            console.error('Error creating package:', err);
            throw err;
        }
    };

    const createTrip = async (tripData) => {
        try {
            const response = await apiService.createTrip(tripData);
            return response;
        } catch (err) {
            console.error('Error creating trip:', err);
            throw err;
        }
    };

    const sendPackageToCourier = async (courierId, packageData) => {
        try {
            const response = await apiService.sendPackageToCourier(courierId, packageData);
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