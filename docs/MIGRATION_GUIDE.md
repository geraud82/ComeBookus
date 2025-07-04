# Migration Guide - Restructuration Backend/Frontend/Database

Ce guide explique la restructuration du projet ComeBookUs d'une architecture monolithique vers une architecture modulaire.

## 🔄 Changements Structurels

### Avant (Structure Monolithique)
```
comebookus/
├── src/
│   ├── app/
│   │   ├── api/           # API routes mélangées avec les pages
│   │   ├── dashboard/
│   │   └── book/
│   └── lib/               # Librairies mélangées
├── prisma/
│   └── schema.prisma
├── package.json           # Toutes les dépendances mélangées
└── tsconfig.json
```

### Après (Architecture Modulaire)
```
comebookus/
├── backend/               # 🔧 API & Logique métier
│   ├── src/api/          # Routes API séparées
│   ├── src/lib/          # Librairies backend
│   └── package.json      # Dépendances backend uniquement
├── frontend/              # 🎨 Interface utilisateur
│   ├── src/app/          # Pages Next.js
│   ├── src/components/   # Composants React
│   └── package.json      # Dépendances frontend uniquement
├── database/              # 🗄️ Base de données
│   ├── prisma/           # Schéma et migrations
│   └── package.json      # Dépendances DB uniquement
├── shared/                # 🔄 Code partagé
│   ├── types/            # Types TypeScript
│   ├── constants/        # Constantes
│   └── utils/            # Utilitaires
└── package.json          # Scripts d'orchestration
```

## 📦 Nouveaux Modules

### 1. Backend (`/backend`)
- **Port**: 3001
- **Responsabilité**: API, authentification, paiements, notifications
- **Technologies**: Next.js API Routes, Prisma, Stripe, Supabase

### 2. Frontend (`/frontend`)
- **Port**: 3000
- **Responsabilité**: Interface utilisateur, composants React
- **Technologies**: Next.js App Router, Tailwind CSS, Radix UI

### 3. Database (`/database`)
- **Responsabilité**: Schéma, migrations, seeds
- **Technologies**: Prisma, PostgreSQL

### 4. Shared (`/shared`)
- **Responsabilité**: Types, constantes, utilitaires partagés
- **Technologies**: TypeScript

## 🚀 Nouveaux Scripts

### Scripts Principaux
```bash
# Développement
npm run dev                    # Lance backend + frontend
npm run dev:backend           # Lance uniquement le backend (port 3001)
npm run dev:frontend          # Lance uniquement le frontend (port 3000)

# Build
npm run build                 # Build tous les modules
npm run build:backend         # Build backend uniquement
npm run build:frontend        # Build frontend uniquement

# Base de données
npm run db:generate           # Génère le client Prisma
npm run db:push              # Pousse le schéma vers la DB
npm run db:migrate           # Lance les migrations
npm run db:studio            # Ouvre Prisma Studio

# Installation
npm run install:all          # Installe toutes les dépendances
npm run install:backend      # Installe dépendances backend
npm run install:frontend     # Installe dépendances frontend

# Qualité
npm run lint                 # Lint tous les modules
npm run type-check           # Vérification TypeScript
```

## 🔧 Configuration des Imports

### Backend
```typescript
// Imports locaux
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase'

// Imports partagés
import { BookingStatus, CreateBookingData } from '@/shared/types'
import { BOOKING_STATUS, API_ENDPOINTS } from '@/shared/constants'
import { dateUtils, priceUtils } from '@/shared/utils'
```

### Frontend
```typescript
// Imports locaux
import { Button } from '@/components/ui/button'
import { useBookings } from '@/hooks/useBookings'

// Imports partagés
import { Booking, Service } from '@/shared/types'
import { SERVICE_COLORS } from '@/shared/constants'
import { dateUtils, stringUtils } from '@/shared/utils'
```

## 🗄️ Base de Données

### Changements
- **Localisation**: `database/prisma/schema.prisma` (au lieu de `prisma/schema.prisma`)
- **Scripts**: Centralisés dans `database/package.json`
- **Migrations**: `database/prisma/migrations/`

