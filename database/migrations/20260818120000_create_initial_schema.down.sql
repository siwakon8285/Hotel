-- ==========================================
-- 20260818120000_create_initial_schema.down.sql
-- ==========================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS room_amenities;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS room_types;
DROP TABLE IF EXISTS floors;
DROP TABLE IF EXISTS hotels;

-- Note: We intentionally do NOT drop the pgcrypto or btree_gist extensions here,
-- as they may be shared by other databases or schemas on this PostgreSQL instance,
-- and dropping them could break other functionality.
