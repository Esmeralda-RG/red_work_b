# Red Work - Backend

## Instrucciones
Al clonar el repositorio, ejecutar el siguiente comando para instalar las dependencias necesarias.

> [!IMPORTANT]  
> Verifica tu archivo local .env y asegúrate de que las variables de entorno estén configuradas correctamente.

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
## Base de datos

Este proyecto usa **Firebase** como base de datos NoSQL, porque es escalable y permite manejar grandes volúmenes de datos de manera eficiente. Su capacidad de actualización en tiempo real es crucial para nuestra plataforma, ya que facilita la sincronización instantánea entre clientes y trabajadores. Además, Firebase se integra bien con otras herramientas y es fácil de configurar y usar, a la vez que permite organizar los datos de forma flexible. Sin embargo, dado que Firebase es un servicio de pago, en caso de que el flujo de datos crezca significativamente, podríamos considerar cambiar a otra base de datos más adecuada para manejar un volumen mayor.

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

Claro, aquí tienes un modelado detallado para tu proyecto en Firebase, siguiendo los principios y criterios que mencionaste.

## Modelado de Datos

#### Colección: `Workers`

```json
{
  "id": int,
  "name": string,
  "job": string,
  "experience": int,
  "location": {Lat: double,Lng: double},
  "email": string,
  "password": string,
  "isAvailable": boolean,
  "availableTimestamp": date
}
```

#### Colección: `Clients`

```json
{
  "id": int,
  "name": string
}
```

#### Colección: `Requests`

```json
{
  "id": int,
  "clientId": int,  // Referencia al cliente
  "workerId": int,  // Referencia al trabajador
  "status": string,
  "dateCreated": date,
}
```

#### Colección: `Reviews`

```json
{
  "id": int,
  "requestId": int,  // Referencia a la solicitud
  "clientId": int,    // Referencia al cliente
  "workerId": int,    // Referencia al trabajador
  "rating": int,
  "comment": string,
  "dateReview": date
}
```

### Diagrama de la Estructura de Datos

El diagrama a continuación muestra la estructura de colecciones y documentos con algunos casos de ejemplo, así como las referencias entre ellos:

```
Firestore
│
├── Workers
│   ├── workerId1:int
│   │   ├── name: string
│   │   ├── job: string
│   │   ├── experience: int
│   │   ├── location: {Lat: double,Lng: double}
│   │   ├── email: string
│   │   ├── password: string
│   │   ├── isAvailable: boolean
│   │   └── availableTimestamp: date
│   └── ...
│
├── Clients
│   ├── clientId1:int
│   │   ├── name: string
│   └── ...
│
├── Requests
│   ├── requestId1:int
│   │   ├── clientId: int  (refers to Clients)
│   │   ├── workerId: int  (refers to Workers)
│   │   ├── status: string
│   │   ├── dateCreated: date
│   └── ...
│
└── Reviews
    ├── reviewId1:int
    │   ├── requestId: int  (refers to Requests)
    │   ├── clientId: int   (refers to Clients)
    │   ├── workerId: int   (refers to Workers)
    │   ├── rating: int
    │   ├── comment: string
    │   └── dateReview: date
    └── ...
```

## Uso de `firestoreService.ts`

El archivo `src/services/firestoreService.ts` proporciona funciones para realizar operaciones básicas en Firestore.

### Funciones Disponibles

- `addData(collectionName: string, data: object)`
- `getData(collectionName: string)`
- `updateData(collectionName: string, docId: string, newData: object)`
- `deleteData(collectionName: string, docId: string)`

### Ejemplo de Uso

Para usar estas funciones en tus componentes, importa las funciones desde `firestoreService.ts`:

```typescript
import { addData, getData, updateData, deleteData } from '../services/firestoreService';
```
## Gestion de archivos de entorno (.env)

El archivo `.env` contiene variables de entorno, que son valores clave utilizados por la aplicación durante su ejecución. Estas variables permiten separar la configuración del código, facilitando la gestión de datos sensibles como contraseñas, claves de API, etc. Ademas este archivo tiene que ser diseñado para un entorno local.

### Archivo `.env.example`

```bash
# Archivo .env.example para Backend
GOOGLE_APPLICATION_CREDENTIALS=
```
> [!IMPORTANT]  
> Cada desarrollador debe copiar este archivo y renombrarlo como .env, luego rellenar los valores correspondientes.

### Configuración en el código

*explicacion de los scripts