### Utilisation
```bash
# Depuis la racine
npm run db:generate
npm run db:push
npm run db:migrate

# Ou depuis le module database
cd database
npm run generate
npm run push
npm run migrate
```

## 🔄 Types Partagés

### Avant
```typescript
// Types définis dans chaque fichier
interface Booking {
  // ...
}
```

### Après
```typescript
// Types centralisés dans shared/types/
import { Booking, BookingStatus, CreateBookingData } from '@/shared/types'
```

### Types Disponibles
- **User**: `User`, `CreateUserData`, `UpdateUserData`
- **Booking**: `Booking`, `BookingStatus`, `PaymentStatus`, `CreateBookingData`
- **Service**: `Service`, `CreateServiceData`, `UpdateServiceData`
- **Client**: `Client`, `CreateClientData`, `UpdateClientData`
- **API**: `ApiResponse`, `PaginatedResponse`, `DashboardStats`

## 🎯 Constantes Partagées

```typescript
import { 
  BOOKING_STATUS, 
  PAYMENT_STATUS, 
  SERVICE_COLORS,
  TIME_CONSTANTS,
  API_ENDPOINTS 
} from '@/shared/constants'
```

## 🛠️ Utilitaires Partagés

```typescript
import { 
  dateUtils,      // Gestion des dates
  priceUtils,     // Formatage des prix
  validationUtils,// Validation des données
  stringUtils,    // Manipulation de chaînes
  colorUtils,     // Gestion des couleurs
  arrayUtils      // Manipulation de tableaux
} from '@/shared/utils'
```

## 🚀 Déploiement

### Avant
```bash
vercel
```

### Après
```bash
# Frontend
cd frontend && vercel

# Backend
cd backend && vercel
```

## 🔍 Avantages de la Nouvelle Architecture

### 1. **Séparation des Responsabilités**
- Backend: API et logique métier
- Frontend: Interface utilisateur
- Database: Gestion des données
- Shared: Code réutilisable

### 2. **Scalabilité**
- Déploiement indépendant des modules
- Équipes peuvent travailler en parallèle
- Optimisation spécifique par module

### 3. **Maintenabilité**
- Code mieux organisé
- Dépendances spécifiques par module
- Tests isolés par domaine

### 4. **Réutilisabilité**
- Types partagés entre backend/frontend
- Utilitaires communs
- Constantes centralisées

### 5. **Performance**
- Bundles plus petits
- Chargement optimisé
- Cache spécifique par module

## 🔧 Migration des Imports

### Anciens Imports à Remplacer
```typescript
// ❌ Ancien
import { prisma } from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'

// ✅ Nouveau
import { prisma } from '@/lib/prisma'  // Backend uniquement
import { BookingStatus } from '@/shared/types'  // Partout
```

## 📝 Checklist de Migration

- [x] ✅ Structure des dossiers créée
- [x] ✅ Fichiers déplacés vers les bons modules
- [x] ✅ Package.json séparés créés
- [x] ✅ Types partagés définis
- [x] ✅ Constantes partagées créées
- [x] ✅ Utilitaires partagés implémentés
- [x] ✅ Configurations TypeScript mises à jour
- [x] ✅ Scripts d'orchestration créés
- [x] ✅ Documentation mise à jour

## 🆘 Dépannage

### Problème: Imports non trouvés
```bash
# Solution: Vérifier les paths dans tsconfig.json
"paths": {
  "@/*": ["./src/*"],
  "@/shared/*": ["../shared/*"]
}
```

### Problème: Types non reconnus
```bash
# Solution: Installer les dépendances du module shared
cd shared && npm install
```

### Problème: Base de données non accessible
```bash
# Solution: Générer le client Prisma
npm run db:generate
```

## 📞 Support

Pour toute question sur la migration:
1. Consulter ce guide
2. Vérifier la documentation dans `/docs`
3. Créer une issue GitHub
