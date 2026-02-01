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
    (555555555, 'elena_travel', 'Елена Смирнова', 'https://i.pravatar.cc/100?img=44', 4.8),
    (111222333, 'maxim_student', 'Максим Соколов', 'https://i.pravatar.cc/100?img=68', 4.6),
    (444555666, 'anastasia_premium', 'Анастасия Волкова', 'https://i.pravatar.cc/100?img=31', 5.0),
    (777888999, 'dmitry_early', 'Дмитрий Орлов', 'https://i.pravatar.cc/100?img=17', 4.7),
    (222333444, 'anna_petrova', 'Анна Петрова', 'https://i.pravatar.cc/100?img=25', 4.9),
    (333444555, 'igor_smirnov', 'Игорь Смирнов', 'https://i.pravatar.cc/100?img=15', 4.8),
    (666777888, 'maria_kozlova', 'Мария Козлова', 'https://i.pravatar.cc/100?img=32', 5.0),
    (888999000, 'petr_ivanov', 'Петр Иванов', 'https://i.pravatar.cc/100?img=18', 4.7),
    (999000111, 'elena_volkova', 'Елена Волкова', 'https://i.pravatar.cc/100?img=41', 4.9),
    (100200300, 'oleg_courier', 'Олег Смирнов', 'https://i.pravatar.cc/100?img=22', 4.8);

-- Insert test trips
INSERT INTO trips (user_id, origin, destination, depart_at, capacity_kg, price_per_kg, description, status)
VALUES
    (2, 'Москва, Россия', 'Санкт-Петербург, Россия', NOW() + INTERVAL '3 hours', 5, 160.00, 'Лечу по работе, могу взять документы или небольшие посылки', 'active'),
    (3, 'Москва, Россия', 'Санкт-Петербург, Россия', NOW() + INTERVAL '5 hours', 3, 400.00, 'Утренний рейс, удобно для срочных доставок. Место только для документов', 'active'),
    (4, 'Москва, Россия', 'Санкт-Петербург, Россия', NOW() + INTERVAL '8 hours', 5, 120.00, 'Студент, летаю часто к родителям. Недорого, но надежно!', 'active'),
    (5, 'Москва, Россия', 'Санкт-Петербург, Россия', NOW() + INTERVAL '12 hours', 10, 150.00, 'Премиум доставка. Фото отчеты, трекинг, страховка включена', 'active'),
    (6, 'Москва, Россия', 'Санкт-Петербург, Россия', NOW() + INTERVAL '1 day', 2, 450.00, 'Самый ранний рейс. Беру только легкие посылки до 2кг', 'active'),
    (1, 'Москва, Россия', 'Казань, Россия', NOW() + INTERVAL '2 days', 7, 128.57, 'Командировка, есть место для документов и небольших посылок', 'active'),
    (12, 'Санкт-Петербург, Россия', 'Казань, Россия', NOW() - INTERVAL '2 days', 8, 75.00, 'Обратный рейс после командировки', 'completed'),
    (2, 'Москва, Россия', 'Дубай, ОАЭ', NOW() + INTERVAL '5 days', 10, 50.00, 'Лечу по работе, могу взять посылки', 'active'),
    (3, 'Санкт-Петербург, Россия', 'Стамбул, Турция', NOW() + INTERVAL '7 days', 5, 45.00, 'Есть место для документов', 'active');

