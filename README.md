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

El modelado de la estructura de datos vista anteriormente para la base de datos `NoSQL Firestore`, se deben seguir principios diferentes de los de una base de datos relacional como SQL(con sus diagramas ERD). En `Firestore`, los datos se almacenan en `documentos` que forman parte de `colecciones`, y los ``documentos`` pueden anidar más colecciones y subcolecciones. Ademas Firestore no soporta las relaciones entre colecciones como en una base de datos relacional, por lo que se deben tener en cuenta las relaciones entre los documentos para poder realizar consultas eficientes.

Para nuestro caso se planteará usar las tecnicas de modelado de datos para Firestore, que se basan en la ``denormalización`` y la ``duplicación de datos`` lo cual ayuda a optimizar las consultas y la velocidad de recuperación de datos debido a que se evita la necesidad de realizar múltiples consultas para obtener información relacionada. 

Dicho esto, a continuación se presenta un modelo de datos para ``RedWork``, que incluye las colecciones necesarias y los campos requeridos para cada documento. Además, se describen las relaciones entre los documentos y cómo se representan en Firestore.


#### Colección: `Workers`
- Almacena información sobre los trabajadores disponibles.
- Cada documento representa un trabajador individual.

```json
{
  "id": "workerId1",
  "name": "John Doe",
  "job": "Electrician",
  "experience": 5,
  "location": "City X",
  "email": "johndoe@example.com",
  "password": "hashed_password",
  "isAvailable": true,
  "availableTimestamp": "2024-09-15T14:20:00Z"
}
```

#### Colección: `Clients`
- Almacena información sobre los clientes.
- Cada documento representa un cliente individual.

```json
{
  "id": "clientId1",
  "name": "Jane Smith"
}
```

#### Colección: `Requests`
- Almacena las solicitudes realizadas por los clientes.
- Cada documento representa una solicitud individual.

```json
{
  "id": "requestId1",
  "clientId": "clientId1",  // Referencia al cliente
  "workerId": "workerId1",  // Referencia al trabajador
  "status": "pending",
  "dateCreated": "2024-09-15T12:30:00Z",
  "clientName": "Jane Smith",  // Duplicado para facilitar consultas
  "workerName": "John Doe"     // Duplicado para facilitar consultas
}
```

#### Colección: `Reviews`
- Almacena las reseñas dejadas por los clientes para los trabajadores.
- Cada documento representa una reseña individual.

```json
{
  "id": "reviewId1",
  "requestId": "requestId1",  // Referencia a la solicitud
  "clientId": "clientId1",    // Referencia al cliente
  "workerId": "workerId1",    // Referencia al trabajador
  "rating": 5,
  "comment": "Great service!",
  "dateReview": "2024-09-16T14:00:00Z"
}
```

### Relaciones en el Modelado

Para el caso de las relaciones entre documentos/nodos estas se representan mediante campos de referencia como lo son (`clientId`, `workerId`, `requestId`), los cuales vinculan documentos en diferentes colecciones. Esta estructura permite consultar y asociar datos de manera eficiente, reflejando las relaciones de uno a muchos y uno a uno planteadas en la estructura en el manejo que se tendrá en la base de datos no relacion de Firebase(Firestore).

Adicionalmente se ha duplicado información como `clientName` y `workerName` en `Requests` para facilitar consultas rápidas y evitar la necesidad de realizar múltiples consultas para obtener datos relacionados.

Estas practicas mencionadas anteriormente son comunmente utilizadas para el modelado de datos en las bases de datos no relaciones (noSQL) como Firebase.

1. **Relación 1:N entre `Clients` y `Requests`**:
   - Cada cliente puede crear muchas solicitudes. En el modelo, esto se refleja al almacenar `clientId` en cada documento de la colección `Requests`. De esta manera, puedes recuperar todas las solicitudes hechas por un cliente específico utilizando `clientId`.
   - **Ejemplo**: Si `clientId1` crea 3 solicitudes, cada una de esas solicitudes tendrá `clientId` igual a `clientId1`.

