-- ============================================================
-- 3D-BhuMap: Seed Data (Demo Environment)
-- Run AFTER schema.sql
-- Location: Patna, Bihar, India (~25.5°N, 85.1°E)
-- ============================================================

-- ============================================================
-- Create demo users in auth (run via Supabase dashboard or API)
-- Then insert profiles:
-- ============================================================

-- NOTE: You must create users via Supabase Auth first,
-- then their UUIDs will be auto-inserted into profiles via trigger.
-- For seeding, we insert directly with placeholder UUIDs.
-- Replace these UUIDs with actual auth.users IDs after creating users.

-- Demo user IDs (replace after creating in Supabase Auth)
DO $$
DECLARE
  admin_id UUID := '00000000-0000-0000-0000-000000000001';
  authority_id UUID := '00000000-0000-0000-0000-000000000002';
  surveyor_id UUID := '00000000-0000-0000-0000-000000000003';
  analyst_id UUID := '00000000-0000-0000-0000-000000000004';
  public_id UUID := '00000000-0000-0000-0000-000000000005';
BEGIN
  INSERT INTO profiles (id, email, full_name, role, department) VALUES
    (admin_id, 'admin@bhumap.gov.in', 'System Administrator', 'super_admin', 'IT'),
    (authority_id, 'authority@bhumap.gov.in', 'Rajesh Kumar Singh', 'government_authority', 'Revenue Department'),
    (surveyor_id, 'surveyor@bhumap.gov.in', 'Amit Sharma', 'surveyor', 'Survey of India'),
    (analyst_id, 'analyst@bhumap.gov.in', 'Priya Verma', 'gis_analyst', 'GIS Cell'),
    (public_id, 'public@bhumap.gov.in', 'Public User', 'public_viewer', NULL)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ============================================================
-- PARCELS (10 cadastral parcels in Patna area)
-- ============================================================

INSERT INTO parcels (ulpin, survey_number, district, tehsil, village, area_sqm, geometry, source, accuracy_m, status) VALUES
('BR-01-001-0001', 'SN-2024-001', 'Patna', 'Patna Sadar', 'Rajendra Nagar', 5200.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0950 25.5910, 85.0970 25.5910, 85.0970 25.5895, 85.0950 25.5895, 85.0950 25.5910)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0002', 'SN-2024-002', 'Patna', 'Patna Sadar', 'Rajendra Nagar', 3800.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0970 25.5910, 85.0992 25.5910, 85.0992 25.5895, 85.0970 25.5895, 85.0970 25.5910)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0003', 'SN-2024-003', 'Patna', 'Patna Sadar', 'Rajendra Nagar', 4500.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0950 25.5895, 85.0970 25.5895, 85.0970 25.5880, 85.0950 25.5880, 85.0950 25.5895)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0004', 'SN-2024-004', 'Patna', 'Patna Sadar', 'Kankarbagh', 6200.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0992 25.5910, 85.1015 25.5910, 85.1015 25.5895, 85.0992 25.5895, 85.0992 25.5910)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0005', 'SN-2024-005', 'Patna', 'Patna Sadar', 'Kankarbagh', 4100.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0970 25.5895, 85.0992 25.5895, 85.0992 25.5880, 85.0970 25.5880, 85.0970 25.5895)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0006', 'SN-2024-006', 'Patna', 'Patna Sadar', 'Kankarbagh', 3200.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0992 25.5895, 85.1015 25.5895, 85.1015 25.5880, 85.0992 25.5880, 85.0992 25.5895)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0007', 'SN-2024-007', 'Patna', 'Patna Sadar', 'Boring Road', 7500.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0950 25.5880, 85.0970 25.5880, 85.0970 25.5865, 85.0950 25.5865, 85.0950 25.5880)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0008', 'SN-2024-008', 'Patna', 'Patna Sadar', 'Boring Road', 2900.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0970 25.5880, 85.0992 25.5880, 85.0992 25.5865, 85.0970 25.5865, 85.0970 25.5880)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0009', 'SN-2024-009', 'Patna', 'Patna Sadar', 'Boring Road', 3700.00,
  ST_GeomFromText('MULTIPOLYGON(((85.0992 25.5880, 85.1015 25.5880, 85.1015 25.5865, 85.0992 25.5865, 85.0992 25.5880)))', 4326),
  'Survey of India', 0.05, 'active'),

