# DevPulse

DevPulse es una plataforma de gestión de proyectos, tareas e incidentes diseñada para equipos de desarrollo de software. Su objetivo es centralizar la planificación, seguimiento y colaboración de equipos técnicos mediante una experiencia moderna inspirada en herramientas como Jira, Linear y GitHub.

## Características principales

### Autenticación y seguridad

* Registro e inicio de sesión con JWT.
* Verificación de cuenta mediante código de confirmación.
* Control de acceso basado en roles.
* Protección de rutas y recursos.

### Gestión de equipos

* Creación y administración de equipos.
* Invitación de miembros mediante correo electrónico.
* Aceptación de invitaciones mediante enlaces seguros.
* Gestión de roles y permisos dentro de cada equipo.

### Gestión de proyectos

* Creación de proyectos.
* Organización de tareas por proyecto.
* Seguimiento del progreso del equipo.
* Asignación de responsables.

### Sistema de tareas e incidencias

* Creación de tareas, bugs e incidentes.
* Estados de trabajo:

  * Backlog
  * Todo
  * In Progress
  * Review
  * Done
* Prioridades:

  * Low
  * Medium
  * High
  * Critical
* Asignación de responsables.
* Fechas límite y seguimiento de actividad.

### Sistema de comentarios

* Comentarios enriquecidos utilizando editor de texto avanzado.
* Menciones a miembros del equipo mediante `@usuario`.
* Adjuntos e imágenes almacenadas en la nube.
* Historial de conversaciones asociado a cada tarea.

## Arquitectura

DevPulse está construido siguiendo una arquitectura modular enfocada en escalabilidad y mantenibilidad.

### Frontend

* React
* TypeScript
* Material UI
* TanStack Query
* React Router
* React Hook Form

### Infraestructura

* Docker
* CI/CD
* Variables de entorno seguras

## Objetivos del proyecto

DevPulse nació con el propósito de aplicar buenas prácticas de desarrollo Full Stack y construir una solución cercana a escenarios reales de trabajo colaborativo.

Entre los conceptos implementados destacan:

* Arquitectura modular.
* Multi-tenancy.
* Gestión de permisos.
* Autenticación segura.
* Sistemas de invitación.
* Interfaces modernas y accesibles.
* Integración entre frontend y backend.


Desarrollado por **Breiner Parra** como proyecto Full Stack para demostrar habilidades en desarrollo web moderno, arquitectura de software y construcción de productos SaaS.