2. **Relación 1:N entre `Workers` y `Requests`**:
   - Cada trabajador puede recibir muchas solicitudes. En el modelo, esto se refleja al almacenar `workerId` en cada documento de la colección `Requests`. Así, puedes obtener todas las solicitudes asignadas a un trabajador específico usando `workerId`.
   - **Ejemplo**: Si `workerId1` tiene 5 solicitudes asignadas, cada una tendrá `workerId` igual a `workerId1`.

3. **Relación 1:1 entre `Requests` y `Reviews`**:
   - Cada solicitud puede tener solo una reseña. Esto se refleja al almacenar `requestId` en cada documento de la colección `Reviews`. Esto asegura que cada reseña se asocie con una única solicitud.
   - **Ejemplo**: Si `requestId1` tiene una reseña, el campo `requestId` en la reseña será `requestId1`.

4. **Relación 1:N entre `Workers` y `Reviews`**:
   - Cada trabajador puede recibir muchas reseñas. En el modelo, esto se refleja al almacenar `workerId` en cada documento de la colección `Reviews`. De este modo, puedes obtener todas las reseñas dejadas para un trabajador específico usando `workerId`.
   - **Ejemplo**: Si `workerId1` tiene 10 reseñas, cada una tendrá `workerId` igual a `workerId1`.

5. **Relación 1:N entre `Clients` y `Reviews`**:
   - Cada cliente puede dejar muchas reseñas. Esto se refleja al almacenar `clientId` en cada documento de la colección `Reviews`. Así, puedes obtener todas las reseñas dejadas por un cliente específico utilizando `clientId`.
   - **Ejemplo**: Si `clientId1` deja 4 reseañs, cada una tendrá `clientId` igual a `clientId1`.


### Diagrama de la Estructura de Datos

El diagrama a continuación muestra la estructura de colecciones y documentos con algunos casos de ejemplo, así como las referencias entre ellos:

```
Firestore
│
├── Workers
│   ├── workerId1
│   │   ├── name: "John Doe"
│   │   ├── job: "Electrician"
│   │   ├── experience: 5
│   │   ├── location: "City X"
│   │   ├── email: "johndoe@example.com"
│   │   ├── password: "hashed_password"
│   │   ├── isAvailable: true
│   │   └── availableTimestamp: "2024-09-15T14:20:00Z"
│   └── ...
│
├── Clients
│   ├── clientId1
│   │   ├── name: "Jane Smith"
│   └── ...
│
├── Requests
│   ├── requestId1
│   │   ├── clientId: "clientId1"  (refers to Clients)
│   │   ├── workerId: "workerId1"  (refers to Workers)
│   │   ├── status: "pending"
│   │   ├── dateCreated: "2024-09-15T12:30:00Z"
│   │   ├── clientName: "Jane Smith"  (duplicated for easy querying)
│   │   └── workerName: "John Doe"     (duplicated for easy querying)
│   └── ...
│
└── Reviews
    ├── reviewId1
    │   ├── requestId: "requestId1"  (refers to Requests)
    │   ├── clientId: "clientId1"    (refers to Clients)
    │   ├── workerId: "workerId1"    (refers to Workers)
    │   ├── rating: 5
    │   ├── comment: "Great service!"
    │   └── dateReview: "2024-09-16T14:00:00Z"
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

Para que el equipo sepa qué variables debe incluir en su archivo `.env`, puedes crear un archivo `.env.example` con las claves de las variables, pero sin valores sensibles:

```bash
# Archivo .env.example para Backend
GOOGLE_APPLICATION_CREDENTIALS=
```
> [!IMPORTANT]  
> Cada desarrollador debe copiar este archivo y renombrarlo como .env, luego rellenar los valores correspondientes.

### Configuración en el código

*explicacion de los scripts






