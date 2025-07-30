# Alexandre

Guide d'exercices pour se consolider sur les bases de git

1. On fait une modification : 

Tu fais une modification dans le repo. Tu peux au choix : 

- Créer un fichier

- Modifier le contenu de ce fichier (alexandre.md)

- Ajouter un fichier image ou autres de ton pc dans le repo

- Si tu te chauffe tu fais une petite page HTML

2. Utiliser Git pour modifier le repo en ligne

Le repo contient toutes les informations ! 

A.Utilise

    git add .

Pour *stage* les modifications

B.Ensuite

    git commit -m "Dans le message de commit tu dis ce que tu as fait"

Ca enregistre une version du repo avec tes modifications

C.Tu finis par

    git push origin main

pour envoyer tes modifications et en faire la nouvelle version du repo en ligne

D.Une fois que tu as fini ça tu me le dis, je pourrai de mon côté faire

    git pull origin main

Et je devrais retrouver tes modifications.