-- ============================================================
-- 3D-BhuMap: Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin', 'government_authority', 'surveyor',
  'gis_analyst', 'utility_department', 'property_owner', 'public_viewer'
);

CREATE TYPE parcel_status AS ENUM ('active', 'inactive', 'disputed', 'archived');
CREATE TYPE building_status AS ENUM ('draft', 'provisional', 'verified', 'rejected', 'archived');
CREATE TYPE floor_status AS ENUM ('draft', 'provisional', 'verified', 'rejected');
CREATE TYPE approval_status AS ENUM ('draft', 'processing', 'provisional', 'requires_review', 'verified', 'rejected', 'archived');
CREATE TYPE conflict_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE conflict_status AS ENUM ('open', 'in_review', 'resolved', 'dismissed');
CREATE TYPE asset_type AS ENUM ('sewer', 'water', 'electricity', 'telecom', 'gas', 'utility_tunnel', 'metro_corridor', 'underground_parking');
CREATE TYPE dataset_format AS ENUM ('geojson', 'shapefile', 'geopackage', 'geotiff', 'las', 'laz', 'csv', 'dxf', 'ifc', 'glb', 'citygml');
CREATE TYPE dataset_status AS ENUM ('uploaded', 'processing', 'processed', 'failed', 'published');
CREATE TYPE survey_status AS ENUM ('pending', 'in_progress', 'completed', 'approved', 'rejected');
CREATE TYPE property_type AS ENUM ('residential', 'commercial', 'industrial', 'mixed', 'underground', 'basement', 'terrace', 'other');
CREATE TYPE usage_type AS ENUM ('apartment', 'office', 'shop', 'warehouse', 'parking', 'utility', 'common_area', 'other');
CREATE TYPE confidence_level AS ENUM ('low', 'moderate', 'high', 'very_high');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'public_viewer',
  department TEXT,
  employee_id TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARCELS (2D cadastral parcels)
-- ============================================================

CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ulpin TEXT UNIQUE NOT NULL,
  survey_number TEXT NOT NULL,
  district TEXT NOT NULL,
  tehsil TEXT NOT NULL,
  village TEXT NOT NULL,
  area_sqm NUMERIC(15,4),
  geometry GEOMETRY(MULTIPOLYGON, 4326),
  crs TEXT DEFAULT 'EPSG:4326',
  source TEXT,
  accuracy_m NUMERIC(10,4),
  status parcel_status DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX parcels_geometry_idx ON parcels USING GIST(geometry);
CREATE INDEX parcels_ulpin_idx ON parcels(ulpin);
CREATE INDEX parcels_district_idx ON parcels(district);

-- ============================================================
-- BUILDINGS
-- ============================================================

CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
  building_code TEXT UNIQUE NOT NULL,
  name TEXT,
  building_type TEXT,
  height_m NUMERIC(10,3),
  floor_count INTEGER,
  basement_count INTEGER DEFAULT 0,
  footprint GEOMETRY(POLYGON, 4326),
  geometry_3d JSONB, -- CesiumJS-compatible 3D geometry
  centroid GEOMETRY(POINT, 4326),
  ai_confidence NUMERIC(5,2),
  ai_method TEXT,
  source TEXT,
  status building_status DEFAULT 'draft',
  approval_status approval_status DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX buildings_parcel_idx ON buildings(parcel_id);
CREATE INDEX buildings_footprint_idx ON buildings USING GIST(footprint);
CREATE INDEX buildings_centroid_idx ON buildings USING GIST(centroid);

-- ============================================================
-- FLOORS
-- ============================================================

CREATE TABLE floors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  floor_number INTEGER NOT NULL,
  floor_name TEXT,
  min_elevation_m NUMERIC(10,3) NOT NULL,
  max_elevation_m NUMERIC(10,3) NOT NULL,
  area_sqm NUMERIC(15,4),
  geometry_2d GEOMETRY(POLYGON, 4326),
  geometry_3d JSONB,
  confidence NUMERIC(5,2),
  source TEXT,
  status floor_status DEFAULT 'draft',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT floor_elevation_check CHECK (max_elevation_m > min_elevation_m)
);

CREATE INDEX floors_building_idx ON floors(building_id);
CREATE INDEX floors_number_idx ON floors(building_id, floor_number);

-- ============================================================
-- PROPERTIES (3D Property Units with 3DSPID)
-- ============================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spid_3d TEXT UNIQUE NOT NULL, -- e.g., 3DSPID-IN-BR-0001-000042-F04-U402
  parent_ulpin TEXT NOT NULL REFERENCES parcels(ulpin),
  property_type property_type NOT NULL,
  building_id UUID REFERENCES buildings(id),
  floor_id UUID REFERENCES floors(id),
  unit_number TEXT,
  min_elevation_m NUMERIC(10,3),
  max_elevation_m NUMERIC(10,3),
  area_sqm NUMERIC(15,4),
  volume_cbm NUMERIC(15,4),
  geometry_2d GEOMETRY(POLYGON, 4326),
  geometry_3d JSONB, -- volumetric 3D geometry for CesiumJS
  ownership_reference TEXT, -- link to official ownership record (not stored here)
  usage usage_type,
  survey_source TEXT,
  accuracy_m NUMERIC(10,4),
  ai_confidence NUMERIC(5,2),
  confidence_level confidence_level,
  topology_valid BOOLEAN,
  topology_errors JSONB DEFAULT '[]',
  validation_status TEXT DEFAULT 'unvalidated',
  approval_status approval_status DEFAULT 'draft',
  rejection_reason TEXT,
  quality_score NUMERIC(5,2),
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX properties_spid_idx ON properties(spid_3d);
CREATE INDEX properties_ulpin_idx ON properties(parent_ulpin);
CREATE INDEX properties_building_idx ON properties(building_id);
CREATE INDEX properties_floor_idx ON properties(floor_id);
CREATE INDEX properties_geom_idx ON properties USING GIST(geometry_2d);

