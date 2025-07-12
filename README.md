# Bloc de Notas - Aplicación React con Funcionalidad Offline

Una aplicación de bloc de notas moderna construida con React, TypeScript y Tailwind CSS que permite crear, editar y gestionar notas con funcionalidad offline completa.

## 🚀 Características

- **Editor de texto rico** con React Quill
- **Autenticación de usuarios** con sistema de login
- **Funcionalidad offline completa** usando IndexedDB (Dexie)
- **Sincronización automática** cuando se restaura la conexión
- **Interfaz moderna y responsiva** con Tailwind CSS
- **Búsqueda de notas** en tiempo real
- **Notificaciones** con react-hot-toast

## 🛠️ Tecnologías Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- React Quill (Editor de texto rico)
- Dexie (IndexedDB wrapper)
- React Hot Toast (Notificaciones)
- Axios (Cliente HTTP)

## 📦 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd notes-app
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm start
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciales de Prueba

Para acceder a la aplicación, usa estas credenciales:

- **Email:** `admin@example.com`
- **Contraseña:** `password`

## 📱 Funcionalidades

### Autenticación
- Sistema de login seguro
- Persistencia de sesión
- Protección de rutas

### Gestión de Notas
- Crear nuevas notas con título y contenido
- Editor de texto rico con múltiples opciones de formato
- Editar notas existentes
- Eliminar notas
- Búsqueda en tiempo real

### Funcionalidad Offline
- Las notas se guardan localmente cuando no hay conexión
- Indicador visual de estado offline
- Sincronización automática cuando se restaura la conexión
- Marcado de notas no sincronizadas

### Interfaz de Usuario
- Diseño responsivo para móviles y escritorio
- Navegación intuitiva
- Notificaciones de estado
- Indicadores de carga

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── Dashboard.tsx    # Componente principal
│   ├── Login.tsx        # Formulario de login
│   ├── NoteEditor.tsx   # Editor de notas
│   └── NotesList.tsx    # Lista de notas
├── contexts/            # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── db/                  # Base de datos local
│   └── database.ts      # Configuración de Dexie
├── services/            # Servicios
│   ├── api.ts           # Configuración de axios
│   ├── userServices.ts  # Servicios de usuarios con React Query
│   ├── noteServices.ts  # Servicios de notas con React Query
│   └── syncService.ts   # Servicio de sincronización
└── App.tsx              # Componente principal
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración de la API
REACT_APP_API_URL=http://localhost:3001/

# Configuración de desarrollo
REACT_APP_ENV=development
```

### Endpoints del Backend
La aplicación espera los siguientes endpoints en tu backend:

#### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `POST /api/auth/logout` - Logout

#### Notas
- `GET /api/notes?userId={userId}` - Obtener notas del usuario
- `GET /api/notes/{id}` - Obtener nota específica
- `POST /api/notes` - Crear nueva nota
- `PUT /api/notes/{id}` - Actualizar nota
- `DELETE /api/notes/{id}` - Eliminar nota
- `POST /api/notes/sync` - Sincronizar notas offline
- `GET /api/notes/search?userId={userId}&q={query}` - Buscar notas

### Personalización
- Modifica los colores en `tailwind.config.js`
- Ajusta las opciones del editor en `NoteEditor.tsx`
- Configura la base de datos en `database.ts`

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Despliegue en Netlify
1. Conecta tu repositorio a Netlify
2. Configura el comando de build: `npm run build`
3. Configura el directorio de publicación: `build`

### Despliegue en Vercel
1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`

## 🔮 Próximas Mejoras

- [ ] Integración con backend real
- [ ] Compartir notas
- [ ] Categorías y etiquetas
- [ ] Exportar notas (PDF, Markdown)
- [ ] Temas oscuro/claro
- [ ] Sincronización en tiempo real
- [ ] Notificaciones push

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
