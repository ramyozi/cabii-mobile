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

## 🏗 Stack technique proposée

### Backend
- **C# / ASP.NET Core** (API REST + gRPC)
- **SignalR** (realtime tracking)
- **PostgreSQL + PostGIS** (géolocalisation et requêtes spatiales)
- **Redis** (cache, sessions)
- **RabbitMQ / Azure Service Bus** (messaging, events)
- **Docker + Kubernetes (AKS)** pour le déploiement cloud

### Frontend Web
(je n'ai pas encore choisit)
- Blazor (C# côté frontend)  
- React

### Mobile
- **Flutter**  
- **.NET MAUI**

### Services externes
- **Maps & Routing** : Google Maps / Mapbox / HERE
- **Paiements** : Stripe
- **Notifications push** : Firebase Cloud Messaging (Android) & APNs (iOS) ( à recherer)

