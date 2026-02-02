-- PeerPack Database Schema for Supabase
-- Based on db-schema.puml

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- ПОЛЬЗОВАТЕЛИ (Users)
-- ========================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    telegram_username TEXT,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);

-- ========================================
-- ПОСЫЛКИ (Parcels)
-- ========================================

CREATE TABLE parcels (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    weight_kg DECIMAL(6,2) NOT NULL,
    reward DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'delivered', 'cancelled')),
    pickup_address TEXT,
    delivery_address TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_parcels_user_id ON parcels(user_id);
CREATE INDEX idx_parcels_status ON parcels(status);
CREATE INDEX idx_parcels_route ON parcels(origin, destination);

-- ========================================
-- ПОЕЗДКИ (Trips)
-- ========================================

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    depart_at TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity_kg INTEGER NOT NULL,
    price DECIMAL(10,2),
    flight_number TEXT,
    comment TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_route ON trips(origin, destination);
CREATE INDEX idx_trips_depart_at ON trips(depart_at);

-- ========================================
-- ОТКЛИКИ (Offers)
-- ========================================

CREATE TABLE offers (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    parcel_id BIGINT NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('parcel_to_trip', 'trip_to_parcel')),
    price DECIMAL(10,2) NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'rejected', 'accepted')),
    is_viewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_offers_trip_id ON offers(trip_id);
CREATE INDEX idx_offers_parcel_id ON offers(parcel_id);
CREATE INDEX idx_offers_user_id ON offers(user_id);
CREATE INDEX idx_offers_status ON offers(status);

-- ========================================
-- ДОСТАВКИ (Deliveries)
-- ========================================

