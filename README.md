# JuegosLink · Frontend

Interfaz web de JuegosLink: explorá videojuegos, armá tu biblioteca con estados, favoritos y colecciones, puntuá, escribí reseñas y mirá tus estadísticas.

**Tecnologías:** React, Vite, React Router y Axios. Diseño propio hecho en Figma (negro, blanco y `#2DEFF2`).

## Cuenta demo

| Correo | Contraseña |
|---|---|
| `demo@juegoslink.com` | `Demo1234` |

## Correr en local

Requisitos: Node 20 o superior y el [backend](../TpFinal_Backend) corriendo.

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` a `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
3. Levantar el proyecto:
   ```bash
   npm run dev
   ```
   Queda en http://localhost:5173

## Vistas

| Vista | Qué se puede hacer |
|---|---|
| Inicio | Juego destacado y populares de la API, resumen personal, juegos en curso, actividad y colecciones |
| Explorar | Buscar por nombre y filtrar por género, plataforma y orden |
| Detalle | Datos del juego, agregar a la biblioteca, estado, horas, favorito, colecciones, puntuación y reseñas |
| Biblioteca | Pestañas por estado, filtro de favoritos, orden, cambio de estado y quitar juegos |
| Colecciones | Crear, renombrar y borrar colecciones, agregar y quitar juegos |
| Perfil | Avatar, nombre, bio, plataforma y géneros preferidos, favoritos y actividad |
| Estadísticas | Indicadores y gráficos calculados con tus datos |

## Publicación

Se publica en Vercel. El archivo `vercel.json` reenvía las rutas `/api/*` al backend en Render, así el front y la API comparten dominio, y hace que al recargar cualquier página se cargue la app.

En Vercel, la variable de entorno es `VITE_API_URL=/api`.

## Estructura

```
src/
├── api/          Cliente de Axios para el backend
├── services/     Llamadas a cada endpoint
├── context/      Sesión del usuario (AuthContext)
├── hooks/        useAuth y useDebounce
├── routes/       Rutas públicas y protegidas
├── layouts/      Navbar + contenido
├── pages/        Una carpeta por vista
├── components/   Componentes reutilizables (ui, games, stats, activity...)
├── styles/       Variables de diseño y estilos globales
└── utils/        Constantes y funciones de formato
```
