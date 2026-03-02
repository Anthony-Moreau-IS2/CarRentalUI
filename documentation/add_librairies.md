# Ajout d'une librairie externe

## 1. Ajout d'une librairie externe

1. **Identifier la librairie**
   - Vérifier la compatibilité avec Angular (version, dépendances).
2. **Installer la librairie**
   ```bash
   npm install <nom-de-la-librairie> --save
   # ou
   yarn add <nom-de-la-librairie>
   ```
3. **Importer le module**
   - Ouvrir le fichier `app.module.ts` (ou le module dédié) et ajouter l'import :
   ```typescript
   import { NomModule } from '<nom-de-la-librairie>'; 
   ```
   - Ajouter le module dans le tableau `imports` du décorateur `@NgModule`.
4. **Utiliser les composants/services**
   - Référencer les composants ou services fournis par la librairie dans vos templates ou services.
5. **Vérifier le build**
   ```bash
   ng serve
   ```
   - S'assurer qu'aucune erreur n'apparaît.

