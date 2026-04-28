# TOROTO-GEO API

<p align="center">
  <img src="https://images.teamtailor-cdn.com/images/s3/teamtailor-na-maroon/gallery_picture-v6/image_uploads/7cafb874-1bf5-4706-bd13-240103c0ef9e/original.jpeg" alt="Toroto" width="180" />
</p>

> API REST geoespacial desarrollada como prueba técnica de evaluación. No representa un producto oficial de Toroto.

**Autor:** Elis Arcia  
**Contacto:** elis.arcia@gmail.com  
**LinkedIn:** [linkedin.com/in/elisarcia](https://www.linkedin.com/in/elisarcia/)  
**Version:** 1.0 — Para efectos de evaluación

🌐 **[Ver demo → toroto-web.vercel.app](https://toroto-web.vercel.app/)**  
📖 **[Documentación técnica completa → GitHub Wiki](https://github.com/elisjetmax/toroto-geo-api/wiki)**

---

## Descripcion

TOROTO-GEO API permite consultar, filtrar y analizar intervenciones ambientales georreferenciadas (zanjas, bordos, terrazas, gaviones, reforestaciones, muestreos de suelo) a través de endpoints REST convencionales y un motor de consulta en lenguaje natural (español e inglés) potenciado por IA. Desarrollada como prueba técnica de evaluación para Toroto.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | NestJS + TypeScript |
| Arquitectura | Clean Architecture |
| Base de datos | PostgreSQL + PostGIS |
| ORM | TypeORM |
| IA | Groq — llama-3.3-70b-versatile |
| Documentación | Swagger / OpenAPI 3.0 |
| Validación | class-validator + class-transformer |

---

## Requisitos

- Node.js >= 18
- PostgreSQL >= 14 con extensión PostGIS
- API Key de Groq

---

## Opción A — Docker

La forma más rápida. No requiere PostgreSQL instalado localmente.

**1. Clona el repositorio:**

```bash
git clone https://github.com/elisjetmax/toroto-geo-api.git
cd toroto-geo-api
```

**2. Edita las variables en el `Dockerfile`** — solo cambia tu API Key:

```dockerfile
ENV GROQ_API_KEY=your_api_key_here   # 👈 reemplaza aquí
```

**3. Levanta los contenedores:**

```bash
docker compose up --build
```

La API estará disponible en `http://localhost:3001/toroto-api/v1`

---

## Opción B — npm local

Requiere PostgreSQL con PostGIS instalado localmente.

**1. Clona el repositorio:**

```bash
git clone https://github.com/elisjetmax/toroto-geo-api.git
cd toroto-geo-api
npm install
```

**2. Copia y edita las variables de entorno:**

```bash
cp .env.example .env
```

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=geo-toroto
DATABASE_URL=postgresql://tu_usuario:tu_password@localhost:5432/geo-toroto
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MODEL_NATURAL_LANGUAGE_MESSAGE="Eres TOROTO-AI..."
```

**3. Inicia la aplicación:**

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000/toroto-api/v1`

---

## Seed automático

Al iniciar la aplicación por primera vez, el sistema carga automáticamente el dataset de prueba en la base de datos — **no se requiere ningún paso manual**.

Esto incluye:
- **130 intervenciones** georreferenciadas
- **3 áreas poligonales** (zone_a, zone_b, zone_c)

Si la base de datos ya contiene datos, el seed se omite automáticamente.

En cada arranque — independientemente del seed — el sistema verifica y crea los índices espaciales GIST si no existen:

```sql
CREATE INDEX IF NOT EXISTS idx_interventions_geom ON interventions USING GIST ((geom::geometry));
CREATE INDEX IF NOT EXISTS idx_areas_geom         ON areas         USING GIST ((geom::geometry));
```

Estos índices aceleran todas las consultas espaciales (`ST_DWithin`, `ST_Within`, `ST_Distance`) de O(n) a O(log n). La operación es idempotente — si ya existen, no hace nada.

---

## Documentación interactiva (Swagger)

El API expone una interfaz Swagger/OpenAPI 3.0 generada automáticamente desde el código. Incluye todos los endpoints, parámetros, esquemas de respuesta y ejemplos — lista para explorar y probar sin ninguna herramienta adicional.

| Modo | URL |
|------|-----|
| Producción | https://toroto-api.vercel.app/toroto-api/docs |
| Docker | http://localhost:3001/toroto-api/docs |
| npm | http://localhost:3000/toroto-api/docs |

La documentación está organizada en tres grupos:

| Tag | Qué contiene |
|-----|-------------|
| `App` | Health check e información general de la API |
| `Interventions` | Todos los endpoints de consulta geoespacial |
| `AI` | Endpoint de lenguaje natural (`/ai/query`) |

---

## Endpoints

### Interventions

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/toroto-api/v1/interventions` | Lista todas las intervenciones |
| `GET` | `/toroto-api/v1/interventions/nearby?lat=&lng=&radius=` | Intervenciones cercanas a un punto (radio en metros) |
| `GET` | `/toroto-api/v1/interventions/region/:region` | Filtrar por región geográfica |
| `GET` | `/toroto-api/v1/interventions/status/:status` | Filtrar por estado operativo |
| `GET` | `/toroto-api/v1/interventions/:id` | Detalle de una intervención por ID |

### AI

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/toroto-api/v1/ai/query` | Consulta en lenguaje natural |

---

## Motor de IA — Intenciones soportadas

| Intención | Ejemplo de pregunta |
|-----------|-------------------|
| `nearest_neighbor` | ¿Cuál es la intervención más cercana a 20.701, -103.321? |
| `within_radius` | Intervenciones validadas en 5km desde 20.700, -103.320 en marzo 2026 |
| `within_area` | List completed interventions inside zone_b |
| `subtype_by_region` | ¿Cuántas intervenciones hay en la región north? |
| `status_summary` | Dame el resumen por estado |
| `priority_summary` | ¿Cuántas intervenciones hay por prioridad? |
| `operator_performance` | How are operators performing? |
| `timeline` | Show intervention trends over time |
| `out_of_scope` | → `400 Bad Request` con mensaje orientativo |

---

## Dataset de prueba

- **130 intervenciones** georreferenciadas distribuidas en Jalisco, México
- **6 operadores:** alice, bob, carla, diego, elena, fernando
- **6 subtipos:** zanja, bordo, terraza, gavion, reforestacion, muestreo_suelo
- **4 estados:** planned, in_progress, completed, validated
- **3 áreas poligonales:** zone_a (norte), zone_b (centro), zone_c (cluster)

---

## Arquitectura

El proyecto sigue **Clean Architecture**, separando responsabilidades en capas independientes:

```
src/
├── shared/
│   └── domain/
│       └── constants/        # Tipos y valores de dominio compartidos
├── interventions/
│   ├── domain/
│   │   ├── entities/         # Entidad pura Intervention (POJO)
│   │   └── repositories/     # Interfaz IInterventionRepository + token DI
│   ├── application/
│   │   └── interventions.service.ts
│   ├── infrastructure/
│   │   └── persistence/      # TypeORM entities, mapper, repositorio concreto
│   └── presentation/
│       ├── interventions.controller.ts
│       └── dto/
├── ai/
│   ├── domain/
│   │   └── intent.ts         # Tipos y validación de intenciones
│   ├── application/
│   │   └── ai.service.ts
│   ├── infrastructure/
│   │   └── groq/             # GroqQueryEngine (adaptador externo)
│   └── presentation/
│       ├── ai.controller.ts
│       └── dto/
├── database/
│   └── seeds/
└── main.ts
```

**Reglas de dependencia:**
- `domain` no depende de nada externo
- `application` depende solo de interfaces del dominio
- `infrastructure` implementa las interfaces del dominio
- `presentation` consume la capa de aplicación

---

## Licencia

Para efectos de evaluación. Todos los derechos reservados © 2026 Elis Arcia.