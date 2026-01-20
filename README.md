# 📊 Sistema de Gestión de Ventas (Sales MGMT)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/Frontend-Angular%2017%2B-red)
![.NET](https://img.shields.io/badge/Backend-.NET%208-purple)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)

Una solución Full Stack robusta para la gestión de inventarios, puntos de venta (POS) y análisis de datos en tiempo real. Diseñado para optimizar el flujo de trabajo de pequeños y medianos comercios.

**🔗 Demo en Vivo:** [Ver Aplicación Desplegada](https://sales-system-alpha.vercel.app)  
**📄 Documentación API:** [Swagger UI](https://sales-system-jrt2.onrender.com/swagger)

---

## 📸 Capturas de Pantalla

<div align="center">
<img width="1858" height="984" alt="image" src="https://github.com/user-attachments/assets/065a90d0-9156-48f5-a1b3-e1d3d9e3e58f" />
</div>

---

## 🚀 Características Principales

*   **Dashboard Interactivo:** Gráficos en tiempo real (Ingresos, Ventas, Categorías) usando Chart.js.
*   **Gestión de Productos:** CRUD completo con carga de imágenes optimizada mediante **Cloudinary**.
*   **Punto de Venta (POS):** Interfaz ágil para registrar ventas, cálculo automático de totales y stock.
*   **Autenticación y Seguridad:** Login seguro con **JWT**, roles de usuario (Admin/Empleado) y protección de rutas.
*   **Gestión de Perfil:** Actualización de datos de usuario y foto de perfil en tiempo real.
*   **Reportes:** Exportación de historial de ventas a Excel.
*   **Diseño Responsivo:** Interfaz adaptada a móviles y escritorio con Angular Material y Tailwind-like CSS.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
*   **Framework:** Angular 17+ (Standalone Components).
*   **UI Library:** Angular Material.
*   **Estilos:** CSS personalizado & Flexbox/Grid.
*   **Gráficos:** ng2-charts / Chart.js.
*   **Despliegue:** Vercel.

### Backend
*   **Framework:** ASP.NET Core Web API (.NET 8).
*   **ORM:** Entity Framework Core (Code First).
*   **Base de Datos:** PostgreSQL (Alojada en Neon Tech).
*   **Almacenamiento:** Cloudinary (Imágenes).
*   **Documentación:** Swagger / OpenAPI.
*   **Despliegue:** Render (Dockerizado).

---

## ⚙️ Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu máquina local.

### Prerrequisitos
*   Node.js (v18+)
*   .NET SDK 8.0
*   PostgreSQL

### 1. Backend (.NET)

#### Clonar repositorio
git clone https://github.com/C-Ford17/sales-system.git
cd sales-system/backend

#### Configurar variables de entorno (appsettings.Development.json o User Secrets)
Asegúrate de tener tu cadena de conexión a PostgreSQL
#### Restaurar dependencias
dotnet restore

#### Ejecutar migraciones (Crear BD)
dotnet ef database update

#### Correr el servidor
dotnet watch run

### 2. Frontend (Angular)

cd sales-system/frontend/sales-system-web

#### Instalar dependencias
npm install

#### Correr servidor de desarrollo
ng serve


Visita `http://localhost:4200` en tu navegador.

---

## 🔑 Variables de Entorno

Para que el proyecto funcione correctamente, necesitas configurar las siguientes variables.

**Backend (.env o Environment Variables):**

DATABASE_URL="Host=...;Port=5432;Database=...;Username=...;Password=...;SSL Mode=Require;"  
JWT_SECRET_KEY="tu_clave_super_secreta_minimo_32_caracteres"  
ALLOWED_ORIGINS="http://localhost:4200,https://tu-app-vercel.app"  
CLOUDINARY_CLOUD_NAME="..."  
CLOUDINARY_API_KEY="..."  
CLOUDINARY_API_SECRET="..."  


**Frontend (environment.prod.ts):**

export const environment = {
production: true,
apiUrl: 'https://tu-api-render.com/api'
};


---

## 🐳 Despliegue (Docker & Cloud)

El proyecto incluye un `Dockerfile` optimizado para el backend.

1.  **Backend:** Desplegado en **Render** como Web Service usando Docker.
2.  **Frontend:** Desplegado en **Vercel** conectado al repositorio de GitHub.
3.  **Base de Datos:** Instancia Serverless en **Neon Tech**.

---

## Test App
user: admin@sales.com
password: admin123

---

**Desarrollado por Christian** - 2025
