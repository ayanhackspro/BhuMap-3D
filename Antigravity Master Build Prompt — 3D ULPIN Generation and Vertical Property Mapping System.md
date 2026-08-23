# Build a Production-Quality SIH 2026 Prototype: 3D-BhuMap

Build a complete working web application named **3D-BhuMap** for Smart India Hackathon 2026.

## Problem Statement

**3D ULPIN Generation and Vertical Property Mapping System**

The system must extend conventional 2D cadastral representation into a three-dimensional spatial cadastral framework capable of representing:

- Surface land parcels
- Multi-storey buildings
- Individual floors
- Apartments and property units
- Underground infrastructure
- Utility corridors
- Basements
- Vertical property volumes
- Spatial conflicts

The system must integrate:

- Drone imagery
- LiDAR / 3D point clouds
- GIS parcel layers
- Building floor plans
- GNSS / CORS-based coordinates
- DEM
- DSM

It must provide AI/ML-assisted:

- Automated building extraction
- Floor segmentation
- Vertical parcel delineation
- Intelligent topology validation
- Change detection

The platform must be designed as a scalable and interoperable 3D cadastral framework.

---

## IMPORTANT PRODUCT PRINCIPLE

Do NOT claim that the prototype independently establishes legal ownership.

Separate:

1. Physical spatial geometry
2. Cadastral/property record
3. Legal ownership/right

The system should link authoritative ownership references to spatial volumes and provide verification/approval workflows.

The existing ULPIN should be treated as the parent parcel identifier.

Introduce a prototype-level identifier called:

**3DSPID — 3D Spatial Property ID**

Do not redefine the official ULPIN standard.

---

# TECH STACK

## Frontend

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- CesiumJS
- Three.js where required
- MapLibre GL JS where appropriate
- TanStack Query
- Zustand

## Backend

Use:

- Python
- FastAPI
- PostgreSQL
- PostGIS
- Redis
- Celery or an equivalent background job system

## Geospatial

Use:

- GDAL
- Rasterio
- GeoPandas
- Shapely
- PyProj
- PDAL
- Open3D
- laspy

## Storage

Use object storage abstraction for:

- LAS/LAZ
- GeoTIFF
- Drone imagery
- CAD
- IFC
- GLB
- CityGML
- Generated reports

For local development, provide a filesystem/local-storage implementation.

---

# CORE APPLICATION

Create these major modules:

1. Authentication
2. Government Dashboard
3. 2D GIS
4. 3D GIS
5. Parcel Management
6. Building Management
7. Floor Management
8. 3D Property Management
9. Survey Management
10. Dataset Import
11. AI Processing
12. Topology Validation
13. Underground Infrastructure
14. Conflict Detection
15. Approval Workflow
16. Reports
17. Audit Logs
18. Administration

---

# USER ROLES

Implement RBAC.

Roles:

- Super Admin
- Government Authority
- Surveyor
- GIS Analyst
- Utility Department
- Property Owner
- Public Viewer

Each role must have appropriate permissions.

---

# MAIN ROUTES

Implement:

/login

/dashboard

/map

/parcels

/parcels/:id

/buildings

/buildings/:id

/properties

/properties/:id

/surveys

/surveys/:id

/datasets

/datasets/upload

/processing

/validation

/conflicts

/approvals

/reports

/audit

/settings

---

# MAIN GIS EXPERIENCE

The /map page must be the central application.

Use a professional GIS layout.

Left sidebar:

- Layers
- Search
- Dataset controls
- Measurement tools

Center:

- Large interactive 3D map

Right sidebar:

- Selected object details
- Property metadata
- Confidence
- Validation status
- Actions

Bottom status bar:

- Coordinates
- CRS
- Elevation
- Scale
- Data source

---

# REQUIRED LAYERS

Implement:

- Cadastral Parcels
- ULPIN
- Buildings
- Floors
- Properties
- Roads
- DEM
- DSM
- LiDAR
- Drone Orthophoto
- GNSS Points
- Underground Utilities
- Conflicts
- Survey Control Points

