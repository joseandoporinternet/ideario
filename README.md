# Ideario 📝

Una aplicación de notas rápida y minimalista, construida con **React** y **Vite**, y potenciada por **PocketBase** como backend todo en uno.
Puedes probarla aqui: [APPWeb](https://ideario-production.up.railway.app/)

![GIF o Screenshot del Proyecto](https://pocketbase-production-026e.up.railway.app/api/files/pbc_3446931122/7u7fbycc9o5168j/ideario_ss_9t8hll387k.PNG?token=)

---

## ✨ El Protagonista: PocketBase

Este proyecto es un excelente caso de estudio para demostrar el poder y la simplicidad de **PocketBase**, un backend open-source escrito en Go que ofrece una solución completa en un único archivo ejecutable.

En **Ideario**, PocketBase se encarga de:

* **Autenticación de Usuarios**: Maneja el registro e inicio de sesión de forma segura y con mínima configuración.
* **Base de Datos**: Almacena todas las notas (título, contenido, etc.) en una base de datos SQLite integrada.
* **API RESTful**: Provee automáticamente los endpoints necesarios para las operaciones CRUD (Crear, Leer, Actualizar, Borrar) de las notas.
* **Gestión de Archivos**: Permite la subida y gestión de imágenes dentro de las notas (si se implementa esa funcionalidad).

La elección de PocketBase permitió un desarrollo del backend casi instantáneo, eliminando la necesidad de configurar servidores complejos, bases de datos externas o escribir lógica de API desde cero.

---

## 🚀 Características

* **Editor de Texto Enriquecido**: Gracias a **Tiptap**, ofrece una experiencia de escritura fluida y con formato (títulos, listas, negritas, etc.).
* **Autenticación Completa**: Registro e inicio de sesión de usuarios.
* **Gestión de Notas (CRUD)**: Crea, visualiza, edita y elimina tus notas fácilmente.
* **Diseño Limpio y Responsivo**: Una interfaz inspirada en Notion, agradable y funcional en cualquier dispositivo.
* **Backend Eficiente**: Todo el poder de PocketBase en un único lugar.

---

## 🛠️ Tech Stack

* **Frontend**: [React](https://reactjs.org/) con [Vite](https://vitejs.dev/)
* **Backend**: [PocketBase](https://pocketbase.io/)
* **Editor de Texto**: [Tiptap](https://tiptap.dev/)
* **Lenguaje**: JavaScript (ES6+)
* **Estilos**: CSS puro con variables para un diseño moderno.

---

## ⚙️ Instalación y Uso

Para correr este proyecto localmente, sigue estos pasos:

### Prerrequisitos

1.  **Node.js**: Asegúrate de tener Node.js instalado (v18 o superior).
2.  **PocketBase**:
    * Descarga la última versión de [PocketBase](https://pocketbase.io/docs/).
    * Descomprímelo y ejecuta `./pocketbase serve`.
    * Ve a `http://127.0.0.1:8090/_/` para acceder al Panel de Administración.
    * Crea las colecciones necesarias (`users` ya viene por defecto) y `notes` (con campos como `title`, `content`, y una relación con el usuario).

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/ideario.git](https://github.com/tu-usuario/ideario.git)
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd ideario
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Configura la conexión a PocketBase:**
    * Abre el archivo `src/services/pocketbase.js`.
    * Asegúrate de que la URL de PocketBase coincida con la tuya (por defecto es `http://127.0.0.1:8090`).

5.  **Inicia la aplicación en modo desarrollo:**
    ```bash
    npm run dev
    ```
    ¡Y listo! La aplicación debería estar corriendo en `http://localhost:5173`.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.
