# Publication

Le depot est initialise en local. Les commandes ci dessous creent le depot
GitHub public et activent GitHub Pages pour la demo en ligne.

## 1. Creer le depot et pousser

```bash
cd /Users/wize/fullstack-entretien/projets/taskforge-web
gh repo create taskforge-web \
  --public \
  --description "Frontend Kanban Agile (React 18 + TypeScript + Vite), accessible et teste" \
  --source . \
  --push
```

## 2. Activer GitHub Pages (demo en ligne)

Le build de production est deja copie dans `docs/`. Il suffit de servir Pages
depuis ce dossier sur la branche `main`.

```bash
gh api -X POST repos/:owner/taskforge-web/pages \
  -f "source[branch]=main" \
  -f "source[path]=/docs"
```

Si le build evolue, regenerer la demo avant de pousser :

```bash
npm run pages
git add docs && git commit -m "Mettre a jour la demo Pages"
git push
```

L'URL de la demo sera `https://<utilisateur>.github.io/taskforge-web/`.

## 3. Verifier la CI

Le workflow `.github/workflows/ci.yml` s'execute a chaque push sur `main`
(formatage, lint, tests, build). Verifier le statut :

```bash
gh run list --limit 1
```
