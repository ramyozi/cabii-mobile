# Cabii — Plateforme de mobilité & livraison

Cabii est une application **tout-en-un** qui combine :
- Service type Uber (transport de passagers)
- Livraison de colis et marchandises  
Avec réservation, suivi en temps réel, ETA précis et paiement intégré.

---

## Fonctionnalités MVP
- Inscription & authentification (passager / chauffeur / livreur)
- Commande instantanée ou planifiée (date/heure)
- Estimation prix, distance et durée (via API de navigation)
- Matching chauffeur ↔ passager basé sur géolocalisation
- Suivi en temps réel (SignalR websockets)
- Paiement intégré (Stripe)
- Dashboard web admin (gestion courses, litiges, KPI)

---

## 🏗 Stack technique choisie

### Backend
- **NestJS (TypeScript)** : API REST + WebSockets (realtime tracking)
- **TypeORM** : ORM avec migrations pour versionner la base
- **PostgreSQL + PostGIS** : stockage des données + requêtes spatiales
- **Redis** : cache, sessions, geofencing rapide
- **RabbitMQ / Kafka** : messaging et events asynchrones
- **Object Storage (S3 / MinIO / Cloudinary)** : gestion des fichiers (photos profils, colis)
- **Docker + Kubernetes** : déploiement et scalabilité
- **Sécurité** : JWT + Refresh tokens, OAuth2 (Google/Apple/Facebook), rate limiting, Helmet

### Frontend Web (Admin Dashboard)
- **React + Next.js** : interface admin & support (SSR + SEO)
- **UI Library** : TailwindCSS / Material UI / Ant Design
- **RBAC** (Role-Based Access Control) : gestion des rôles admin/support

### Mobile
- **React Native + Expo** : application passager / chauffeur / livreur
- **Push Notifications** : Firebase Cloud Messaging (Android), APNs (iOS)
- **OneSignal** pour centraliser les notifications (peut être)

### Services externes
- **Maps & Routing** : Google Maps / Mapbox / HERE
- **Paiements** : Stripe (avec webhooks sécurisés + gestion wallet interne)

### DevOps & Observabilité
- **CI/CD** : GitHub Actions / GitLab CI
- **Monitoring** : Prometheus + Grafana / Datadog
- **Logs** : ELK Stack (Elastic, Logstash, Kibana) ou Loki (je vais voir apres)
