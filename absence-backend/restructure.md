# Plan de restructuration - Absence Manager

## Étapes pour restructurer en monorepo

### Option 1: Restructuration manuelle (recommandée)

1. **Créer le dossier parent** `absence-manager` dans `ai_projects/`
2. **Déplacer le projet actuel** vers `absence-manager/absence-backend/`
3. **Créer le frontend** dans `absence-manager/absence-frontend/`

### Commandes à exécuter dans le terminal :

```bash
# Depuis ai_projects/
cd ../
mkdir absence-manager
cd absence-manager

# Déplacer le backend (copier d'abord, puis supprimer l'ancien)
cp -r ../absence-backend ./absence-backend
cd absence-backend

# Vérifier que git fonctionne
git status

# Retourner à la racine pour créer le frontend
cd ../
```

### Option 2: Je peux créer la structure ici puis vous guidez

Je crée ici la structure complète, puis vous déplacez manuellement vers la structure finale.

Quelle option préférez-vous ?