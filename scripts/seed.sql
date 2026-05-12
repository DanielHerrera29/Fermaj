-- ==========================================
-- DATOS DE PRUEBA - FERMAJ
-- ==========================================

-- -----------------------------------------------------
-- ORGANIZATIONS
-- -----------------------------------------------------
INSERT INTO organizations (id, name, logo_url, active, created_at) VALUES
('org-samsung', 'Samsung', '/logos/samsung.png', true, NOW()),
('org-lg', 'LG', '/logos/lg.png', true, NOW()),
('org-compuspar', 'Compuspar', '/logos/compuspar.png', true, NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url,
  active = EXCLUDED.active;

-- -----------------------------------------------------
-- WEB_USERS
-- -----------------------------------------------------
-- Superadmin (sin organization_id)
INSERT INTO web_users (id, email, password_hash, nombre, organization_id, role, active, created_at) VALUES
('user-superadmin', 'admin@fermaj.com', '$2a$12$GcQqRfI1gb/Gs4LwtIeFqOxj1PkAPgbg3sa62WYU2sneGbJOz38mm', 'Daniel', NULL, 'superadmin', true, NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nombre = EXCLUDED.nombre,
  organization_id = EXCLUDED.organization_id,
  role = EXCLUDED.role;

-- Admin por organización
INSERT INTO web_users (id, email, password_hash, nombre, organization_id, role, active, created_at) VALUES
('user-samsung', 'admin@samsung.com', '$2a$12$GcQqRfI1gb/Gs4LwtIeFqOxj1PkAPgbg3sa62WYU2sneGbJOz38mm', 'Carlos Samsung', 'org-samsung', 'admin', true, NOW()),
('user-lg', 'admin@lg.com', '$2a$12$GcQqRfI1gb/Gs4LwtIeFqOxj1PkAPgbg3sa62WYU2sneGbJOz38mm', 'Maria LG', 'org-lg', 'admin', true, NOW()),
('user-compuspar', 'admin@compuspar.com', '$2a$12$GcQqRfI1gb/Gs4LwtIeFqOxj1PkAPgbg3sa62WYU2sneGbJOz38mm', 'Pedro Compuspar', 'org-compuspar', 'admin', true, NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nombre = EXCLUDED.nombre,
  organization_id = EXCLUDED.organization_id,
  role = EXCLUDED.role;

-- -----------------------------------------------------
-- EXTERNAL_ORDERS (datos de ejemplo)
-- -----------------------------------------------------
INSERT INTO external_orders (id, organization_id, orden_servicio_id, client_name, client_document, client_email, client_phone, service_type, service_description, address, city, region, status, created_at) VALUES
('ext-001', 'org-samsung', 'ORD-001', 'Juan Perez', '12345678', 'juan@samsung.com', '3001234567', 'instalacion', 'Instalación Televisor Samsung 55"', 'Calle 10 #20-30', 'Bogotá', 'Cundinamarca', 'pending', NOW() - INTERVAL '5 days'),
('ext-002', 'org-samsung', 'ORD-002', 'Ana Gomez', '87654321', 'ana@samsung.com', '3002345678', 'mantenimiento', 'Mantenimiento AA Samsung', 'Carrera 15 #40-50', 'Medellín', 'Antioquia', 'in_progress', NOW() - INTERVAL '3 days'),
('ext-003', 'org-samsung', 'ORD-003', 'Pedro Lopez', '11223344', 'pedro@samsung.com', '3003456789', 'instalacion', 'Instalación Lavadora Samsung', 'Avenida 5 #15-25', 'Cali', 'Valle del Cauca', 'completed', NOW() - INTERVAL '10 days'),
('ext-004', 'org-lg', 'ORD-004', 'Maria Rodriguez', '55667788', 'maria@lg.com', '3004567890', 'instalacion', 'Instalación Televisor LG 65"', 'Calle 20 #30-40', 'Bogotá', 'Cundinamarca', 'pending', NOW() - INTERVAL '2 days'),
('ext-005', 'org-lg', 'ORD-005', 'Luis Martinez', '99887766', 'luis@lg.com', '3005678901', 'mantenimiento', 'Mantenimiento Refrigerador LG', 'Carrera 30 #50-60', 'Barranquilla', 'Atlántico', 'completed', NOW() - INTERVAL '7 days'),
('ext-006', 'org-compuspar', 'ORD-006', 'Laura Sanchez', '44332211', 'laura@compuspar.com', '3006789012', 'instalacion', 'Instalación Computador', 'Calle 5 #10-20', 'Bogotá', 'Cundinamarca', 'in_progress', NOW() - INTERVAL '1 day'),
('ext-007', 'org-samsung', 'ORD-007', 'Carlos Diaz', '66554433', 'carlos@samsung.com', '3007890123', 'instalacion', 'Instalación Samsung 50"', 'Avenida 40 #60-70', 'Medellín', 'Antioquia', 'pending', NOW())
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status;

-- -----------------------------------------------------
-- ORDENES_SERVICIO (tabla existente - ejemplo)
-- -----------------------------------------------------
INSERT INTO ordenes_servicio (id, orden_externa_id, estado, tecnico_asignado, fecha_programada, fecha_inicio, fecha_fin, observaciones, created_at) VALUES
('ORD-001', 'ext-001', 'pendiente', NULL, NOW() + INTERVAL '2 days', NULL, NULL, 'Orden creada desde dashboard', NOW()),
('ORD-002', 'ext-002', 'en_progreso', 'Tecnico 1', NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL, 'En reparación', NOW()),
('ORD-003', 'ext-003', 'finalizado', 'Tecnico 2', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days', 'Instalación completada exitosa', NOW()),
('ORD-004', 'ext-004', 'pendiente', NULL, NOW() + INTERVAL '3 days', NULL, NULL, 'Orden creada desde dashboard', NOW()),
('ORD-005', 'ext-005', 'finalizado', 'Tecnico 1', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', 'Mantenimiento completado', NOW()),
('ORD-006', 'ext-006', 'en_progreso', 'Tecnico 3', NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL, 'En proceso de instalación', NOW()),
('ORD-007', 'ext-007', 'pendiente', NULL, NOW() + INTERVAL '1 day', NULL, NULL, 'Orden creada desde dashboard', NOW())
ON CONFLICT (id) DO UPDATE SET
  estado = EXCLUDED.estado,
  tecnico_asignado = EXCLUDED.tecnico_asignado;

-- ==========================================
-- VERIFICAR DATOS
-- ==========================================
SELECT 'Organizations' as tabla, COUNT(*) as total FROM organizations
UNION ALL
SELECT 'Web Users', COUNT(*) FROM web_users
UNION ALL
SELECT 'External Orders', COUNT(*) FROM external_orders
UNION ALL
SELECT 'Ordenes Servicio', COUNT(*) FROM ordenes_servicio;