-- Insert test parcels
INSERT INTO parcels (user_id, title, origin, destination, weight_kg, reward, pickup_address, delivery_address, description, status)
VALUES
    -- Open parcels
    (1, 'Документы в папке', 'Москва, Россия', 'Санкт-Петербург, Россия', 0.5, 800.00, 'Шереметьево, терминал D', 'Пулково, зал прилета', 'Срочно нужно передать документы в офис', 'open'),
    (7, 'Маленькая коробка с сувенирами', 'Москва, Россия', 'Казань, Россия', 1.5, 600.00, 'Красная площадь, у ГУМа', 'Казанский Кремль, касса', 'Привезти сувениры из командировки', 'open'),
    (9, 'Лекарства', 'Москва, Россия', 'Казань, Россия', 0.8, 1000.00, 'Аптека на Тверской, 15', 'Больница №7, регистратура', 'Очень важные лекарства для бабушки', 'open'),
    (11, 'Подарок - часы Apple Watch', 'Москва, Россия', 'Казань, Россия', 0.3, 1200.00, 'Apple Store на Тверской', 'Казанский вокзал, встреча у часов', 'День рождения у друга, очень важно доставить вовремя!', 'open'),

    -- Assigned parcels
    (10, 'Флешка с данными', 'Москва, Россия', 'Казань, Россия', 0.05, 500.00, 'Офис на Садовом кольце', 'БЦ Сенатор, офис 305', 'Важные рабочие файлы', 'assigned'),
    (8, 'Контракты и печать компании', 'Москва, Россия', 'Казань, Россия', 0.7, 1500.00, 'БЦ Москва-Сити, башня Федерация', 'Аэропорт Казань, зона вылета', 'Срочные документы для подписания сделки', 'assigned'),

    -- Delivered parcels
    (7, 'Медикаменты для клиники', 'Москва, Россия', 'Казань, Россия', 2.0, 1000.00, 'Аптека 36.6 на Тверской', 'Больница №7, регистратура', 'Медикаменты для клиники', 'delivered'),
    (1, 'Книги и учебники', 'Санкт-Петербург, Россия', 'Казань, Россия', 3.5, 600.00, 'Дом книги на Невском', 'КФУ, библиотека', 'Учебники для университета', 'delivered'),

    -- International parcels
    (1, 'Документы для визы', 'Москва, Россия', 'Дубай, ОАЭ', 0.5, 1500.00, 'ул. Тверская, 1', 'Dubai Mall', 'Срочные документы для получения визы', 'open'),
    (1, 'Подарок другу', 'Санкт-Петербург, Россия', 'Стамбул, Турция', 2.0, 800.00, 'Красная площадь', 'Sultanahmet', 'Небольшой подарок на день рождения', 'open');

-- Insert test offers
INSERT INTO offers (trip_id, parcel_id, user_id, type, price, message, status, created_at)
VALUES
    -- Pending offers (посылки откликаются на поездки)
    (6, 1, 1, 'parcel_to_trip', 800.00, 'Добрый день! Нужно срочно доставить документы', 'pending', NOW() - INTERVAL '1 day'),
    (6, 4, 11, 'parcel_to_trip', 1200.00, 'День рождения у друга, очень важно доставить вовремя!', 'pending', NOW() - INTERVAL '5 hours'),

    -- Accepted offers (поездки откликаются на посылки)
    (6, 2, 1, 'trip_to_parcel', 600.00, 'Могу взять вашу посылку, летаю регулярно', 'accepted', NOW() - INTERVAL '2 days'),
    (6, 5, 1, 'trip_to_parcel', 500.00, 'Легкая посылка, без проблем доставлю', 'accepted', NOW() - INTERVAL '3 days'),
    (3, 1, 3, 'trip_to_parcel', 800.00, 'Утренний рейс, быстрая доставка гарантирована', 'accepted', NOW() - INTERVAL '2 hours'),

    -- Rejected offers
    (5, 3, 4, 'trip_to_parcel', 1000.00, 'Могу взять лекарства', 'rejected', NOW() - INTERVAL '1 day'),

    -- Completed offers (для delivered посылок)
    (7, 8, 12, 'trip_to_parcel', 600.00, 'Еду в Казань, могу доставить книги', 'accepted', NOW() - INTERVAL '5 days'),
    (7, 7, 12, 'trip_to_parcel', 1000.00, 'Аккуратно доставлю медикаменты', 'accepted', NOW() - INTERVAL '4 days');

-- Insert test deliveries
INSERT INTO deliveries (parcel_id, trip_id, carrier_user_id, status, pickup_time, delivery_time, created_at)
VALUES
    -- In transit deliveries
    (5, 6, 1, 'in_transit', NOW() - INTERVAL '2 hours', NULL, NOW() - INTERVAL '3 days'),
    (2, 6, 1, 'assigned', NULL, NULL, NOW() - INTERVAL '2 days'),
    (6, 6, 1, 'assigned', NULL, NULL, NOW() - INTERVAL '1 day'),

    -- Delivered
    (8, 7, 12, 'delivered', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days'),
    (7, 7, 12, 'delivered', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days');
