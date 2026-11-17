# TaskForge Web

Frontend d'un gestionnaire de taches Agile facon Kanban. Tableau a quatre
colonnes (A faire, En cours, En revue, Termine), glisser deposer accessible,
creation et edition de taches en panneau lateral, filtres et theme clair ou
sombre. L'application sait tourner seule grace a un mode demo en memoire, ou se
brancher sur une API REST via la variable `VITE_API_URL`.

## Contexte

TaskForge illustre la partie frontend d'un outil de gestion de projet Agile
(colonnes Kanban, priorites, assignes), en lien direct avec les methodes
Agile / Kanban et les outils type Jira. Le code vise un niveau production :
TypeScript strict, architecture par features, etat applicatif maitrise sans
librairie lourde, accessibilite et tests reels.

## Stack

- React 18 et TypeScript (mode strict)
- Vite 5 pour le dev server et le build
- Etat applicatif via Context + reducer typed (pas de dependance d'etat tierce)
- Client API type sur `fetch`, avec repli automatique en mode demo
- Vitest et Testing Library pour les tests unitaires et d'integration
- ESLint et Prettier pour la qualite et le style

## Architecture

Organisation par domaines (feature folders), separation claire entre logique
pure (testable sans DOM) et composants de presentation.

```
src/
  api/            Client de donnees type (HTTP reel + demo en memoire)
  state/          Reducer, selecteurs purs et contexte applicatif
  features/
    board/        Tableau Kanban (Board, Column, TaskCard, filtres)
    tasks/        Modele de domaine, validation, panneau de creation/edition
  theme/          Fournisseur de theme clair/sombre
  styles/         Feuille de style unique a base de variables
  test/           Utilitaires de rendu et configuration des tests
```

Principes appliques :

- Inversion de dependance : les composants ne connaissent que l'interface
  `TaskApi`, implementee par un client HTTP et un client demo interchangeables.
- Responsabilite unique : reducer, selecteurs, validation et rendu sont separes.
- Logique metier pure : filtrage, regroupement par colonne, navigation entre
  colonnes et validation sont des fonctions sans effet de bord, testees
  isolement.
- Mise a jour optimiste du deplacement de carte, avec rechargement de secours
  en cas d'echec reseau.

## Installation

```bash
npm install
cp .env.example .env   # laisser VITE_API_URL vide pour le mode demo
npm run dev
```

## Commande de test unique

```bash
npm test
```

Lance la suite Vitest complete (reducer, selecteurs, validation, client API,
rendu du tableau, deplacement d'une carte, filtre par priorite, formulaire de
creation valide et invalide).

Autres commandes utiles :

```bash
npm run lint     # ESLint, zero avertissement tolere
npm run format   # verification Prettier
npm run build    # build de production dans dist/
npm run pages    # build puis copie dans docs/ pour GitHub Pages
```

## Accessibilite et performance

- Glisser deposer utilisable au clavier : saisir une carte avec Entree ou
  Espace, la deplacer avec les fleches gauche et droite, deposer avec Entree ou
  Echap. Chaque deplacement est annonce via une region live pour lecteur
  d'ecran.
- Roles ARIA sur le tableau, les colonnes et les cartes, lien d'evitement,
  focus visible, contraste conforme au niveau AA en theme clair et sombre.
- Theme clair/sombre respectant la preference systeme et persiste localement.
- Performance : decoupage du bundle (vendor React isole, panneau charge a la
  demande via `React.lazy`), feuille de style legere, base relative pour un
  hebergement statique.

## Mode demo et API REST

Sans `VITE_API_URL`, l'application utilise un client en memoire preremplit afin
que la demonstration fonctionne sans backend. En renseignant `VITE_API_URL`,
elle consomme une API REST exposant :

```
GET    /tasks           liste des taches
POST   /tasks           creation
PATCH  /tasks/:id       mise a jour partielle
DELETE /tasks/:id       suppression
```

## Ce que ce projet demontre pour un poste Full Stack

- React.js et TypeScript en mode strict, composants purs et testables.
- HTML5 / CSS3, responsive mobile first, theme clair/sombre.
- UI/UX et accessibilite : roles ARIA, navigation clavier complete, focus
  visible, contraste AA, annonces lecteur d'ecran.
- Performance et Core Web Vitals : code splitting, chargement a la demande,
  bundle maitrise, base relative pour hebergement statique.
- Consommation d'API RESTful via un client `fetch` type, gestion des erreurs.
- Genie logiciel : principes SOLID, clean architecture par features, separation
  logique pure / presentation, patterns (inversion de dependance, reducer).
- Tests unitaires et d'integration reels avec Vitest et Testing Library.
- Outillage et CI : ESLint, Prettier, GitHub Actions (lint, tests, build).
- Lien avec l'ecosysteme Agile / Kanban / Jira (colonnes, priorites, assignes).
