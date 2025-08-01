# Versioning et gestion de versions décentralisé

## Initialisation du repository


Ensuite, il suffit de l'initialiser 

    git init

et d'y ajouter les fichiers locaux (ici un simple readme.md).

    git add README.md

Mais pour ajouter tous les fichiers, on peut utiliser

    git add .

Une fois les fichiers listés on peut les **commit**, les valider pour la version en cours

    git commit -m "first commit"

On peut ensuite nommer sa branche de travail

    git branch -M main

## Contrôle de l'historique : 
    $ git log --oneline


## Mise en ligne du repository
*Pour la décentralisation ou le travail collaboratif*

Ajouter l'adresse du repo en temps que **remote**, c'est le repo github distant qui sera utilisé pour travailler

    git remote add origin https://github.com/rubentrottein/versioning.git

Une fois le remote défini, on peut envoyer tout le contenu de notre dernier commit à l'aide de la commande **push**

    git push -u origin main

Le repository est désormais accessible en ligne!