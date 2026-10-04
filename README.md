# 🚗 Bitácora Auto Perú (Mobile-First App)

Aplicación web progresiva (**PWA / Mobile-First**) diseñada específicamente para el control integral de vehículos en **Perú**: vencimiento de documentos normativos oficiales (**SOAT**, **Revisión Técnica CITV** y **Licencia de Conducir MTC**), registro histórico y técnico de mantenimientos con detalle de lubricantes, control digital de odómetro y alertas automáticas vía **Telegram Bot**.

---

## 📱 Características Principales

1. **Dashboard Digital del Vehículo:**
   - Visualización de odómetro digital con edición rápida.
   - Semáforo de alertas críticas para documentos por vencer o vencidos.
   - Cálculo acumulado de inversión total en mantenimientos en Soles (`S/`).
   - Acceso rápido a registro de servicios.

2. **Control Normativo de Documentos (Perú):**
   - **SOAT:** Aseguradoras registradas en SBS (*Rímac, Pacífico, La Positiva, Mapfre, Interseguro*).
   - **Inspección Técnica Vehicular (CITV):** Plantas autorizadas (*Farenet, Lidercon, I.T.V. Cambridge, Cedit, Revitec*).
   - **Licencia de Conducir Brevete MTC:** Categorías oficiales (*A-I, A-IIa, A-IIb, A-IIIa, A-IIIb, A-IIIc*).
   - Cálculo automático de días restantes con código de colores (Verde > 30 días, Amarillo ≤ 30 días, Rojo vencido).

3. **Mantenimientos Técnicos y Lubricantes:**
   - Registro de servicios preventivos y correctivos.
   - Catálogo de marcas de lubricantes (*Motul, Castrol, Mobil 1, Shell Helix, Liqui Moly, Valvoline, etc.*) con viscosidades SAE (*0W-20, 5W-30, 10W-40, etc.*).
   - Sugerencia inteligente de próximo servicio por kilometraje y fecha según el tipo de aceite (*Sintético +10,000 km / 12 meses, Mineral/Semi +5,000 km / 6 meses*).

4. **Alertas Diarias Automáticas (Telegram Bot):**
   - Tarea programada en `vercel.json` ejecutada a las **08:00 AM (hora de Lima)**.
   - Endpoint seguro `/api/cron-alertas` protegido con `CRON_SECRET`.
   - Envío de reporte con formato visual HTML directo al chat de Telegram del conductor.

---

## 🛠️ Tecnologías y Arquitectura

- **Framework:** Next.js 14 (App Router) + TypeScript estricto.
- **Estilos:** Tailwind CSS con diseño Mobile-First y safe areas para notch de smartphones.
- **Base de Datos:** Supabase (PostgreSQL) con Row Level Security (RLS).
- **Notificaciones:** Telegram Bot API REST directa (sin SDKs pesados).
- **Iconografía:** Lucide React + SolesIcon personalizado.
- **Despliegue:** Vercel con Vercel Cron Jobs.

---

## 🚀 Instalación y Configuración Local

### 1. Clonar el repositorio e instalar dependencias:
```bash
git clone https://github.com/michellrq25/bitacora-auto-app.git
cd bitacora-auto-app
npm install
```

### 2. Variables de entorno:
Crear el archivo `.env.local` basado en `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

TELEGRAM_BOT_TOKEN=tu-bot-token
TELEGRAM_CHAT_ID=tu-chat-id
CRON_SECRET=tu-token-secreto-cron
```

### 3. Base de Datos en Supabase:
Ejecutar el script SQL incluido en `supabase/schema.sql` en el **SQL Editor** de Supabase para crear las tablas, índices, triggers y datos semilla.

### 4. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador móvil o emulador.

---

## 📄 Licencia

MIT License © 2026 Michell Ramirez
