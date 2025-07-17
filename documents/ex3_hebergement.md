# 🧩 Étapes pas à pas (version locale, certificat auto-signé)

Comme tu n’es pas sur un vrai domaine public, on utilisera un certificat auto-signé (donc "non reconnu" par les navigateurs, mais parfait pour l’apprentissage).

## 🧪 Étape 1 – Générer une clé privée et un certificat auto-signé
Ouvre PowerShell ou le terminal dans le dossier où tu veux stocker tes clés (ex : C:\certificats)

Lance cette commande (si openssl est disponible — sinon, je t’indiquerai comment l'installer) :

    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout mysite.key -out mysite.crt

Tu seras invité à entrer :

- Nom du pays

- Ville

- Organisation

Common Name : 👉 tape

    localhost ou monsite.local

➡️ Tu obtiens deux fichiers :

mysite.key = la clé privée

mysite.crt = le certificat SSL auto-signé

## 🧪 Étape 2 – Configurer Apache ou Nginx pour activer HTTPS

🔸 Pour Apache :

Ouvre httpd.conf et vérifie que ces lignes ne sont pas commentées :

    LoadModule ssl_module modules/mod_ssl.so

    Include conf/extra/httpd-ssl.conf

    Ouvre conf/extra/httpd-ssl.conf

Modifie les lignes :

    SSLCertificateFile "C:/certificats/mysite.crt"

    SSLCertificateKeyFile "C:/certificats/mysite.key"

Vérifie aussi que le DocumentRoot et ServerName pointent vers ton site :

    DocumentRoot "C:/Apache24/htdocs"

    ServerName localhost:443

Redémarre Apache.

➡️ Accède à :

https://localhost

Ton navigateur affichera un avertissement (certificat non reconnu), que tu peux ignorer pour cet exercice.

🔸 Pour Nginx :

Ouvre conf/nginx.conf

Trouve le bloc server {} pour le port 443, ou ajoute-le :

    server {
        listen       443 ssl;
        server_name  localhost;

        ssl_certificate      C:/certificats/mysite.crt;
        ssl_certificate_key  C:/certificats/mysite.key;

        ssl_protocols        TLSv1.2 TLSv1.3;
        ssl_ciphers          HIGH:!aNULL:!MD5;

        location / {
            root   html;
            index  index.html;
        }
    }

Redémarre Nginx (nginx.exe -s reload)

➡️ Accède à :

https://localhost

## 🔎 Étape 3 – Vérifier le fonctionnement SSL

Ouvre ton navigateur

Tape https://localhost

Clique sur le cadenas dans la barre d'adresse

Vérifie que la connexion est bien chiffrée (même si non certifiée par une autorité officielle)

## 🧠 Notions apprises dans l'exercice
> Élément	Explication
> Clé privée	Sert à déchiffrer les messages et à prouver l'identité du serveur
> Certificat	Contient la clé publique et des infos d’identité
> HTTPS	Protocole sécurisé basé sur TLS/SSL
> OpenSSL	Outil pour gérer les clés et certificats
> Auto-signé	Utile pour tester, mais non valide publiquement

## 🚀 Pour aller plus loin (bonus)
Générer un certificat Let's Encrypt avec mkcert (facile et local)

Installer une autorité de certification locale

Activer le chiffrement fort uniquement (TLS 1.3)

## Erreurs de certificats OpenSSL

### Solution simple : utiliser openssl.exe directement depuis son dossier

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

✅ Cette méthode ne nécessite aucun changement du Path.