<h1 align="center">Sistema Web para Agilizar la Gestión Académica de la UNT</h1>

<p align="left">
  <img src="https://img.shields.io/badge/STATUS-EN%20DESARROLLO-green" alt="Estado del Proyecto">
</p>

---
## :hammer: Funcionalidades del Proyecto  
`Funcionalidad 1`: Gestión de Escuela  
`Funcionalidad 2`: Gestión de Departamentos Académicos  
`Funcionalidad 3`: Gestión de Docentes  
`Funcionalidad 4`: Gestión de Alumnos  
`Funcionalidad 5`: Gestión de Roles y Permisos  
`Funcionalidad 6`: Gestión de Horarios de Clase  
`Funcionalidad 7`: Gestión de Registro de Asignaturas  
`Funcionalidad 8`: Gestión de Sílabos  

---

## 🛠 Pre-requisitos  
**Herramientas necesarias:**  
- Node.js  
- Composer  
- PostgreSQL instalado y configurado  

Ejemplo:  
```bash
# Verifica que tienes Node.js instalado
node -v
# Verifica que tienes Composer instalado
composer --version
```

---

## :wrench: Instalación  

Sigue los pasos para tener un entorno de desarrollo funcionando:

1. **Clona el repositorio:**  
   ```bash
   git clone https://github.com/usuario/sistema-gestion-academica-UNT.git
   cd sistema-gestion-academica-UNT
   ```

2. **Instala dependencias del frontend:**  
   ```bash
   cd frontend
   npm install
   ```

3. **Instala dependencias del backend:**  
   ```bash
   cd ../backend
   composer install
   ```

4. **Configura la base de datos:**  
   - Crea una base de datos en PostgreSQL.  
   - Configura las credenciales en el archivo `.env`.

5. **Ejecuta las migraciones:**  
   ```bash
   php artisan migrate
   ```

6. **Inicia el servidor:**  
   ```bash
   php artisan serve
   ```

---

## :construction: Construido con 🛠  

- **Vue.js** – Framework para el frontend  
- **React.js** – Librería de frontend  
- **Laravel** – Framework para el backend  
- **PostgreSQL** – Gestor de base de datos  
- **TailAdmin** – Plantilla UI  

---

## :memo: Licencia  
Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).

---
