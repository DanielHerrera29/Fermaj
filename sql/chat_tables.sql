-- =====================================================
-- CHATBOT TABLES FOR FERMAJ WEB
-- =====================================================

-- Tabla de sesiones de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_order_id UUID REFERENCES external_orders(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    telefono TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'contactado', 'respondido', 'confirmado', 'cerrado')),
    modo_test BOOLEAN DEFAULT false,
    created_by UUID REFERENCES web_users(id),
    closed_at TIMESTAMP WITH TIME ZONE,
    closed_by UUID REFERENCES web_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('bot', 'user')),
    message TEXT NOT NULL,
    twilio_sid TEXT,
    direction TEXT NOT NULL CHECK (direction IN ('outbound', 'inbound')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_chat_sessions_external_order ON chat_sessions(external_order_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_organization ON chat_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_estado ON chat_sessions(estado);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- =====================================================
-- AGREGAR ESTADO 'confirmado' A EXTERNAL_ORDERS
-- =====================================================
-- Verificar valores actuales del check constraint
-- El constraint debe permitir 'confirmado', agregar si es necesario

-- Para agregar el estado 'confirmado', primero verificar el tipo:
DO $$
DECLARE
    col_type TEXT;
BEGIN
    SELECT pg_type.enumlabel INTO col_type
    FROM pg_type
    JOIN pg_enum ON pg_enum.oid = pg_type.enumtypid
    WHERE pg_enum.enumlabel = 'confirmado'
    AND pg_type.typname = 'external_orders_estado_check';

    IF NOT FOUND THEN
        RAISE NOTICE 'Estado confirmado no existe aún. Verificar constraint manually.';
    END IF;
END $$;

-- =====================================================
-- CONFIGURACIÓN DE TWILIO (EN organizations)
-- =====================================================
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS twilio_account_sid TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS twilio_auth_token TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS twilio_phone_number TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS modo_test BOOLEAN DEFAULT false;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS test_phone_number TEXT;

-- =====================================================
-- MENSAJE INICIAL POR DEFECTO
-- =====================================================
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS mensaje_inicial TEXT DEFAULT 'Hola {nombre_cliente}, te contactamos de {empresa}. Tenemos tu solicitud de {tipo_servicio}. ¿Deseas agendar tu instalación?';

-- =====================================================
-- HABILITAR RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para chat_sessions
DROP POLICY IF EXISTS "chat_sessions org policy" ON chat_sessions;
CREATE POLICY "chat_sessions org policy" ON chat_sessions
    FOR SELECT USING (
        organization_id = current_setting('app.current_organization_id', true)::UUID
        OR EXISTS (
            SELECT 1 FROM web_users
            WHERE web_users.id = current_setting('app.current_user_id', true)::UUID
            AND web_users.role IN ('superadmin', 'admin')
            AND web_users.organization_id = chat_sessions.organization_id
        )
    );

-- Políticas RLS para chat_messages
DROP POLICY IF EXISTS "chat_messages session policy" ON chat_messages;
CREATE POLICY "chat_messages session policy" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE chat_sessions.id = chat_messages.session_id
            AND (
                chat_sessions.organization_id = current_setting('app.current_organization_id', true)::UUID
                OR EXISTS (
                    SELECT 1 FROM web_users
                    WHERE web_users.id = current_setting('app.current_user_id', true)::UUID
                    AND web_users.role = 'superadmin'
                )
            )
        )
    );