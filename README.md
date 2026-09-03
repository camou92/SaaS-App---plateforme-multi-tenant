# SaaS App - plateforme multi-tenant

Plateforme SaaS de gestion d'activités commerciales, conçue pour héberger plusieurs entreprises dans une même application tout en isolant leurs données. Le projet regroupe une API REST Spring Boot, une interface web Angular, une base PostgreSQL et une stack d'observabilité déployable avec Docker Compose ou Kubernetes.

## Fonctionnalités

- Enregistrement et administration des tenants (entreprises clientes).
- Authentification par JWT.
- Isolation des données par schéma PostgreSQL pour chaque tenant.
- Gestion des utilisateurs et de leur activation ou désactivation.
- Gestion des catégories et des produits.
- Gestion des mouvements de stock.
- Migrations de base de données avec Flyway.
- Documentation interactive de l'API avec OpenAPI/Swagger.
- Health checks, métriques Prometheus, logs Loki et traces OpenTelemetry/Tempo.

## Architecture

```text
                         +----------------------+
                         |  Angular / Nginx      |
                         |  localhost:4200/8083  |
                         +----------+-----------+
                                    |
                         /api (proxy en prod)
                                    |
                         +----------v-----------+
                         | Spring Boot API       |
                         | localhost:8080        |
                         +------+---------+------+
                                |         |
                   Flyway/JPA  |         | JWT + tenant context
                                |         |
                         +------v---------v-----+
                         | PostgreSQL 17.5       |
                         | public + tenant_*    |
                         +-----------------------+

       Prometheus -> métriques     Loki -> logs     Tempo -> traces
                         Grafana / Alertmanager
```

### Isolation multi-tenant

Le schéma `public` contient les informations communes, notamment les tenants. Lorsqu'une requête arrive, le backend identifie le tenant à partir de l'en-tête HTTP `X-Tenant-ID`. Le contexte du tenant est ensuite propagé à Hibernate, qui sélectionne le schéma PostgreSQL correspondant (`tenant_<company-code>`).

Un tenant est provisionné après son enregistrement. Ses migrations spécifiques sont exécutées par le service de provisioning. Toute requête métier doit donc fournir un tenant valide, sauf pour les routes explicitement publiques ou d'administration.

## Technologies

### Backend

- Java 21
- Spring Boot 4.0.6
- Spring MVC, Spring Security et Spring Data JPA
- Hibernate multi-tenancy par schéma
- PostgreSQL 17.5
- Flyway
- JJWT 0.12.6
- SpringDoc OpenAPI
- Micrometer/Prometheus, Actuator, Loki et OpenTelemetry

### Frontend

- Angular 21
- TypeScript 5.9
- PrimeNG, PrimeFlex et PrimeIcons
- RxJS
- `ng-openapi-gen` pour générer les services depuis `saas-app-ui/src/openapi/openapi.json`
- Nginx pour servir le build de production

## Prérequis

Pour le développement local :

- JDK 21
- Node.js 20 ou version compatible avec Angular CLI 21
- npm 11 (le projet déclare `npm@11.6.2`)
- Docker et Docker Compose
- Une paire de clés RSA pour les tokens JWT

## Démarrage rapide en développement

### 1. Démarrer PostgreSQL

Depuis la racine du dépôt :

```bash
docker compose up -d postgres-saas
```

La base est disponible sur `localhost:5433` avec les valeurs par défaut suivantes :

| Paramètre | Valeur par défaut |
|---|---|
| Base | `saas-app-db` |
| Utilisateur | `postgres` |
| Mot de passe | `postgres` |
| Port hôte | `5433` |

Pour ouvrir pgAdmin :

```bash
docker compose up -d pgadmin
```

### 2. Configurer le backend

Le backend charge les variables depuis `saas-app/.env`. Pour lancer Spring Boot directement sur la machine hôte, utilisez notamment :

```dotenv
SPRING_PROFILES_ACTIVE=dev
DB_HOST=localhost
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
JWT_PRIVATE_KEY_PATH=/chemin/absolu/vers/private_key.pem
JWT_PUBLIC_KEY_PATH=/chemin/absolu/vers/public_key.pem
JWT_ACCESS_TOKEN_EXPIRATION=
```

Les clés privées et publiques ne doivent pas être ajoutées au dépôt. Le chemin peut être relatif au répertoire depuis lequel l'application est lancée, ou absolu.

Lancer l'API :

```bash
cd saas-app
./mvnw spring-boot:run
```

Sous Windows, utilisez `mvnw.cmd`.

### 3. Lancer le frontend

```bash
cd saas-app-ui
npm install
npm start
```

L'interface est disponible sur [http://localhost:4200](http://localhost:4200). En développement, elle appelle l'API sur `http://localhost:8080`.

## Démarrage avec Docker Compose

Pour démarrer la stack applicative et l'observabilité :

```bash
docker compose -f docker-compose-prod.yml up -d --build
```

Avant le démarrage, vérifiez les points suivants :

1. `saas-app/.env` contient les identifiants de base attendus par le conteneur backend.
2. Les clés JWT existent dans le répertoire indiqué par `JWT_CERTS_DIR`.
3. Le fichier `.env` racine définit éventuellement `JWT_CERTS_DIR` avec un chemin absolu lisible par Docker.