CREATE TABLE deliveries (
    id BIGSERIAL PRIMARY KEY,
    parcel_id BIGINT NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    carrier_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_transit', 'delivered')),
    pickup_time TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deliveries_parcel_id ON deliveries(parcel_id);
CREATE INDEX idx_deliveries_trip_id ON deliveries(trip_id);
CREATE INDEX idx_deliveries_carrier_user_id ON deliveries(carrier_user_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);


-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON parcels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update parcel status when delivery is created
CREATE OR REPLACE FUNCTION update_parcel_status_on_delivery()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE parcels
    SET status = 'assigned'
    WHERE id = NEW.parcel_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_parcel_assigned AFTER INSERT ON deliveries
    FOR EACH ROW EXECUTE FUNCTION update_parcel_status_on_delivery();

-- Auto-update parcel status when delivery is marked as delivered
CREATE OR REPLACE FUNCTION update_parcel_on_delivery_complete()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE parcels
        SET status = 'delivered'
        WHERE id = NEW.parcel_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER mark_parcel_delivered AFTER UPDATE ON deliveries
    FOR EACH ROW EXECUTE FUNCTION update_parcel_on_delivery_complete();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- Правильные политики для Telegram Mini App
-- ========================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Users policies
-- ========================================
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their profile" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their profile" ON users
    FOR UPDATE USING (true);

-- ========================================
-- Parcels policies
-- ========================================
-- Все могут видеть открытые посылки
CREATE POLICY "Anyone can view open parcels" ON parcels
    FOR SELECT USING (status = 'open' OR status = 'assigned');

-- Пользователи могут видеть свои посылки (любого статуса)
CREATE POLICY "Users can view own parcels" ON parcels
    FOR SELECT USING (true);

-- Пользователи могут создавать посылки
CREATE POLICY "Users can insert parcels" ON parcels
    FOR INSERT WITH CHECK (true);

-- Пользователи могут обновлять свои посылки
CREATE POLICY "Users can update own parcels" ON parcels
    FOR UPDATE USING (true);

-- Пользователи могут удалять свои посылки
CREATE POLICY "Users can delete own parcels" ON parcels
    FOR DELETE USING (true);

-- ========================================
-- Trips policies
-- ========================================
-- Все могут видеть активные поездки
CREATE POLICY "Anyone can view active trips" ON trips
    FOR SELECT USING (status = 'active' AND depart_at > NOW() - INTERVAL '1 day');

-- Пользователи могут видеть свои поездки (любого статуса)
CREATE POLICY "Users can view own trips" ON trips
    FOR SELECT USING (true);

-- Пользователи могут создавать поездки
CREATE POLICY "Users can insert trips" ON trips
    FOR INSERT WITH CHECK (true);

-- Пользователи могут обновлять свои поездки
CREATE POLICY "Users can update own trips" ON trips
    FOR UPDATE USING (true);

-- Пользователи могут удалять свои поездки
CREATE POLICY "Users can delete own trips" ON trips
    FOR DELETE USING (true);

-- ========================================
-- Offers policies
-- ========================================
-- Владельцы посылок могут видеть отклики на их посылки
CREATE POLICY "Parcel owners can view offers" ON offers
    FOR SELECT USING (
        parcel_id IN (SELECT id FROM parcels)
    );

-- Владельцы поездок могут видеть отклики на их поездки
CREATE POLICY "Trip owners can view offers" ON offers
    FOR SELECT USING (
        trip_id IN (SELECT id FROM trips)
    );

-- Авторы откликов могут видеть свои отклики
CREATE POLICY "Users can view own offers" ON offers
    FOR SELECT USING (true);

-- Пользователи могут создавать отклики
CREATE POLICY "Users can create offers" ON offers
    FOR INSERT WITH CHECK (true);

-- Владельцы посылок могут обновлять отклики на их посылки
CREATE POLICY "Parcel owners can update offers" ON offers
    FOR UPDATE USING (
        parcel_id IN (SELECT id FROM parcels)
    );

-- Владельцы поездок могут обновлять отклики на их поездки
CREATE POLICY "Trip owners can update offers" ON offers
    FOR UPDATE USING (
        trip_id IN (SELECT id FROM trips)
    );

-- ========================================
-- Deliveries policies
-- ========================================
-- Владельцы посылок могут видеть доставки
CREATE POLICY "Parcel owners can view deliveries" ON deliveries
    FOR SELECT USING (
        parcel_id IN (SELECT id FROM parcels)
    );

-- Курьеры могут видеть свои доставки
CREATE POLICY "Carriers can view deliveries" ON deliveries
    FOR SELECT USING (true);

-- Система может создавать доставки
CREATE POLICY "System can create deliveries" ON deliveries
    FOR INSERT WITH CHECK (true);

-- Курьеры могут обновлять свои доставки
CREATE POLICY "Carriers can update deliveries" ON deliveries
    FOR UPDATE USING (true);

-- ========================================
-- SEED DATA (Minimal - for testing)
-- ========================================

-- Insert test users (4 users)
INSERT INTO users (telegram_id, telegram_username, full_name, avatar_url, rating)
VALUES
    (123456789, 'nikita_user', 'Никита Иванов', 'https://i.pravatar.cc/100?img=50', 5.0),
    (987654321, 'ivan_courier', 'Иван Петров', 'https://i.pravatar.cc/100?img=12', 4.9),
    (555555555, 'elena_travel', 'Елена Смирнова', 'https://i.pravatar.cc/100?img=44', 4.8),
    (111222333, 'maxim_student', 'Максим Соколов', 'https://i.pravatar.cc/100?img=68', 4.6);

-- Insert test trips (only from users 2, 3, 4)
INSERT INTO trips (user_id, origin, destination, depart_at, capacity_kg, price, flight_number, comment, status)
VALUES
    (2, 'Москва, Россия', 'Санкт-Петербург, Россия', NOW() + INTERVAL '3 hours', 5, 800.00, 'SU123', 'Лечу по работе, могу взять документы', 'active'),
    (3, 'Москва, Россия', 'Казань, Россия', NOW() + INTERVAL '1 day', 7, 900.00, 'S7200', 'Есть место для посылок', 'active'),
    (4, 'Санкт-Петербург, Россия', 'Москва, Россия', NOW() + INTERVAL '2 days', 5, 600.00, 'S7890', 'Обратный рейс', 'active');

-- Insert test parcels (all from user 1)
INSERT INTO parcels (user_id, title, origin, destination, weight_kg, reward, pickup_address, delivery_address, description, status)
VALUES
    (1, 'Документы в папке', 'Москва, Россия', 'Санкт-Петербург, Россия', 0.5, 800.00, 'Шереметьево, терминал D', 'Пулково, зал прилета', 'Срочно нужно передать документы', 'open'),
    (1, 'Сувениры', 'Москва, Россия', 'Казань, Россия', 1.5, 600.00, 'Красная площадь', 'Казанский Кремль', 'Небольшая коробка с сувенирами', 'open'),
    (1, 'Подарок другу', 'Санкт-Петербург, Россия', 'Москва, Россия', 1.0, 500.00, 'Невский проспект, 1', 'Тверская, 10', 'День рождения', 'open');

-- Insert test offers (user 1 responds to trips)
INSERT INTO offers (trip_id, parcel_id, user_id, type, price, message, status, is_viewed, created_at)
VALUES
    -- User 1 откликается на поездку user 2
    (1, 1, 1, 'parcel_to_trip', 800.00, 'Добрый день! Нужно срочно доставить документы', 'pending', FALSE, NOW() - INTERVAL '1 hour'),
    -- User 1 откликается на поездку user 3
    (2, 2, 1, 'parcel_to_trip', 600.00, 'Можете взять мои сувениры?', 'pending', FALSE, NOW() - INTERVAL '30 minutes');
