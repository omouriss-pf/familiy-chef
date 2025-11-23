# Maison — Planificateur de repas

Une petite application front-end (Vite + React + TypeScript) pour planifier des repas et gérer des composants liés aux repas.

## Description

Ce dépôt contient une application React + TypeScript montée avec Vite. Elle contient des composants pour afficher des fiches de repas, un formulaire de configuration et une vue de liste de courses.

## Prérequis

- Node.js (version recommandée >= 18)
- npm (ou yarn)

## Installation

Ouvrez un terminal à la racine du projet puis :

```bash
npm install
```

## Développement

Pour lancer l'application en mode développement (hot-reload) :

```bash
npm run dev
```

Ensuite ouvrez `http://localhost:5173` (ou l'URL indiquée par Vite) dans votre navigateur.

## Build / Prévisualisation

Pour produire un build optimisé pour la production :

```bash
npm run build
```

Pour prévisualiser le build en local :

```bash
npm run preview
```

## Structure du projet (répertoire racine)

- `App.tsx`, `index.tsx` — points d'entrée de l'application
- `components/` — composants UI : `MealCard.tsx`, `SetupForm.tsx`, `ShoppingListView.tsx`
- `services/` — services, ex. `geminiService.ts`
- `tsconfig.json`, `vite.config.ts` — configuration TypeScript et Vite

## Déploiement

Le contenu du dossier `dist/` (généré par `npm run build`) peut être déployé sur n'importe quel hébergeur statique (Netlify, Vercel, Surge, S3 + CloudFront, etc.).

## Contribution

- Ouvrez une issue pour proposer des fonctionnalités ou signaler des bugs.
- Envoyez une pull request avec des changements clairs et un message descriptif.

## Licence

Voir `familiy-chef/LICENSE` pour les détails de licence inclus dans le projet.

---

Si vous voulez que je mette aussi à jour le `README.md` principal pour y ajouter un lien vers `README_fr.md`, dites-le et je m'en occupe.