Services principaux :

| Service | URL |
|---|---|
| Frontend | [http://localhost:8083](http://localhost:8083) |
| Backend | [http://localhost:8080](http://localhost:8080) |
| PostgreSQL | `localhost:5433` |
| Prometheus | [http://localhost:9090](http://localhost:9090) |
| Alertmanager | [http://localhost:9093](http://localhost:9093) |
| Grafana | [http://localhost:3000](http://localhost:3000) |
| Tempo | `localhost:3200` |
| Loki | `localhost:3100` |
| PostgreSQL exporter | `localhost:9187` |

Arrêter les services :

```bash
docker compose -f docker-compose-prod.yml down
```

Ajouter `-v` supprime également les volumes PostgreSQL et Grafana. Cette opération détruit les données persistées.

## API REST

L'API est versionnée sous `/api/v1`.

| Domaine | Routes principales |
|---|---|
| Authentification | `POST /api/v1/auth/login`, `POST /api/v1/auth/register` |
| Tenants | `GET /api/v1/tenants`, approbation, activation, désactivation et suspension |
| Utilisateurs | `GET/POST /api/v1/users`, modification, suppression, activation et désactivation |
| Catégories | `GET/POST /api/v1/categories`, modification et suppression |
| Produits | `GET/POST /api/v1/products`, modification et suppression |
| Stocks | `GET/POST /api/v1/stocks`, modification, suppression et recherche par produit |

Pour les routes protégées, envoyer le token JWT :

```http
Authorization: Bearer <access-token>
X-Tenant-ID: <tenant-id>
```

Les paramètres de pagination disponibles sur les collections sont généralement `page` et `size`.

### Documentation OpenAPI

Avec le backend démarré :

- Swagger UI : [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- Spécification JSON : [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

Le frontend peut régénérer ses services API à partir de sa spécification versionnée :

```bash
cd saas-app-ui
npm run api-gen
```

## Tests et qualité

Backend :

```bash
cd saas-app
./mvnw test
```

Build du backend :

```bash
cd saas-app
./mvnw clean package
```

Frontend :

```bash
cd saas-app-ui
npm test
npm run build
```

Le build Angular de production est généré dans `saas-app-ui/dist/`.

## Déploiement Kubernetes

Les manifests sont regroupés dans `k8s/` et ciblent le namespace `saas-app`.

Pré-requis :

- Un cluster Kubernetes fonctionnel.
- Traefik comme contrôleur Ingress.
- Les images `backend-saas-app:latest` et `multy-tenancy-frontend-ui:latest` disponibles sur les nœuds du cluster, car `imagePullPolicy` vaut `Never`.
- Les secrets de base de données et les clés JWT correctement configurés.
- Un PersistentVolume compatible pour PostgreSQL.

Déploiement de base :

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/monitoring/
```

L'Ingress utilise l'hôte `saas.local`. Pour un environnement local, ajoutez-le à `/etc/hosts` avec l'adresse IP de votre cluster, puis ouvrez [http://saas.local](http://saas.local).

Les fichiers `*-sealedsecret.yaml` nécessitent Sealed Secrets. N'appliquez pas simultanément des secrets en clair et leurs versions scellées dans un environnement de production sans vérifier la stratégie de gestion des secrets du cluster.

## Observabilité

Le backend expose les endpoints Actuator suivants :

- `/actuator/health` pour les probes de démarrage, disponibilité et vivacité.
- `/actuator/metrics` pour les métriques applicatives.
- `/actuator/prometheus` pour le scraping Prometheus.

La stack Compose de production ajoute Prometheus, Alertmanager, Grafana, Loki, Tempo, Blackbox Exporter et PostgreSQL Exporter. Les configurations correspondantes sont à la racine du dépôt et sous `grafana/` et `k8s/monitoring/`.

## Structure du dépôt

```text
.
├── saas-app/                 # API Spring Boot, migrations, tests et Dockerfile
├── saas-app-ui/              # Application Angular et build Nginx
├── k8s/                      # Manifests Kubernetes
├── grafana/                  # Provisioning des datasources Grafana
├── docker-compose.yml        # PostgreSQL et pgAdmin pour le développement
├── docker-compose-prod.yml   # Application complète et observabilité
├── prometheus.yml            # Configuration Prometheus
├── alert.rules.yml           # Règles d'alerte
├── alertmanager.yml          # Routage des alertes
├── loki-config.yaml          # Configuration Loki
└── tempo.yaml                # Configuration Tempo
```

## Sécurité et configuration

- Remplacez les mots de passe par défaut avant tout déploiement exposé.
- Ne committez jamais de clé privée JWT, de mot de passe ou de secret non chiffré.
- Les fichiers de démonstration Kubernetes contiennent actuellement des valeurs de développement ; utilisez un gestionnaire de secrets adapté en production.
- Vérifiez que l'en-tête `X-Tenant-ID` ne peut pas être forgé ou réutilisé pour accéder aux données d'un autre tenant dans votre configuration d'authentification et de reverse proxy.
- Les migrations Flyway sont exécutées au démarrage de l'API. Sauvegardez la base avant toute mise à jour en production.

## Licence

Aucune licence open source n'est déclarée dans le projet à ce jour.
