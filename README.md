# SenFavorites Extension Chrome

Une extension Chrome qui permet d'ajouter rapidement des sites web à votre compte SenFavorites.

## Création de compte

Pour utiliser l'extension, vous devez avoir un compte SenFavorites. Vous pouvez créer un compte  sur :
https://senfavorites.pythonanywhere.com/

1. Rendez-vous sur le site
2. Cliquez sur "S'inscrire" ou "Créer un compte"
3. Remplissez le formulaire d'inscription
4. Validez votre compte
5. Utilisez ces mêmes identifiants dans l'extension

## Fonctionnalités

- Connexion sécurisée à votre compte SenFavorites
- Ajout rapide de favoris depuis n'importe quelle page web
- Sauvegarde automatique de l'URL de la page active
- Possibilité d'ajouter un titre et une description personnalisés

## Installation

1. Clonez ce dépôt ou téléchargez les fichiers
2. Ouvrez Chrome et accédez à `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant les fichiers de l'extension

## Structure des fichiers

```
├── manifest.json        # Configuration de l'extension
├── popup.html          # Interface utilisateur
├── popup.css          # Styles de l'interface
├── popup.js           # Logique de l'interface
├── bootstrap.min.css  # Styles Bootstrap
└── favorite.png       # Icône de l'extension
```

## Utilisation

1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Connectez-vous avec vos identifiants SenFavorites
3. Une fois connecté, vous pouvez ajouter la page courante à vos favoris :
   - Le titre est pré-rempli (modifiable)
   - Ajoutez une description (optionnel)
   - Cliquez sur "Ajouter" pour sauvegarder

## Configuration

L'extension est configurée pour se connecter à `https://senfavorites.pythonanywhere.com/`. 

## Sécurité

- Utilisation de JWT pour l'authentification
- Stockage sécurisé des tokens
- Politique de sécurité du contenu (CSP) stricte

## Développement

Pour contribuer au développement :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Soumettez une pull request

## Scrrenshots 📸   

![Connexion](https://github.com/sibylassana95/senfavorites_extension/blob/main/screen/login.png?raw=true)

![Ajouter un favori](https://github.com/sibylassana95/senfavorites_extension/blob/main/screen/add.png?raw=true)


## License

MIT License

## 👤 Auteur 

[![LASSANA SIBY](https://avatars.githubusercontent.com/u/103085452?u=13ace4d88a52056741734e0f802ca7c0053e1e80&v=4&s=40)](https://github.com/sibylassana95)  
Created by **[Lassana SIBY](https://github.com/sibylassana95)**