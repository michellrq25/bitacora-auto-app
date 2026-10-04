-- ==============================================================================
-- SCHEMA SUPABASE: BITÁCORA AUTO APP (PERÚ)
-- Mobile-First Vehicle Maintenance & Document Expiration Tracker
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA: vehiculos
CREATE TABLE IF NOT EXISTS public.vehiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(60) NOT NULL,
    anio INTEGER NOT NULL CHECK (anio >= 1970 AND anio <= 2100),
    kilometraje_actual INTEGER NOT NULL DEFAULT 0 CHECK (kilometraje_actual >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: mantenimientos
CREATE TABLE IF NOT EXISTS public.mantenimientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehiculo_id UUID NOT NULL REFERENCES public.vehiculos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    kilometraje INTEGER NOT NULL CHECK (kilometraje >= 0),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('preventivo', 'correctivo')),
    categoria VARCHAR(30) NOT NULL CHECK (
        categoria IN ('aceite', 'frenos', 'neumaticos', 'bateria', 'refrigeracion', 'general')
    ),
    costo NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (costo >= 0),
    taller TEXT,
    notas TEXT,
    proximo_servicio_km INTEGER CHECK (proximo_servicio_km IS NULL OR proximo_servicio_km >= 0),
    proximo_servicio_fecha DATE,
    
    -- Campos técnicos específicos de lubricantes
    aceite_marca VARCHAR(60),
    aceite_modelo VARCHAR(60),
    aceite_viscosidad VARCHAR(20),
    aceite_tipo VARCHAR(20) CHECK (
        aceite_tipo IS NULL OR aceite_tipo IN ('sintetico', 'semi-sintetico', 'mineral')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: documentos
CREATE TABLE IF NOT EXISTS public.documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehiculo_id UUID REFERENCES public.vehiculos(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(30) NOT NULL CHECK (
        tipo_documento IN ('SOAT', 'RevisionTecnica', 'LicenciaConducir', 'Otro')
    ),
    nombre_identificador VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(80),
    entidad_emisora VARCHAR(100),
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    responsable VARCHAR(20) NOT NULL CHECK (responsable IN ('auto', 'conductor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TRIGGER: ACTUALIZACIÓN AUTOMÁTICA DE ODÓMETRO
CREATE OR REPLACE FUNCTION public.trg_actualizar_odometro_vehiculo()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.vehiculos
    SET kilometraje_actual = NEW.kilometraje,
        updated_at = NOW()
    WHERE id = NEW.vehiculo_id
      AND NEW.kilometraje > kilometraje_actual;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mantenimiento_odometro ON public.mantenimientos;
CREATE TRIGGER trg_mantenimiento_odometro
AFTER INSERT OR UPDATE ON public.mantenimientos
FOR EACH ROW
EXECUTE FUNCTION public.trg_actualizar_odometro_vehiculo();

-- 6. TRIGGER: ACTUALIZAR updated_at EN vehiculos Y documentos
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vehiculos_updated_at ON public.vehiculos;
CREATE TRIGGER trg_vehiculos_updated_at
BEFORE UPDATE ON public.vehiculos
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_documentos_updated_at ON public.documentos;
CREATE TRIGGER trg_documentos_updated_at
BEFORE UPDATE ON public.documentos
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 7. SEGURIDAD: ROW LEVEL SECURITY (RLS)
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mantenimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para MVP (Permite operaciones públicas con clave anon o servicio)
DROP POLICY IF EXISTS "Acceso total a vehiculos" ON public.vehiculos;
CREATE POLICY "Acceso total a vehiculos" ON public.vehiculos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso total a mantenimientos" ON public.mantenimientos;
CREATE POLICY "Acceso total a mantenimientos" ON public.mantenimientos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso total a documentos" ON public.documentos;
CREATE POLICY "Acceso total a documentos" ON public.documentos FOR ALL USING (true) WITH CHECK (true);

-- 8. DATOS SEMILLA (PERÚ: SOAT, REVISIÓN TÉCNICA CITV, LICENCIA MTC)
DO $$
DECLARE
    v_vehiculo_id UUID;
BEGIN
    -- Insertar vehículo de demostración si no existe
    INSERT INTO public.vehiculos (placa, marca, modelo, anio, kilometraje_actual)
    VALUES ('ABC-123', 'Toyota', 'Yaris Hatchback', 2021, 48250)
    ON CONFLICT (placa) DO UPDATE 
    SET kilometraje_actual = EXCLUDED.kilometraje_actual
    RETURNING id INTO v_vehiculo_id;

    -- Semilla Documento: SOAT (Auto)
    INSERT INTO public.documentos (
        vehiculo_id, tipo_documento, nombre_identificador, 
        numero_documento, entidad_emisora, fecha_emision, 
        fecha_vencimiento, responsable
    ) VALUES (
        v_vehiculo_id, 'SOAT', 'SOAT Digital Electrónico',
        'POL-98471203', 'La Positiva Seguros', 
        CURRENT_DATE - INTERVAL '11 months',
        CURRENT_DATE + INTERVAL '25 days', -- En semáforo amarillo (por vencer)
        'auto'
    );

    -- Semilla Documento: Revisión Técnica CITV (Auto)
    INSERT INTO public.documentos (
        vehiculo_id, tipo_documento, nombre_identificador, 
        numero_documento, entidad_emisora, fecha_emision, 
        fecha_vencimiento, responsable
    ) VALUES (
        v_vehiculo_id, 'RevisionTecnica', 'Certificado Inspección Técnica Vehicular',
        'CITV-2024-88419', 'Farenet Lima Norte', 
        CURRENT_DATE - INTERVAL '6 months',
        CURRENT_DATE + INTERVAL '6 months', -- En semáforo verde (vigente)
        'auto'
    );

    -- Semilla Documento: Licencia de Conducir MTC (Conductor)
    INSERT INTO public.documentos (
        vehiculo_id, tipo_documento, nombre_identificador, 
        numero_documento, entidad_emisora, fecha_emision, 
        fecha_vencimiento, responsable
    ) VALUES (
        v_vehiculo_id, 'LicenciaConducir', 'Licencia Clase A Categoría I',
        'Q-45892104', 'Ministerio de Transportes y Comunicaciones (MTC)', 
        CURRENT_DATE - INTERVAL '4 years',
        CURRENT_DATE - INTERVAL '5 days', -- En semáforo rojo (vencido de ejemplo)
        'conductor'
    );

    -- Semilla Mantenimiento: Cambio de Aceite Técnico
    INSERT INTO public.mantenimientos (
        vehiculo_id, fecha, kilometraje, tipo, categoria, costo,
        taller, notas, proximo_servicio_km, proximo_servicio_fecha,
        aceite_marca, aceite_modelo, aceite_viscosidad, aceite_tipo
    ) VALUES (
        v_vehiculo_id,
        CURRENT_DATE - INTERVAL '2 months',
        45000,
        'preventivo',
        'aceite',
        185.00,
        'Lubricentro Express Surquillo',
        'Cambio de filtro de aceite original Toyota y arandela de cárter.',
        55000,
        CURRENT_DATE + INTERVAL '10 months',
        'Motul',
        '8100 X-cess Gen2',
        '5W-30',
        'sintetico'
    );
END $$;