Allow:

- Show/hide
- Opacity
- Layer ordering
- Metadata
- Legend

---

# 3D VIEWER

The 3D viewer must support:

- Pan
- Zoom
- Orbit
- Tilt
- Rotate
- Select
- Measure distance
- Measure area
- Measure height
- Measure volume
- Property highlighting
- Underground mode
- Floor visibility
- Building transparency
- Exploded building view

Use CesiumJS as the primary geospatial 3D viewer.

---

# BUILDING EXPLODED VIEW

Create a button:

**Explode Building**

When clicked, floors should visually separate vertically.

Example:

Ground
Floor 1
Floor 2
Floor 3
Floor 4
Floor 5
Terrace

Each floor must remain selectable.

---

# UNDERGROUND MODE

Create a dedicated button:

**Underground Mode**

When enabled:

- Terrain becomes partially transparent
- Surface layers become translucent
- Underground utilities become visible
- Underground property volumes become visible

Support:

- Sewer
- Water
- Electricity
- Telecom
- Gas
- Utility tunnel
- Metro corridor
- Underground parking

---

# DATA IMPORT WIZARD

Create:

/datasets/upload

Wizard steps:

1. Select data type
2. Upload file
3. Detect metadata
4. Detect CRS
5. Preview
6. Validate
7. Process
8. Publish

Supported formats:

- GeoJSON
- Shapefile
- GeoPackage
- GeoTIFF
- LAS
- LAZ
- CSV
- DXF
- IFC
- GLB
- CityGML

If a file cannot be processed in-browser, send it to the backend processing queue.

---

# PARCEL MODEL

Create parcel fields:

- ULPIN
- Survey number
- District
- Tehsil
- Village
- Area
- Geometry
- CRS
- Source
- Accuracy
- Status

A parcel must be spatially indexed using PostGIS.

---

# BUILDING MODEL

Fields:

- Building ID
- Parcel ID
- Building code
- Building type
- Height
- Number of floors
- Footprint
- 3D geometry
- AI confidence
- Source
- Status

---

# FLOOR MODEL

Fields:

- Floor ID
- Building ID
- Floor number
- Floor name
- Minimum Z
- Maximum Z
- Area
- 3D geometry
- Confidence
- Status

---

# PROPERTY MODEL

Fields:

- Internal UUID
- 3DSPID
- Parent ULPIN
- Property type
- Building
- Floor
- Unit number
- Minimum elevation
- Maximum elevation
- Area
- Volume
- 3D geometry
- Ownership reference
- Usage
- Survey source
- Confidence
- Validation status
- Approval status
- Created by
- Updated by
- Version

---

# 3DSPID

Generate a human-readable prototype identifier.

Example:

3DSPID-IN-BR-0001-000042-F04-U402

Store a UUID as the actual database primary key.

The 3DSPID must be linked to the parent ULPIN.

---

# AI BUILDING EXTRACTION

Implement an AI service abstraction.

The system should support:

Input:

- Orthophoto
- Drone imagery
- DSM
- LiDAR

Output:

- Building polygon
- Building height
- Estimated floors
- Confidence

For the SIH prototype, if a production ML model is unavailable, implement a deterministic demo inference mode using sample data while keeping the API architecture ready for a real ML model.

Never falsely claim that a simulated result is produced by a real trained model.

---

# FLOOR SEGMENTATION

Estimate floors using:

- Building height
- LiDAR
- DSM
- Floor plans
- Existing building metadata

Every AI result must have:

- confidence
- source
- method
- verification status

---

# VERTICAL PARCEL ENGINE

Implement a geometry service that transforms:

2D polygon + bottom Z + top Z

into:

3D volumetric geometry.

Support both:

- Simple extruded solids
- Irregular solids

Validate:

- Closed geometry
- Self intersections
- Duplicate vertices
- Invalid rings
- Non-manifold geometry
- Overlapping volumes

---

# TOPOLOGY VALIDATION ENGINE

Create a dedicated validation module.

Validate:

## Parcel