('BR-01-001-0010', 'SN-2024-010', 'Patna', 'Patna Sadar', 'Boring Road', 5800.00,
  ST_GeomFromText('MULTIPOLYGON(((85.1015 25.5910, 85.1038 25.5910, 85.1038 25.5880, 85.1015 25.5880, 85.1015 25.5910)))', 4326),
  'Survey of India', 0.05, 'active');

-- ============================================================
-- BUILDINGS (6 buildings including Urban Tower A flagship)
-- ============================================================

-- Urban Tower A (Flagship demo building: G+5 floors, 2 basements)
INSERT INTO buildings (parcel_id, building_code, name, building_type, height_m, floor_count, basement_count, footprint, geometry_3d, centroid, ai_confidence, ai_method, source, status, approval_status)
SELECT
  p.id,
  'BLD-2024-001',
  'Urban Tower A',
  'Mixed Use Residential',
  22.5,
  7, -- G + 5 upper + terrace = 7 levels above ground
  2,
  ST_GeomFromText('POLYGON((85.0952 25.5908, 85.0968 25.5908, 85.0968 25.5897, 85.0952 25.5897, 85.0952 25.5908))', 4326),
  '{"type": "Building", "floors": 7, "basements": 2, "height": 22.5}'::jsonb,
  ST_GeomFromText('POINT(85.0960 25.5902)', 4326),
  92.5,
  'DEMO_SIMULATION',
  'Drone Orthophoto + DSM',
  'verified',
  'verified'
FROM parcels p WHERE p.ulpin = 'BR-01-001-0001';

-- Residential Block B
INSERT INTO buildings (parcel_id, building_code, name, building_type, height_m, floor_count, basement_count, footprint, geometry_3d, centroid, ai_confidence, ai_method, source, status, approval_status)
SELECT
  p.id, 'BLD-2024-002', 'Residential Block B', 'Residential', 15.0, 4, 1,
  ST_GeomFromText('POLYGON((85.0972 25.5908, 85.0990 25.5908, 85.0990 25.5897, 85.0972 25.5897, 85.0972 25.5908))', 4326),
  '{"type": "Building", "floors": 4, "basements": 1, "height": 15.0}'::jsonb,
  ST_GeomFromText('POINT(85.0981 25.5902)', 4326),
  87.3, 'DEMO_SIMULATION', 'Drone Orthophoto', 'provisional', 'provisional'
FROM parcels p WHERE p.ulpin = 'BR-01-001-0002';

-- Commercial Plaza C
INSERT INTO buildings (parcel_id, building_code, name, building_type, height_m, floor_count, basement_count, footprint, geometry_3d, centroid, ai_confidence, ai_method, source, status, approval_status)
SELECT
  p.id, 'BLD-2024-003', 'Commercial Plaza C', 'Commercial', 12.0, 3, 0,
  ST_GeomFromText('POLYGON((85.0994 25.5908, 85.1013 25.5908, 85.1013 25.5897, 85.0994 25.5897, 85.0994 25.5908))', 4326),
  '{"type": "Building", "floors": 3, "basements": 0, "height": 12.0}'::jsonb,
  ST_GeomFromText('POINT(85.1003 25.5902)', 4326),
  78.9, 'DEMO_SIMULATION', 'Drone Orthophoto', 'provisional', 'requires_review'
FROM parcels p WHERE p.ulpin = 'BR-01-001-0004';

-- Residential Villa D
INSERT INTO buildings (parcel_id, building_code, name, building_type, height_m, floor_count, basement_count, footprint, geometry_3d, centroid, ai_confidence, ai_method, source, status, approval_status)
SELECT
  p.id, 'BLD-2024-004', 'Residential Villa D', 'Residential', 9.0, 2, 0,
  ST_GeomFromText('POLYGON((85.0952 25.5893, 85.0968 25.5893, 85.0968 25.5882, 85.0952 25.5882, 85.0952 25.5893))', 4326),
  '{"type": "Building", "floors": 2, "basements": 0, "height": 9.0}'::jsonb,
  ST_GeomFromText('POINT(85.0960 25.5887)', 4326),
  91.2, 'DEMO_SIMULATION', 'LiDAR + DSM', 'verified', 'verified'
