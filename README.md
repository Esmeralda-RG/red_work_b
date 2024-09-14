# Red Work - Backend

## Instrucciones
Al clonar el repositorio, ejecutar el siguiente comando para instalar las dependencias necesarias.

```bash
npm install
```

Para correr el servidor, ejecutar el siguiente comando.

```bash
npm start
```

Para correr el servidor en modo desarrollo, ejecutar el siguiente comando.

```bash
npm run dev
```
## Estructura de carpetas 

```bash
RED_WORK_BACKEND/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── types/
├── dist/
└── tests/
```
## Estructura de la base de datos 

### Colecciones

- **Workers:** Almacena la información de los trabajadores que ofrecen servicios a través de la plataforma.
- **Clients:** Almacena la información básica de los clientes que solicitan servicios en la plataforma.
- **Request:** Contiene las solicitudes de servicios realizadas por los clientes.
- **Reviews:** Almacena las calificaciones que los clientes dejan sobre los trabajadores una vez que se completa un servicio.
  
### Campos

#### Workers
- id
- name
- job
- experience
- location
- email
- password
- isAvailable
- availableTimestamp

#### Clients
- id
- name

#### Request
- id
- clientId
- workerId
- status
- dateCreated

#### Reviews
- id
- requestId
- clientId
- workerId
- rating
- comment
- dateReview

### Relaciones

1. Cada **cliente** (Clients) puede generar muchas **solicitudes** (Request) (1:N).
2. Cada **trabajador** (Workers) puede recibir muchas **solicitudes** (Request) (1:N).
3. Cada **solicitud** (Request) puede tener solo una **reseña** (Reviews) (1:1).
4. Cada **trabajador** (Workers) puede recibir muchas **reseñas** (Reviews) (1:N).
5. Cada **cliente** (Clients) puede dejar muchas **reseñas** (Reviews) (1:N).