-- ============================================================
-- PROPERTY VERSIONS (immutable history)
-- ============================================================

CREATE TABLE property_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  version INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UNDERGROUND ASSETS
-- ============================================================

CREATE TABLE underground_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_type asset_type NOT NULL,
  name TEXT,
  operator TEXT,
  depth_m NUMERIC(10,3),
  geometry_2d GEOMETRY(LINESTRING, 4326),
  geometry_3d JSONB,
  material TEXT,
  diameter_mm NUMERIC(10,2),
  installation_year INTEGER,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX underground_geom_idx ON underground_assets USING GIST(geometry_2d);
CREATE INDEX underground_type_idx ON underground_assets(asset_type);

-- ============================================================
-- CONFLICTS
-- ============================================================

CREATE TABLE conflicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conflict_type TEXT NOT NULL,
  severity conflict_severity NOT NULL DEFAULT 'medium',
  object_a_type TEXT,
  object_a_id UUID,
  object_b_type TEXT,
  object_b_id UUID,
  location GEOMETRY(POINT, 4326),
  description TEXT NOT NULL,
  status conflict_status DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX conflicts_status_idx ON conflicts(status);
CREATE INDEX conflicts_severity_idx ON conflicts(severity);

-- ============================================================
-- SURVEYS
-- ============================================================

CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_number TEXT UNIQUE NOT NULL,
  parcel_id UUID REFERENCES parcels(id),
  surveyor_id UUID REFERENCES profiles(id),
  survey_type TEXT,
  status survey_status DEFAULT 'pending',
  equipment TEXT,
  accuracy_m NUMERIC(10,4),
  observations JSONB DEFAULT '[]',
  remarks TEXT,
  due_date TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GNSS POINTS
-- ============================================================

CREATE TABLE gnss_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID REFERENCES surveys(id),
  point_name TEXT,
  latitude NUMERIC(15,10) NOT NULL,
  longitude NUMERIC(15,10) NOT NULL,
  height_m NUMERIC(10,4),
  accuracy_h_m NUMERIC(10,4),
  accuracy_v_m NUMERIC(10,4),
  fix_type TEXT,
  satellite_count INTEGER,
  reference_station TEXT,
  crs TEXT DEFAULT 'EPSG:4326',
  geometry GEOMETRY(POINTZ, 4326),
  observed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX gnss_geom_idx ON gnss_points USING GIST(geometry);

-- ============================================================
-- DATASETS
-- ============================================================

CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  format dataset_format NOT NULL,
  file_path TEXT,
  file_size_bytes BIGINT,
  crs TEXT,
  detected_crs TEXT,
  bbox JSONB,
  feature_count INTEGER,
  metadata JSONB DEFAULT '{}',
  status dataset_status DEFAULT 'uploaded',
  progress_percent INTEGER DEFAULT 0,
  processing_log JSONB DEFAULT '[]',
  error_message TEXT,
  published_layer TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_role user_role,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX audit_entity_idx ON audit_logs(entity_type, entity_id);
CREATE INDEX audit_user_idx ON audit_logs(user_id);
CREATE INDEX audit_created_idx ON audit_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE underground_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE gnss_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read for parcels, buildings, properties (public viewer)
CREATE POLICY "Public can read parcels" ON parcels FOR SELECT USING (true);
CREATE POLICY "Public can read buildings" ON buildings FOR SELECT USING (status = 'verified');
CREATE POLICY "Public can read properties" ON properties FOR SELECT USING (approval_status = 'verified');

-- Authenticated users can read everything
CREATE POLICY "Auth users read parcels" ON parcels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read buildings" ON buildings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read floors" ON floors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read properties" ON properties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read underground" ON underground_assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read conflicts" ON conflicts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read surveys" ON surveys FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read gnss" ON gnss_points FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read datasets" ON datasets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users read audit" ON audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Service role bypasses RLS (for API routes)
CREATE POLICY "Service role full access parcels" ON parcels TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access buildings" ON buildings TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access floors" ON floors TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access properties" ON properties TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access underground" ON underground_assets TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access conflicts" ON conflicts TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access surveys" ON surveys TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access gnss" ON gnss_points TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access datasets" ON datasets TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access audit" ON audit_logs TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access profiles" ON profiles TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parcels_updated_at BEFORE UPDATE ON parcels FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER floors_updated_at BEFORE UPDATE ON floors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER underground_updated_at BEFORE UPDATE ON underground_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER surveys_updated_at BEFORE UPDATE ON surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Dashboard stats function
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_parcels', (SELECT COUNT(*) FROM parcels WHERE status = 'active'),
    'mapped_3d', (SELECT COUNT(DISTINCT parcel_id) FROM buildings WHERE status != 'archived'),
    'total_buildings', (SELECT COUNT(*) FROM buildings WHERE status != 'archived'),
    'total_properties', (SELECT COUNT(*) FROM properties WHERE approval_status != 'archived'),
    'underground_assets', (SELECT COUNT(*) FROM underground_assets WHERE status = 'active'),
    'pending_verification', (SELECT COUNT(*) FROM properties WHERE approval_status IN ('provisional', 'requires_review')),
    'open_conflicts', (SELECT COUNT(*) FROM conflicts WHERE status = 'open'),
    'high_confidence', (SELECT COUNT(*) FROM properties WHERE ai_confidence >= 80),
    'verified_properties', (SELECT COUNT(*) FROM properties WHERE approval_status = 'verified'),
    'rejected_properties', (SELECT COUNT(*) FROM properties WHERE approval_status = 'rejected')
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
