-- =================================================================================
-- Aurora Grand Hotel — Development Seed Data
-- 
-- Execution: make seed
-- Uses ON CONFLICT DO UPDATE/NOTHING for idempotency (safe to run multiple times)
-- =================================================================================
\set ON_ERROR_STOP 1

BEGIN;

-- ---------------------------------------------------------
-- 1. Hotel
-- ---------------------------------------------------------
INSERT INTO hotels (id, name, slug, description, address, city, country, latitude, longitude)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'AURORA GRAND HOTEL',
    'aurora-grand-hotel',
    'Experience ultimate luxury and comfort at Aurora Grand Hotel, featuring stunning ocean views and premium suites.',
    '123 Ocean Drive, Paradise Beach',
    'Phuket',
    'Thailand',
    7.8964,
    98.2965
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    updated_at = NOW();

-- ---------------------------------------------------------
-- 2. Floors
-- ---------------------------------------------------------
-- Using CTE to map hotel_id dynamically for safety (even though we hardcoded the hotel UUID, 
-- this demonstrates stable mapping).
WITH hotel AS (SELECT id FROM hotels WHERE slug = 'aurora-grand-hotel')
INSERT INTO floors (id, hotel_id, floor_number, name, description)
SELECT 
    f.id, h.id, f.floor_number, f.name, f.description
FROM hotel h
CROSS JOIN (
    VALUES 
        ('00000000-0000-0000-0001-000000000001'::uuid, 1, 'Floor 1', 'Lobby & Deluxe Rooms'),
        ('00000000-0000-0000-0001-000000000002'::uuid, 2, 'Floor 2', 'Deluxe Collection'),
        ('00000000-0000-0000-0001-000000000003'::uuid, 3, 'Floor 3', 'Deluxe Collection'),
        ('00000000-0000-0000-0001-000000000004'::uuid, 4, 'Floor 4', 'Premier Rooms'),
        ('00000000-0000-0000-0001-000000000005'::uuid, 5, 'Floor 5', 'Premier Rooms'),
        ('00000000-0000-0000-0001-000000000006'::uuid, 6, 'Floor 6', 'Ocean Collection'),
        ('00000000-0000-0000-0001-000000000007'::uuid, 7, 'Floor 7', 'Executive Collection'),
        ('00000000-0000-0000-0001-000000000008'::uuid, 8, 'Floor 8', 'Signature Suites')
) AS f(id, floor_number, name, description)
ON CONFLICT (hotel_id, floor_number) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ---------------------------------------------------------
-- 3. Room Types
-- ---------------------------------------------------------
WITH hotel AS (SELECT id FROM hotels WHERE slug = 'aurora-grand-hotel')
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_guests, bed_type, room_size)
SELECT 
    rt.id, h.id, rt.name, rt.description, rt.base_price, rt.max_guests, rt.bed_type, rt.room_size
FROM hotel h
CROSS JOIN (
    VALUES
        ('00000000-0000-0000-0002-000000000001'::uuid, 'Deluxe King', 'Spacious room with a king-size bed and modern amenities.', 4500.00, 2, 'King', 32),
        ('00000000-0000-0000-0002-000000000002'::uuid, 'Premier Twin', 'Comfortable room with twin beds, perfect for friends or family.', 5200.00, 2, 'Twin', 36),
        ('00000000-0000-0000-0002-000000000003'::uuid, 'Ocean View Suite', 'Luxurious suite featuring a private balcony and stunning ocean views.', 7900.00, 3, 'King', 48),
        ('00000000-0000-0000-0002-000000000004'::uuid, 'Executive Suite', 'Premium suite with a separate living area and exclusive lounge access.', 10500.00, 3, 'King', 62),
        ('00000000-0000-0000-0002-000000000005'::uuid, 'Presidential Suite', 'The ultimate luxury experience offering panoramic ocean views and lavish space.', 25000.00, 4, 'King', 120)
) AS rt(id, name, description, base_price, max_guests, bed_type, room_size)
ON CONFLICT (hotel_id, name) DO UPDATE SET
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    max_guests = EXCLUDED.max_guests,
    bed_type = EXCLUDED.bed_type,
    room_size = EXCLUDED.room_size,
    updated_at = NOW();

