## ✅ Mémo 1 – Libérer un port occupé (Windows)
🔎 Trouver le PID qui occupe un port (ex : 80)

    netstat -ano | findstr :80

👁️ Résultat → Regarde la dernière colonne → c’est le PID

🛑 Tuer le processus

    taskkill /PID <PID> /F

Exemple :


taskkill /PID 36652 /F

## ✅ Mémo 2 – Enregistrer Apache comme service Windows
📌 Depuis le dossier Apache bin :

    httpd.exe -k install

🟢 Démarrer le service :

    httpd.exe -k start

🔴 Arrêter le service :

    httpd.exe -k stop

🗑️ Désinstaller le service :

    httpd.exe -k uninstall

💡 Le service s’appelle généralement Apache2.4 dans la liste des services Windows (services.msc).