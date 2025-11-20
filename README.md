# MediTrack - Sistema de Historia Clínica Electrónica

Sistema web desarrollado en Angular 17+ para la gestión de historias clínicas electrónicas con enfoque en analítica y optimización de flujo.

## Características Principales

- **Autenticación y Roles**: Sistema de autenticación JWT Supabase con tres roles (Doctor, Paciente, Admin)
- **Módulos con Lazy Loading**: Arquitectura modular y escalable
- **Dashboard por Rol**: Vistas personalizadas según el tipo de usuario
- **Historia Clínica Digital**: Gestión completa de historias clínicas con timeline visual
- **Analítica Avanzada**: Dashboard administrativo con métricas y visualizaciones
- **Tema Claro/Oscuro**: Soporte para modo claro y oscuro
- **Diseño Responsive**: Interfaz adaptable a diferentes dispositivos
- **Accesibilidad**: Implementación básica de WCAG
## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/              # Módulo de administración
│   │   ├── components/
│   │   │   ├── dashboard/  # Dashboard con analytics
│   │   │   └── users/      # Gestión de usuarios
│   ├── auth/               # Módulo de autenticación
│   │   └── components/
│   │       └── login/      # Componente de login
│   ├── core/               # Módulo core (servicios, guards, modelos)
│   │   ├── guards/         # AuthGuard, RoleGuard
│   │   ├── interceptors/   # AuthInterceptor
│   │   ├── models/         # Modelos de datos
│   │   └── services/       # Servicios principales
│   ├── doctor/             # Módulo del doctor
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── pacientes/
│   │   │   ├── patient-detail/
│   │   │   └── calendar/
│   ├── paciente/           # Módulo del paciente
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── historia/
│   │   │   ├── medicamentos/
│   │   │   └── citas/
│   ├── shared/             # Módulo compartido
│   │   └── components/
│   │       ├── layout/
│   │       ├── header/
│   │       ├── sidebar/
│   │       ├── card/
│   │       └── power-bi-embed/
│   └── components/
│       └── home/           # Página de inicio
```

## 🔐 Autenticación y Roles

El sistema implementa tres roles principales:

- **Doctor**: Acceso a dashboard, gestión de pacientes, historias clínicas y calendario
- **Paciente**: Acceso a su propio dashboard, historia clínica, medicamentos y citas
- **Admin**: Acceso a dashboard administrativo con analytics y gestión de usuarios

## 📊 Analytics

El módulo de administración incluye:
- Métricas generales (pacientes, doctores, consultas, ingresos)
- Gráficos de pacientes por doctor
- Gráficos de ingresos mensuales
- Distribución de especialidades
- Métricas por doctor (productividad, cancelaciones)

## 🎨 Temas

El sistema soporta modo claro y oscuro. El tema se puede cambiar desde el header y se guarda en localStorage.

## 🛡️ Seguridad

- Guards para proteger rutas privadas
- Role-based access control (RBAC)
- Interceptor para agregar tokens JWT
- Validación de formularios

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora.