FROM parcels p WHERE p.ulpin = 'BR-01-001-0003';

-- Industrial Unit E
INSERT INTO buildings (parcel_id, building_code, name, building_type, height_m, floor_count, basement_count, footprint, geometry_3d, centroid, ai_confidence, ai_method, source, status, approval_status)
SELECT
  p.id, 'BLD-2024-005', 'Industrial Unit E', 'Industrial', 18.0, 2, 0,
  ST_GeomFromText('POLYGON((85.0952 25.5878, 85.0968 25.5878, 85.0968 25.5867, 85.0952 25.5867, 85.0952 25.5878))', 4326),
  '{"type": "Building", "floors": 2, "basements": 0, "height": 18.0}'::jsonb,
  ST_GeomFromText('POINT(85.0960 25.5872)', 4326),
  65.4, 'DEMO_SIMULATION', 'Drone Orthophoto', 'draft', 'draft'
FROM parcels p WHERE p.ulpin = 'BR-01-001-0007';

-- Government Office F
INSERT INTO buildings (parcel_id, building_code, name, building_type, height_m, floor_count, basement_count, footprint, geometry_3d, centroid, ai_confidence, ai_method, source, status, approval_status)
SELECT
  p.id, 'BLD-2024-006', 'Government Office F', 'Government', 16.5, 4, 1,
  ST_GeomFromText('POLYGON((85.1017 25.5908, 85.1036 25.5908, 85.1036 25.5882, 85.1017 25.5882, 85.1017 25.5908))', 4326),
  '{"type": "Building", "floors": 4, "basements": 1, "height": 16.5}'::jsonb,
  ST_GeomFromText('POINT(85.1026 25.5895)', 4326),
  95.1, 'DEMO_SIMULATION', 'Survey + LiDAR', 'verified', 'verified'
FROM parcels p WHERE p.ulpin = 'BR-01-001-0010';

-- ============================================================
-- FLOORS for Urban Tower A (G+5 + 2 Basements = 9 floor records)
-- ============================================================

INSERT INTO floors (building_id, floor_number, floor_name, min_elevation_m, max_elevation_m, area_sqm, confidence, source, status)
SELECT
  b.id,
  floor_data.floor_number,
  floor_data.floor_name,
  floor_data.min_elev,
  floor_data.max_elev,
  floor_data.area,
  floor_data.confidence,
  'AI + Survey',
  'verified'::floor_status
FROM buildings b,
(VALUES
  (-6, 'Basement 2', 47.5, 50.5, 520.0, 88.0),
  (-1, 'Basement 1', 50.5, 53.5, 520.0, 91.0),
  (0,  'Ground Floor', 53.5, 57.0, 520.0, 95.0),
  (1,  'First Floor', 57.0, 60.5, 520.0, 94.0),
  (2,  'Second Floor', 60.5, 64.0, 520.0, 93.0),
  (3,  'Third Floor', 64.0, 67.5, 500.0, 92.0),
  (4,  'Fourth Floor', 67.5, 71.0, 500.0, 91.0),
  (5,  'Fifth Floor', 71.0, 74.5, 480.0, 90.0),
  (6,  'Terrace', 74.5, 77.0, 200.0, 88.0)
) AS floor_data(floor_number, floor_name, min_elev, max_elev, area, confidence)
WHERE b.building_code = 'BLD-2024-001';

-- ============================================================
-- PROPERTIES for Urban Tower A (24 units)
-- ============================================================