- Closed polygon
- No self-intersection
- Valid CRS
- No duplicate vertices
- Area consistency

## Building

- Building contained within parcel
- Valid footprint
- Valid height

## Floors

- Bottom < top
- Correct floor ordering
- No illegal overlap
- Floor belongs to building

## Properties

- Unique 3DSPID
- Valid parent ULPIN
- Valid building relationship
- Valid floor relationship

## Underground

- Valid depth
- Valid geometry
- Infrastructure conflicts

---

# CONFLICT ENGINE

Detect:

- 3D volume intersection
- Property/property overlap
- Building/parcel mismatch
- Utility/property intersection
- Underground infrastructure conflict
- Floor overlap
- Geometry gap

Generate conflict records:

- Conflict ID
- Object A
- Object B
- Type
- Severity
- Location
- Description
- Status
- Resolution
- Created timestamp

Severity:

LOW
MEDIUM
HIGH
CRITICAL

---

# HUMAN VERIFICATION

AI-generated results must initially be:

**PROVISIONAL**

Create a surveyor workspace.

Surveyor can:

- Move vertices
- Edit boundaries
- Change floor height
- Split geometry
- Merge geometry
- Delete incorrect detection
- Add missing object
- Add remarks
- Approve survey result

Then:

AI
→ Surveyor Review
→ Topology Validation
→ Authority Approval
→ VERIFIED

---

# APPROVAL WORKFLOW

Implement statuses:

DRAFT
PROCESSING
PROVISIONAL
REQUIRES_REVIEW
VERIFIED
REJECTED
ARCHIVED

Government Authority can approve or reject.

Require rejection reason.

---

# DATA QUALITY

Calculate:

- Geometry Quality
- Survey Accuracy
- AI Confidence
- Topology Validity
- Source Completeness

Produce:

**Overall Data Quality Score**

Show this prominently.

---

# CONFIDENCE

Use:

0–60 LOW
60–80 MODERATE
80–90 HIGH
90–100 VERY HIGH

Never mark low-confidence AI output as verified automatically.

---

# DASHBOARD

Create professional government dashboard.

KPIs:

- Total Parcels
- 3D Mapped
- Buildings
- Vertical Units
- Underground Assets
- Pending Verification
- Topology Conflicts
- High Confidence Records

Charts:

- Mapping progress
- Property distribution
- Building distribution
- Floor distribution
- Validation status
- AI confidence
- Infrastructure types
- Conflicts

---

# PROPERTY DETAILS PANEL

When a property is selected show:

3D Property ID
Parent ULPIN
Building
Floor
Unit
Area
Volume
Elevation
Usage
Survey Accuracy
AI Confidence
Data Quality
Validation Status
Approval Status
Source
Last Updated

Provide actions:

- View in 3D
- Explode building
- Show underground
- Measure
- Generate report
- View audit
- Submit correction

---

# SEARCH

Global search must support:

- ULPIN
- 3DSPID
- Survey Number
- Property ID
- Building ID
- Unit Number
- District
- Village
- Ward
- Coordinates

Search results must zoom the map to the selected object.

---

# REPORT GENERATION

Generate a professional PDF report containing:

- Property ID
- Parent ULPIN
- Location
- Coordinates
- Property type
- Building
- Floor
- Unit
- Area
- Volume
- Elevation
- Survey source
- Accuracy
- AI confidence
- Validation status
- Approval status
- QR code
- 3D preview
- Audit reference

Clearly label prototype/demo information where appropriate.

---

# EXPORT

Implement:

- GeoJSON export
- GeoPackage export where feasible
- CityGML export
- 3D model export
- PDF report

---

# AUDIT LOG

Record:

- User
- Action
- Entity
- Entity ID
- Old value
- New value
- Timestamp
- Reason

Every geometry modification must create an audit entry.

---

# VERSIONING

Never destroy historical property versions.

Maintain:

Version 1
Version 2
Version 3

Allow authorised users to view historical records.

---

# CHANGE DETECTION

Create a prototype change detection workflow.

Compare:

Old dataset
vs
New dataset

