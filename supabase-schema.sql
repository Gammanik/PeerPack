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
    price_per_kg DECIMAL(10,2),
    description TEXT,
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
-- ========================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = telegram_id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = telegram_id::text);

-- Parcels policies
CREATE POLICY "Anyone can view open parcels" ON parcels
    FOR SELECT USING (status = 'open');

CREATE POLICY "Users can view own parcels" ON parcels
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Users can insert own parcels" ON parcels
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Users can update own parcels" ON parcels
    FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Users can delete own parcels" ON parcels
    FOR DELETE USING (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

-- Trips policies
CREATE POLICY "Anyone can view active trips" ON trips
    FOR SELECT USING (status = 'active' AND depart_at > NOW());

CREATE POLICY "Users can view own trips" ON trips
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Users can insert own trips" ON trips
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Users can update own trips" ON trips
    FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Users can delete own trips" ON trips
    FOR DELETE USING (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

-- Offers policies
CREATE POLICY "Users can view offers for their parcels" ON offers
    FOR SELECT USING (
        parcel_id IN (
            SELECT id FROM parcels WHERE user_id IN (
                SELECT id FROM users WHERE telegram_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Users can view offers for their trips" ON offers
    FOR SELECT USING (
        trip_id IN (
            SELECT id FROM trips WHERE user_id IN (
                SELECT id FROM users WHERE telegram_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Users can view own offers" ON offers
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Users can create offers" ON offers
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "Parcel owners can update offers" ON offers
    FOR UPDATE USING (
        parcel_id IN (
            SELECT id FROM parcels WHERE user_id IN (
                SELECT id FROM users WHERE telegram_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Trip owners can update offers" ON offers
    FOR UPDATE USING (
        trip_id IN (
            SELECT id FROM trips WHERE user_id IN (
                SELECT id FROM users WHERE telegram_id::text = auth.uid()::text
            )
        )
    );

-- Deliveries policies
CREATE POLICY "Users can view deliveries for their parcels" ON deliveries
    FOR SELECT USING (
        parcel_id IN (
            SELECT id FROM parcels WHERE user_id IN (
                SELECT id FROM users WHERE telegram_id::text = auth.uid()::text
            )
        )
    );

CREATE POLICY "Carriers can view their deliveries" ON deliveries
    FOR SELECT USING (carrier_user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

CREATE POLICY "System can create deliveries" ON deliveries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Carriers can update their deliveries" ON deliveries
    FOR UPDATE USING (carrier_user_id IN (SELECT id FROM users WHERE telegram_id::text = auth.uid()::text));

-- ========================================
-- SEED DATA (Optional - for testing)
-- ========================================

-- Insert test users
INSERT INTO users (telegram_id, telegram_username, full_name, avatar_url, rating)
VALUES
    (123456789, 'nikita_user', 'Никита Иванов', 'https://i.pravatar.cc/100?img=50', 5.0),
    (987654321, 'ivan_courier', 'Иван Петров', 'https://i.pravatar.cc/100?img=12', 4.9),
    (555555555, 'elena_travel', 'Елена Смирнова', 'https://i.pravatar.cc/100?img=44', 4.8);

-- Insert test trips
INSERT INTO trips (user_id, origin, destination, depart_at, capacity_kg, price_per_kg, description)
VALUES
    (2, 'Москва, Россия', 'Дубай, ОАЭ', NOW() + INTERVAL '5 days', 10, 50.00, 'Лечу по работе, могу взять посылки'),
    (3, 'Санкт-Петербург, Россия', 'Стамбул, Турция', NOW() + INTERVAL '3 days', 5, 45.00, 'Есть место для документов');

-- Insert test parcels
INSERT INTO parcels (user_id, title, origin, destination, weight_kg, reward, description, pickup_address, delivery_address)
VALUES
    (1, 'Документы для визы', 'Москва, Россия', 'Дубай, ОАЭ', 0.5, 1500.00, 'Срочные документы для получения визы', 'ул. Тверская, 1', 'Dubai Mall'),
    (1, 'Подарок другу', 'Москва, Россия', 'Стамбул, Турция', 2.0, 800.00, 'Небольшой подарок на день рождения', 'Красная площадь', 'Sultanahmet');
