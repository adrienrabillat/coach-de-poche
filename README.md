# Coach de Poche

Application de suivi d'entraînement et de nutrition, pensée pour le téléphone (ajout à l'écran d'accueil de l'iPhone).

## Fonctionnalités

- **Séances** : programme sur quatre séances (push, pull, jambes, épaules-bras) avec séries, répétitions, charges cibles et temps de repos ; saisie des charges réalisées série par série
- **Nutrition** : check-list quotidienne (protéines, eau, sommeil, créatine…) et journal des repas, de l'énergie et du ressenti
- **Suivi** : courbe de poids et de masse grasse, historique des séances
- **Export CSV** de toutes les données, prêt à être analysé (par exemple par un LLM jouant le rôle de coach)

## Stack

React 18, Vite, Supabase (PostgreSQL), Lucide. Déployé sur Vercel.

## Organisation du code

| Fichier | Rôle |
|---|---|
| `src/data.js` | Programme d'entraînement (séances, exercices, consignes) |
| `src/hooks.js` | Hooks d'accès aux données Supabase et export CSV |
| `src/App.jsx` | Interface : onglets Accueil, Séances, Nutrition, Suivi |

## Lancer en local

```bash
npm install
npm run dev
```

Il faut un projet Supabase avec les tables `weight_log`, `daily_checks`, `daily_log` et `workout_log` (URL et clé publique dans `src/supabase.js`).