Detect:

- New building
- Demolished building
- Height change
- Additional floor
- Boundary change
- New underground utility

Mark detected changes as:

REQUIRES_REVIEW

---

# GNSS/CORS DATA

Support importing GNSS observations.

Fields:

- Latitude
- Longitude
- Height
- Accuracy
- Fix type
- Satellite count
- Timestamp
- Reference station
- CRS

Do not hard-code live CORS credentials.

Create an integration interface so an official CORS provider can be connected later.

---

# DEM/DSM

Support raster import.

Allow:

- Elevation visualisation
- Terrain
- Height estimation
- Building height calculation
- Elevation queries

---

# LIDAR

Implement:

- LAS/LAZ upload
- Point cloud metadata
- Point cloud visualisation
- Classification filters
- Bounding box
- Height measurement

If full server-side processing is unavailable, provide a working sample point-cloud workflow.

---

# SAMPLE DATA

Generate a coherent synthetic demo environment.

Create:

10 parcels
6 buildings
25+ property units
multiple floors
2 basements
3 underground utility networks
DEM
DSM
GNSS control points
sample LiDAR
sample orthophoto
sample building plans

All datasets must use the same coordinate reference system and geographically consistent coordinates.

---

# FLAGSHIP DEMO BUILDING

Create:

Urban Tower A

G + 5 floors
24 property units
2 basement levels

Add one underground utility that creates a deliberate spatial conflict.

The demo should allow the judge to:

1. Select parcel
2. Generate 3D building
3. Generate floors
4. Select apartment
5. View 3DSPID
6. Open underground mode
7. Detect utility conflict
8. Open validation
9. Correct geometry
10. Approve record
11. Generate PDF
12. Export data

---

# SECURITY

Implement:

- JWT authentication
- Password hashing
- RBAC
- Secure file upload
- File type validation
- API validation
- Rate limiting
- Audit logging
- Authorization checks

Never expose private ownership information to public users.

---

# PERFORMANCE

Use:

- Lazy loading
- Spatial indexes
- Background processing
- Caching
- 3D Tiles or equivalent tiled streaming
- Object storage
- Server-side processing

Do not load huge point clouds directly into browser memory.

---

# UI/UX

Design language:

Professional
Government-grade
GIS-focused
Modern
Minimal
Information-dense

Avoid:

- Neon gradients
- Gaming interfaces
- Excessive animations
- Generic SaaS layouts

Use subtle transitions only where they improve usability.

The map should be the primary visual focus.

---

# RESPONSIVENESS

Desktop-first because the application is GIS-heavy.

Also support:

- Tablet
- Smaller laptop screens

Do not compromise the 3D map experience.

---

# TESTING

Create:

- Unit tests
- API tests
- Geometry tests
- Spatial tests
- Authentication tests
- RBAC tests
- Upload tests
- Validation tests
- End-to-end tests

Test the complete flow:

Upload
→ Process
→ AI
→ 3D generation
→ Validation
→ Approval
→ Report

---

# DEVELOPMENT REQUIREMENTS

Do not build static mock pages.

All major buttons must work.

All important dashboard statistics must come from the database.

All map objects must be backed by actual data models.

All generated 3D properties must be selectable.

All validation results must be generated from actual geometry/data logic.

If an advanced capability cannot be fully implemented during the prototype, create a clearly labelled demo/simulation implementation and maintain a clean service abstraction for future production integration.

Do not use fake AI claims.

---

# FINAL QUALITY BAR

The finished application should feel like a real government geospatial platform rather than a hackathon landing page.

A judge should be able to understand the complete story within 3–5 minutes:

Traditional 2D parcel
→ 3D building
→ vertical floors
→ individual property volume
→ underground infrastructure
→ conflict detection
→ surveyor correction
→ authority approval
→ 3D property identity
→ downloadable cadastral report.

Prioritise working functionality over decorative UI.

Build the complete application, seed the database, create demo spatial datasets, configure the development environment, document setup instructions, and ensure the application runs locally with a single documented startup workflow.