-- Ground Floor: 4 commercial units
INSERT INTO properties (spid_3d, parent_ulpin, property_type, building_id, floor_id, unit_number, min_elevation_m, max_elevation_m, area_sqm, volume_cbm, ownership_reference, usage, survey_source, ai_confidence, confidence_level, topology_valid, validation_status, approval_status, quality_score)
SELECT
  '3DSPID-IN-BR-0001-000001-F00-U' || LPAD(rn::TEXT, 3, '0'),
  'BR-01-001-0001',
  'commercial',
  b.id,
  f.id,
  'G-' || LPAD(rn::TEXT, 2, '0'),
  53.5, 57.0,
  125.0,
  455.0,
  'REG-REF-2024-GF-' || rn,
  'shop',
  'AI + Survey',
  88.5,
  'high',
  true,
  'validated',
  'verified',
  87.2
FROM buildings b
JOIN floors f ON f.building_id = b.id AND f.floor_number = 0,
(SELECT generate_series(1,4) AS rn) AS s
WHERE b.building_code = 'BLD-2024-001';

-- Basement 1: 2 parking units
INSERT INTO properties (spid_3d, parent_ulpin, property_type, building_id, floor_id, unit_number, min_elevation_m, max_elevation_m, area_sqm, volume_cbm, ownership_reference, usage, survey_source, ai_confidence, confidence_level, topology_valid, validation_status, approval_status, quality_score)
SELECT
  '3DSPID-IN-BR-0001-000001-FB1-P' || LPAD(rn::TEXT, 2, '0'),
  'BR-01-001-0001',
  'basement',
  b.id,
  f.id,
  'B1-P' || LPAD(rn::TEXT, 2, '0'),
  50.5, 53.5,
  260.0,
  780.0,
  'REG-REF-2024-B1-P' || rn,
  'parking',
  'AI + LiDAR',
  91.0,
  'high',
  true,
  'validated',
  'verified',
  89.5
FROM buildings b
JOIN floors f ON f.building_id = b.id AND f.floor_number = -1,
(SELECT generate_series(1,2) AS rn) AS s
WHERE b.building_code = 'BLD-2024-001';

-- Basement 2: 1 utility room
INSERT INTO properties (spid_3d, parent_ulpin, property_type, building_id, floor_id, unit_number, min_elevation_m, max_elevation_m, area_sqm, volume_cbm, ownership_reference, usage, survey_source, ai_confidence, confidence_level, topology_valid, validation_status, approval_status, quality_score)
VALUES (
  '3DSPID-IN-BR-0001-000001-FB2-U01',
  'BR-01-001-0001',
  'basement',
  (SELECT id FROM buildings WHERE building_code = 'BLD-2024-001'),
  (SELECT id FROM floors f JOIN buildings b ON f.building_id = b.id WHERE b.building_code = 'BLD-2024-001' AND f.floor_number = -6),
  'B2-UT01',
  47.5, 50.5, 520.0, 1560.0,
  'REG-REF-2024-B2-UT01',
  'utility',
  'AI + LiDAR',
  85.0, 'high', true, 'validated', 'verified', 84.0
);

-- Floors 1–5: 4 residential apartments each = 17 remaining units
DO $$
DECLARE
  bld_id UUID;
  flr_id UUID;
  floor_num INTEGER;
  unit_num INTEGER;
  spid TEXT;