-- ---------------------------------------------------------
-- 4. Rooms (exactly 50 rooms)
-- ---------------------------------------------------------
WITH 
h AS (SELECT id FROM hotels WHERE slug = 'aurora-grand-hotel'),
rt_dk AS (SELECT id FROM room_types WHERE name = 'Deluxe King' AND hotel_id = (SELECT id FROM h)),
rt_pt AS (SELECT id FROM room_types WHERE name = 'Premier Twin' AND hotel_id = (SELECT id FROM h)),
rt_os AS (SELECT id FROM room_types WHERE name = 'Ocean View Suite' AND hotel_id = (SELECT id FROM h)),
rt_es AS (SELECT id FROM room_types WHERE name = 'Executive Suite' AND hotel_id = (SELECT id FROM h)),
rt_ps AS (SELECT id FROM room_types WHERE name = 'Presidential Suite' AND hotel_id = (SELECT id FROM h)),
f1 AS (SELECT id FROM floors WHERE floor_number = 1 AND hotel_id = (SELECT id FROM h)),
f2 AS (SELECT id FROM floors WHERE floor_number = 2 AND hotel_id = (SELECT id FROM h)),
f3 AS (SELECT id FROM floors WHERE floor_number = 3 AND hotel_id = (SELECT id FROM h)),
f4 AS (SELECT id FROM floors WHERE floor_number = 4 AND hotel_id = (SELECT id FROM h)),
f5 AS (SELECT id FROM floors WHERE floor_number = 5 AND hotel_id = (SELECT id FROM h)),
f6 AS (SELECT id FROM floors WHERE floor_number = 6 AND hotel_id = (SELECT id FROM h)),
f7 AS (SELECT id FROM floors WHERE floor_number = 7 AND hotel_id = (SELECT id FROM h)),
f8 AS (SELECT id FROM floors WHERE floor_number = 8 AND hotel_id = (SELECT id FROM h))
INSERT INTO rooms (floor_id, room_type_id, room_number, status, model_key)
SELECT floor_id, room_type_id, room_number, status, model_key
FROM (
    -- Floor 1 (6 rooms)
    SELECT (SELECT id FROM f1) AS floor_id, (SELECT id FROM rt_dk) AS room_type_id, '101' AS room_number, 'available' AS status, 'deluxe-king-v1' AS model_key UNION ALL
    SELECT (SELECT id FROM f1), (SELECT id FROM rt_dk), '102', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f1), (SELECT id FROM rt_dk), '103', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f1), (SELECT id FROM rt_pt), '104', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f1), (SELECT id FROM rt_pt), '105', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f1), (SELECT id FROM rt_pt), '106', 'available', 'premier-twin-v1' UNION ALL
    
    -- Floor 2 (7 rooms)
    SELECT (SELECT id FROM f2), (SELECT id FROM rt_dk), '201', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f2), (SELECT id FROM rt_dk), '202', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f2), (SELECT id FROM rt_dk), '203', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f2), (SELECT id FROM rt_dk), '204', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f2), (SELECT id FROM rt_pt), '205', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f2), (SELECT id FROM rt_pt), '206', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f2), (SELECT id FROM rt_pt), '207', 'available', 'premier-twin-v1' UNION ALL

    -- Floor 3 (7 rooms)
    SELECT (SELECT id FROM f3), (SELECT id FROM rt_dk), '301', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f3), (SELECT id FROM rt_dk), '302', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f3), (SELECT id FROM rt_dk), '303', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f3), (SELECT id FROM rt_dk), '304', 'available', 'deluxe-king-v1' UNION ALL
    SELECT (SELECT id FROM f3), (SELECT id FROM rt_pt), '305', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f3), (SELECT id FROM rt_pt), '306', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f3), (SELECT id FROM rt_pt), '307', 'available', 'premier-twin-v1' UNION ALL

    -- Floor 4 (7 rooms)
    SELECT (SELECT id FROM f4), (SELECT id FROM rt_pt), '401', 'maintenance', 'premier-twin-v1' UNION ALL -- 1 maintenance
    SELECT (SELECT id FROM f4), (SELECT id FROM rt_pt), '402', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f4), (SELECT id FROM rt_pt), '403', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f4), (SELECT id FROM rt_pt), '404', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f4), (SELECT id FROM rt_os), '405', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f4), (SELECT id FROM rt_os), '406', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f4), (SELECT id FROM rt_os), '407', 'available', 'ocean-view-suite-v1' UNION ALL

    -- Floor 5 (7 rooms)
    SELECT (SELECT id FROM f5), (SELECT id FROM rt_pt), '501', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f5), (SELECT id FROM rt_pt), '502', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f5), (SELECT id FROM rt_pt), '503', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f5), (SELECT id FROM rt_pt), '504', 'available', 'premier-twin-v1' UNION ALL
    SELECT (SELECT id FROM f5), (SELECT id FROM rt_os), '505', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f5), (SELECT id FROM rt_os), '506', 'disabled', 'ocean-view-suite-v1' UNION ALL -- 1 disabled
    SELECT (SELECT id FROM f5), (SELECT id FROM rt_os), '507', 'available', 'ocean-view-suite-v1' UNION ALL

    -- Floor 6 (6 rooms)
    SELECT (SELECT id FROM f6), (SELECT id FROM rt_os), '601', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f6), (SELECT id FROM rt_os), '602', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f6), (SELECT id FROM rt_os), '603', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f6), (SELECT id FROM rt_es), '604', 'available', 'executive-suite-v1' UNION ALL
    SELECT (SELECT id FROM f6), (SELECT id FROM rt_es), '605', 'available', 'executive-suite-v1' UNION ALL
    SELECT (SELECT id FROM f6), (SELECT id FROM rt_es), '606', 'available', 'executive-suite-v1' UNION ALL

    -- Floor 7 (6 rooms)
    SELECT (SELECT id FROM f7), (SELECT id FROM rt_os), '701', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f7), (SELECT id FROM rt_os), '702', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f7), (SELECT id FROM rt_os), '703', 'available', 'ocean-view-suite-v1' UNION ALL
    SELECT (SELECT id FROM f7), (SELECT id FROM rt_es), '704', 'available', 'executive-suite-v1' UNION ALL
    SELECT (SELECT id FROM f7), (SELECT id FROM rt_es), '705', 'available', 'executive-suite-v1' UNION ALL
    SELECT (SELECT id FROM f7), (SELECT id FROM rt_es), '706', 'available', 'executive-suite-v1' UNION ALL

    -- Floor 8 (4 rooms)
    SELECT (SELECT id FROM f8), (SELECT id FROM rt_es), '801', 'available', 'executive-suite-v1' UNION ALL
    SELECT (SELECT id FROM f8), (SELECT id FROM rt_es), '802', 'available', 'executive-suite-v1' UNION ALL
    SELECT (SELECT id FROM f8), (SELECT id FROM rt_ps), '803', 'available', 'presidential-suite-v1' UNION ALL
    SELECT (SELECT id FROM f8), (SELECT id FROM rt_ps), '804', 'available', 'presidential-suite-v1'
) AS rooms_to_insert
ON CONFLICT (floor_id, room_number) DO UPDATE SET
    room_type_id = EXCLUDED.room_type_id,
    status = EXCLUDED.status,
    model_key = EXCLUDED.model_key,
    updated_at = NOW();

