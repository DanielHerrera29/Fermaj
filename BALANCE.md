# Balance de Desarrollo - Plataforma Fermaj

## Resumen General

Plataforma de gestión de órdenes de instalación construida con **Next.js 16** y **Supabase**. Sistema multi-tenant que permite a diferentes organizaciones gestionar sus órdenes de servicio.

---

## Estado Actual del Proyecto

### Stack Tecnológico
- **Frontend/Backend**: Next.js 16.1.6 (App Router)
- **Base de Datos**: Supabase
- **UI**: React 19 + Tailwind CSS 4 + Shadcn UI
- **Excel**: XLSX library para parsing
- **Autenticación**: Cookies seguras + web_sessions table

---

## Módulos Completados

### 1. Autenticación ✅
- Login con email/password
- Sesiones con cookies
- Roles: superadmin, admin, user
- Multi-tenant: cada usuario pertenece a una organización

### 2. Dashboard ✅ (Recientes correcciones)
- **Problema resuelto**: Lasapis usaban nombres de columnas en inglés pero la BD tiene español
- **APIs corregidas**:
  - `/api/dashboard/summary` → usa `estado` en lugar de `status`
  - `/api/dashboard/stats` → usa `nombre_cliente`, `tipo_servicio`, `ciudad`, `estado`
- Ahora muestra:
  - Órdenes del mes (conteo real)
  - Últimas 10 órdenes creadas
  - Multi-tenant respetado
  - Admin puede ver todas las organizaciones

### 3. Upload de Órdenes ✅
- Parsing de Excel (columnas en español aceptadas)
- Mapeo automático: inglés → español antes de insertar
- Detección de duplicados por `nui`
- Validación de datos

### 4. Lista de Órdenes ✅
- Tabla con datos reales desde `/api/orders/list`
- Estados: nuevo, contactado, sugerido, programado, cancelado
- Filtrado por organización

### 5. Gestión de Usuarios ⚠️
- APIs creadas (`list`, `create`, `update`)
- Página de UI lista pero no conectada completamente

---

## Tabla de Estado

| Módulo | API | Frontend | Estado |
|--------|-----|----------|--------|
| Login/Auth | ✅ | ✅ | Completo |
| Dashboard | ✅ | ✅ | Completo |
| Órdenes - Upload | ✅ | ✅ | Completo |
| Órdenes - Lista | ✅ | ✅ | Completo |
| Órdenes - Detalle | ✅ | ⚠️ | Parcial |
| Usuarios | ✅ | ⚠️ | Por conectar |
| Organizaciones | ✅ | ❌ | Solo API |
| Configuración | ❌ | ❌ | Pendiente |
| Reportes | ❌ | ❌ | Pendiente |

---

## Correcciones Recientes (Hoy)

### Problema Identificado
Lasapis del dashboard(`summary` y `stats`) usaban nombres de columnas en inglés (`client_name`, `status`, etc.) pero la base de datos tiene columnas en español (`nombre_cliente`, `estado`, etc.).

### Solución Aplicada
1. `summary/route.ts`: Cambiado `status` → `estado`
2. `stats/route.ts`: Cambiado todos los campos a español
3. Agregado `organization_id` en respuesta para diferenciación visual

```typescript
// Antes (incorrecto)
.select("id, client_name, status, ...")

// Después (correcto)
.select("id, nombre_cliente, estado, ...")
```

---

## Mapeo de Campos (Regla Clave)

> **IMPORTANTE**: La base de datos NO se modifica. El código debe mapear entre inglés (frontend/API) y español (DB).

| English (Frontend) | Spanish (DB) |
|-------------------|-------------|
| client_name | nombre_cliente |
| client_phone | telefono |
| address | direccion |
| city | ciudad |
| service_type | tipo_servicio |
| status | estado |
| priority | prioridad |

---

## Reglas de Negocio Implementadas

### Multi-Tenant
- Usuarios normales → solo ven órdenes de su `organization_id`
- Admin/SuperAdmin → ven todas las organizaciones

### Roles
| Rol | Permiso |
|-----|--------|
| superadmin | Todas las orgs + gestión usuarios |
| admin | Su organización |
| user | Su organización |

---

## Pendiente / Siguiente Fase

### Alta Prioridad
1. **Diferenciación visual admin** - Bordes de color por organización en dashboard
2. **Conectar clients page** - Completar integración con API
3. **Filtros en orders** - Buscar por estado, fecha, ciudad

### Media Prioridad
4. **Reportes** - Página de chatbot report
5. **Settings** - Configuración de organización
6. **Exportar** - Descargar Excel

### Funcionalidades Futuras
- Notificaciones en tiempo real
- Historial de cambios (audit log)
- Dashboard analítico

---

## Build Status

```bash
npm run build  # ✅ Compila sin errores
npm run lint   # ✅ Sin warnings
```

---

## Conclusión

La plataforma tiene un **core funcional**:
- Autenticación trabajando
- Dashboard mostrando datos reales
- Upload de Excel operando
- Lista de órdenes conectada

**Listo para siguiente fase de desarrollo** con features de negocio adicionales.

---

*Última actualización: 2026-04-14*
*Proyecto: fermaj*