BEGIN
  SELECT id INTO bld_id FROM buildings WHERE building_code = 'BLD-2024-001';

  FOR floor_num IN 1..5 LOOP
    SELECT id INTO flr_id FROM floors WHERE building_id = bld_id AND floor_number = floor_num;
    FOR unit_num IN 1..3 LOOP
      spid := '3DSPID-IN-BR-0001-000001-F0' || floor_num || '-U' || LPAD(unit_num::TEXT, 3, '0');
      INSERT INTO properties (spid_3d, parent_ulpin, property_type, building_id, floor_id, unit_number, min_elevation_m, max_elevation_m, area_sqm, volume_cbm, ownership_reference, usage, survey_source, ai_confidence, confidence_level, topology_valid, validation_status, approval_status, quality_score)
      VALUES (
        spid, 'BR-01-001-0001', 'residential', bld_id, flr_id,
        'F' || floor_num || '-A' || LPAD(unit_num::TEXT, 2, '0'),
        53.5 + (floor_num * 3.5),
        57.0 + (floor_num * 3.5),
        CASE unit_num WHEN 1 THEN 95.0 WHEN 2 THEN 110.0 ELSE 85.0 END,
        CASE unit_num WHEN 1 THEN 332.5 WHEN 2 THEN 385.0 ELSE 297.5 END,
        'REG-REF-2024-F' || floor_num || '-' || unit_num,
        'apartment', 'AI + Survey',
        88.0 + floor_num * 1.2, 'high', true, 'validated',
        CASE WHEN floor_num <= 2 THEN 'verified' WHEN floor_num = 3 THEN 'requires_review' ELSE 'provisional' END,
        85.0 + floor_num
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- UNDERGROUND ASSETS (3 networks)
-- ============================================================

-- Sewer line (creates deliberate conflict with Basement 2 of Urban Tower A)
INSERT INTO underground_assets (asset_type, name, operator, depth_m, geometry_2d, geometry_3d, material, diameter_mm, status)
VALUES (
  'sewer', 'Main Sewer Line - Rajendra Nagar Sector 2',
  'Patna Municipal Corporation',
  4.5, -- depth from surface = 53.5 - 4.5 = 49.0m elevation (inside Basement 2 at 47.5-50.5m = CONFLICT!)
  ST_GeomFromText('LINESTRING(85.0940 25.5902, 85.0960 25.5902, 85.0980 25.5902, 85.1000 25.5902)', 4326),
  '{"type": "UtilityLine", "depth": 4.5, "elevation_m": 49.0, "diameter_mm": 450}'::jsonb,
  'RCC', 450, 'active'
);

-- Water supply line
INSERT INTO underground_assets (asset_type, name, operator, depth_m, geometry_2d, geometry_3d, material, diameter_mm, status)
VALUES (
  'water', 'Water Supply Trunk Main - RN-2',
  'Bihar Urban Infrastructure Development Corp',
  2.5,
  ST_GeomFromText('LINESTRING(85.0945 25.5915, 85.0945 25.5900, 85.0945 25.5885, 85.0945 25.5870)', 4326),
  '{"type": "UtilityLine", "depth": 2.5, "elevation_m": 51.0, "diameter_mm": 300}'::jsonb,
  'DI', 300, 'active'
);

-- Telecom duct
INSERT INTO underground_assets (asset_type, name, operator, depth_m, geometry_2d, geometry_3d, material, diameter_mm, status)
VALUES (
  'telecom', 'BSNL OFC Duct - RN Sector',
  'BSNL',
  1.2,
  ST_GeomFromText('LINESTRING(85.0955 25.5912, 85.0970 25.5912, 85.0985 25.5912, 85.1005 25.5912)', 4326),
  '{"type": "UtilityLine", "depth": 1.2, "elevation_m": 52.3, "diameter_mm": 100}'::jsonb,
  'HDPE', 100, 'active'
);

-- ============================================================
-- CONFLICTS (1 pre-seeded deliberate conflict)
-- ============================================================

INSERT INTO conflicts (conflict_type, severity, object_a_type, object_a_id, object_b_type, object_b_id, location, description, status)
SELECT
  'Utility/Property Intersection',
  'high',
  'underground_asset',
  ua.id,
  'property',
  pr.id,
  ST_GeomFromText('POINT(85.0960 25.5902)', 4326),
  'Main Sewer Line (elevation 47.5–50.5m) passes through Basement 2 of Urban Tower A (elevation 47.5–50.5m). 3D volume intersection detected. Requires immediate review and rerouting assessment.',
  'open'
FROM underground_assets ua, properties pr
WHERE ua.name LIKE '%Main Sewer%'
  AND pr.spid_3d = '3DSPID-IN-BR-0001-000001-FB2-U01'
LIMIT 1;

-- ============================================================
-- GNSS CONTROL POINTS
-- ============================================================

INSERT INTO gnss_points (point_name, latitude, longitude, height_m, accuracy_h_m, accuracy_v_m, fix_type, satellite_count, reference_station, crs, geometry, observed_at)
VALUES
  ('GCP-RN-001', 25.5910, 85.0945, 54.23, 0.02, 0.03, 'RTK_FIXED', 18, 'CORS-PATNA-01', 'EPSG:4326',
   ST_GeomFromText('POINTZ(85.0945 25.5910 54.23)', 4326), NOW() - INTERVAL '30 days'),
  ('GCP-RN-002', 25.5880, 85.0945, 52.87, 0.02, 0.03, 'RTK_FIXED', 16, 'CORS-PATNA-01', 'EPSG:4326',
   ST_GeomFromText('POINTZ(85.0945 25.5880 52.87)', 4326), NOW() - INTERVAL '30 days'),
  ('GCP-RN-003', 25.5895, 85.0980, 53.45, 0.03, 0.04, 'RTK_FIXED', 15, 'CORS-PATNA-01', 'EPSG:4326',
   ST_GeomFromText('POINTZ(85.0980 25.5895 53.45)', 4326), NOW() - INTERVAL '29 days'),
  ('GCP-RN-004', 25.5910, 85.1015, 54.01, 0.02, 0.03, 'RTK_FIXED', 17, 'CORS-PATNA-02', 'EPSG:4326',
   ST_GeomFromText('POINTZ(85.1015 25.5910 54.01)', 4326), NOW() - INTERVAL '28 days'),
  ('GCP-RN-005', 25.5865, 85.1005, 52.18, 0.03, 0.05, 'RTK_FLOAT', 12, 'CORS-PATNA-02', 'EPSG:4326',
   ST_GeomFromText('POINTZ(85.1005 25.5865 52.18)', 4326), NOW() - INTERVAL '27 days');

-- ============================================================
-- DATASETS (sample metadata records)
-- ============================================================

INSERT INTO datasets (name, format, file_size_bytes, crs, detected_crs, feature_count, status, metadata)
VALUES
  ('Rajendra Nagar Orthophoto 2024', 'geotiff', 524288000, 'EPSG:4326', 'EPSG:32644', NULL, 'published',
   '{"resolution_cm": 5, "capture_date": "2024-03-15", "sensor": "DJI L2", "bands": 3}'::jsonb),
  ('Parcel Boundaries GeoJSON', 'geojson', 245760, 'EPSG:4326', 'EPSG:4326', 10, 'published',
   '{"source": "Survey of India", "year": 2024}'::jsonb),
  ('Urban Tower A LiDAR Scan', 'laz', 157286400, 'EPSG:32644', 'EPSG:32644', NULL, 'published',
   '{"point_count": 2450000, "density_per_sqm": 25, "sensor": "Riegl VUX-1HAL"}'::jsonb),
  ('DEM - Patna Urban Area', 'geotiff', 10485760, 'EPSG:4326', 'EPSG:4326', NULL, 'published',
   '{"resolution_m": 1, "vertical_datum": "MSL", "source": "ISRO Cartosat-3"}'::jsonb),
  ('DSM - Patna Urban Area', 'geotiff', 10485760, 'EPSG:4326', 'EPSG:4326', NULL, 'published',
   '{"resolution_m": 1, "vertical_datum": "MSL", "source": "ISRO Cartosat-3"}'::jsonb);

-- ============================================================
-- SURVEYS
-- ============================================================

INSERT INTO surveys (survey_number, parcel_id, survey_type, status, equipment, accuracy_m, remarks)
SELECT 'SRV-2024-001-RN', p.id, '3D Cadastral Survey', 'completed', 'Leica RTC360 + DJI Matrice 300', 0.03,
  'Full 3D scan completed. Urban Tower A and surrounding parcels surveyed.'
FROM parcels p WHERE p.ulpin = 'BR-01-001-0001';

-- ============================================================
-- AUDIT LOGS (sample initial entries)
-- ============================================================

INSERT INTO audit_logs (user_email, user_role, action, entity_type, entity_id, new_value, reason)
SELECT 'admin@bhumap.gov.in', 'super_admin', 'SEED_DATA_LOADED', 'system', uuid_generate_v4(),
  '{"parcels": 10, "buildings": 6, "properties": 24, "underground_assets": 3}'::jsonb,
  'Initial demo data seeded for SIH 2026 prototype';
