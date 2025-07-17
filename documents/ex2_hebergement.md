# Ce qu’il faut pour une installation manuelle sur Windows
## 📦 Option 1 : Apache sur Windows (manuelle)
### 🧭 Étapes simplifiées :
Télécharger Apache binaire pour Windows
Va ici : https://www.apachelounge.com/download/

Prends la version httpd-2.4.x-win64-VS16.zip

Décompresse le zip dans C:\Apache24

Ouvre PowerShell en tant qu'administrateur, puis :

    cd C:\Apache24\bin
    .\httpd.exe

Accède à http://localhost → tu dois voir It works!

Ton fichier de configuration est ici :

    makefile
    C:\Apache24\conf\httpd.conf

*Tu peux changer le DocumentRoot*

Ajouter des VirtualHost

Pour ajouter ta page HTML :

Crée un fichier index.html dans C:\Apache24\htdocs

🔒 Pour lancer Apache en service Windows :
Toujours en PowerShell Admin :

    .\httpd.exe -k install

Tu pourras démarrer/arrêter Apache depuis les services Windows.

## 📦 Option 2 : Nginx sur Windows (encore plus simple)

Va sur : https://nginx.org/en/download.html
→ Prends la version Windows stable (zip)

Décompresse dans C:\nginx

Lance nginx.exe → un petit terminal s’ouvre

Dans ton navigateur, va sur http://localhost → tu vois la page de test Nginx

Mets ta page HTML ici :

    C:\nginx\html\index.html

Le fichier de config est ici :

    C:\nginx\conf\nginx.conf

## BONUS : Ajouter une configuration personnalisée

Aller dans :

    C:\xampp\apache\conf\httpd.conf

Vérifiez que cette ligne n’est pas commentée (pas de #) :

    Include conf/extra/httpd-vhosts.conf

Dans le fichier httpd-vhosts.conf, vous pouvez définir un site personnalisé :

    <VirtualHost *:80>
        DocumentRoot "C:/xampp/htdocs/monsite"
        ServerName monsite.local
    </VirtualHost>

Puis modifier le fichier C:\Windows\System32\drivers\etc\hosts :

    127.0.0.1 monsite.local

Accédez à votre site sur :

    http://monsite.local


## Installation OpenSSL

### En cas de soucis avec OpenSSL (Path non reconnu, erreur d'installation globale, permissions etc.)
Solution simple : utiliser openssl.exe directement depuis son dossier
Va dans :

    C:\Program Files\OpenSSL-Win64\bin

Clique dans la barre d’adresse du dossier > tape cmd → appuie sur Entrée
Cela ouvre l’invite de commande directement dans le bon dossier.

Exécute ta commande comme ceci :

    openssl req -x509 -newkey rsa:2048 -nodes -keyout mysite.key -out mysite.crt -days 365 -config openssl.cnf

⚠️ Place bien aussi ton fichier openssl.cnf dans le même dossier ou donne son chemin complet.

✅ Alternative : glisser openssl.exe dans le dossier de ton projet
Va dans :

    C:\Program Files\OpenSSL-Win64\bin

Copie ces 3 fichiers dans ton dossier de travail C:\certificat-ssl :

    openssl.exe

    libcrypto-3-x64.dll

    libssl-3-x64.dll

Ouvre un terminal dans ce dossier et exécute :

    openssl req -x509 -newkey rsa:2048 -nodes -keyout mysite.key -out mysite.crt -days 365 -config openssl.cnf