-- ---------------------------------------------------------
-- 5. Amenities
-- ---------------------------------------------------------
INSERT INTO amenities (name, icon)
VALUES
    ('Wi-Fi', 'wifi'),
    ('Air Conditioning', 'air-conditioning'),
    ('Smart TV', 'tv'),
    ('Bathtub', 'bath'),
    ('Breakfast', 'utensils'),
    ('Balcony', 'balcony'),
    ('Ocean View', 'waves'),
    ('Room Service', 'concierge-bell')
ON CONFLICT (name) DO UPDATE SET
    icon = EXCLUDED.icon;

-- ---------------------------------------------------------
-- 6. Room Amenities Mapping
-- ---------------------------------------------------------
WITH 
h AS (SELECT id FROM hotels WHERE slug = 'aurora-grand-hotel'),
room_mapping AS (
    SELECT r.id AS room_id, rt.name AS room_type_name
    FROM rooms r
    JOIN room_types rt ON rt.id = r.room_type_id
    WHERE rt.hotel_id = (SELECT id FROM h)
),
mappings AS (
    -- Deluxe King
    SELECT rm.room_id, a.id AS amenity_id FROM room_mapping rm CROSS JOIN amenities a 
    WHERE rm.room_type_name = 'Deluxe King' AND a.name IN ('Wi-Fi', 'Air Conditioning', 'Smart TV', 'Breakfast', 'Room Service')
    UNION ALL
    -- Premier Twin
    SELECT rm.room_id, a.id AS amenity_id FROM room_mapping rm CROSS JOIN amenities a 
    WHERE rm.room_type_name = 'Premier Twin' AND a.name IN ('Wi-Fi', 'Air Conditioning', 'Smart TV', 'Breakfast', 'Room Service')
    UNION ALL
    -- Ocean View Suite
    SELECT rm.room_id, a.id AS amenity_id FROM room_mapping rm CROSS JOIN amenities a 
    WHERE rm.room_type_name = 'Ocean View Suite' AND a.name IN ('Wi-Fi', 'Air Conditioning', 'Smart TV', 'Bathtub', 'Breakfast', 'Balcony', 'Ocean View', 'Room Service')
    UNION ALL
    -- Executive Suite
    SELECT rm.room_id, a.id AS amenity_id FROM room_mapping rm CROSS JOIN amenities a 
    WHERE rm.room_type_name = 'Executive Suite' AND a.name IN ('Wi-Fi', 'Air Conditioning', 'Smart TV', 'Bathtub', 'Breakfast', 'Balcony', 'Room Service')
    UNION ALL
    -- Presidential Suite (All amenities)
    SELECT rm.room_id, a.id AS amenity_id FROM room_mapping rm CROSS JOIN amenities a 
    WHERE rm.room_type_name = 'Presidential Suite'
)
INSERT INTO room_amenities (room_id, amenity_id)
SELECT room_id, amenity_id FROM mappings
ON CONFLICT (room_id, amenity_id) DO NOTHING;

COMMIT;
