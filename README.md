# Starter Kit - Expressjs

Ce starter vous permet de facilement démarrer le développement d'une application [Expressjs](http://expressjs.com/) basée sur le générateur d'applicatopn [express-generator](https://expressjs.com/en/starter/generator.html).<br/>

# Sommaire

* [Installation](#installation)
* [Structure de fichiers](#structure-de-fichiers)
* [Liste des modules preconiser](#liste-des-modules-preconiser)
* [Externalisation de la configuration](#externalisation-de-la-configuration)  <span style="color:#B9121B">`Obligatoire`</span>
* [Presentation of the application and delivery](#presentation-of-the-application-and-delivery) <span style="color:#B9121B">`Obligatoire`</span>
* [Integration continue](#integration-continue)
* [Developper une nouvelle API](#developper-une-nouvelle-api)
  * [Creer la configuration de la base de donnees](#creer-la-configuration-de-la-base-de-donnees)
  * [Creer les services](#creer-les-services)
* [Cross origin](#cross-origin)
* [Tests unitaires](#tests-unitaires)
* [Swagger](#swagger)
* [Logger](#logger) 
* [Visual Studio Code](#visual-studio-code)
  * [Liste des plugins a installer](#liste-des-plugins-a-installer)
  * [Debug avec vscode](#debug-avec-vscode)

## Installation

Vous devez modifier la registry de votre configuration npm pour pointer sur le repository npm Auchan

```bash
 npm config set registry http://nexus3.dev.fr.auchan.com/repository/npm_all/
```
Télécharger les sources du starter-express au format zip que vous décompresserez dans votre répertoire applicatif. Puis installez les packages node:

**Remarque** <br/>
Si vous allez utiliser la dépendance `couchbase`, installez d'abord cette dépendance <br/>

```bash
npm install couchbase --save

```
puis installez les dépendances du Starter en tapant la commande ci-dessous:

```bash
# Installer les packages avec npm
npm install
```

## Structure de fichiers

```
starter-expressjs/                  
├──app/                         * Répertoire des fichiers sources de l'application
│   ├──database/                * Répertoire des fichiers de connexion a la base de données
│   │   └──connection.js        * Fichier de connexion à la base de données 
│   │
│   ├──routes/                  * répertoire pour la definition des services
│   │   ├──sample-api                 * Exemple d'api(le découpage se fait par entité)
│   |   |   ├──sample-apiRouter.js          * La route de notre api qui utilise le service
|   │   |   ├──sample-apiService.js         * La partie service de l'api (partie métier)
|   |   |   └──sample-apiSpec.js            * Exemple d'implémentation des tests avec jasmine 
|   |   |
|   |   └──swagger.js                 * Génération de la documenation swagger en utilisant soit:(swagger-jsdoc || swagger.json)      
|   |
|   |
│   ├──utils/                   * Répertoire des modules utiles
│   │   ├──swagger                   * Dossier de configuration du swagger
│   |   ├──constantsError.js         * Définition des constantes pour les erreur hors router
│   |   ├──httpResponse.js           * définition des message de réponse
│   │   ├──logger.js                 * Fichier de configuration du logger
│   │   └──validator.js              * Utilisation d'express-validator pour valider les champs
│   │
│   └──config.js                * Fichier de configuration principale de l'application
│
├──bin/
│   ├──httpServer.js            * Création d'un serveur HTTP
│   ├──httpsServer.js           * Création d'un serveur HTTPS
│   └──www                      * Fichier de configuration des serveurs de l'application
│
├──public/
│   └──swaggerui                 * répertoire pour la configuration du swagger
│
├──app.js                       * fichier de configuration de l'application(point d'entrée)               
├──jasmine.json                 * configuration jasmine pour les tests unitaires
├──make-package.xml             * fichier de configuration du maven-assembly
├──package.json                 * configuration des dépendances utilisée par npm
├──pom.xml                      * configuration du frontend-maven-plugin
└──synchro_version.sh           * Synchronise les versions du pom.xml avec celle du package.json

```
## Liste des modules preconiser

[Cliquer ici pour voir la liste des modules node préconier](http://wikiid.qualif.fr.auchan.com/index.php/NodeJS-ExpressJS/liste_modules_node)

## Externalisation de la configuration

Pour externaliser la configuration d'une application on va utiliser `dotenv`, dans le starter-kit la configuration du `dotenv` est dans le fichier
`app/config.js` :

``` javascript
/**
 * config.js 
 */

var dotenv = require('dotenv');
var logger = require('./utils/logger');

//load configuration
dotenv.config({ path: process.env.NODEJS_CONF_PATH_APPNAME + '/config.properties' }); //"CONF_PATH=C:/Users/xfr61950010Deskto/pexpress/config.properties"

```
### Régles d'utilisation
* Le fichier `config.properties` nous permet de renseigner la configuration de l'application(en `dev` on le met a la racine du projet).

* Chaque application doit avoir un fichier de configuration par environnement `(qualif, prod)` stocké dans le `git` de conf [gitops](https://gitops.fr.auchan.com/), (bien regarder le groupe d'appartenance). <br/>
Exemple: le starter-kit appartient au groupe `ingenierie-dev`: (`ingenierie-dev/starters/starter-express`) équivalent à 
(`nom-du-groupe/nom-du-projet/nom-application`).
* Avant de démarrer l'application veuillez renommer, puis setter le chemin de cette configuration, en le passant à la variable d'environnement `NODEJS_CONF_PATH_APPNAME` (Exemple: pour le projet MOSS on aura `NODEJS_CONF_PATH_MOSS`)
* Ne jamais livrer le fichier `config.properties` dans les sources de l'application.

Vous pouvez démarrer le serveur local.

```bash
# Démarrer le serveur
 NODEJS_CONF_PATH_APPNAME=path-to-load-configuration  npm start
```
Et accéder à l'application avec l'url `http://localhost:3000/`

## Integration continue

Pour créer vos jobs, deux templates Jenkins sont à votre disposition sur http://jenkins.dev.fr.auchan.com/view/Template/: 
* `Build_NodeJS` (prend en paramètre l'url git du projet et la branche à construire)
* `ReleaseNodeJS` (prend en paramètre l'url git du projet et la branche à construire)

Les modifications à réaliser pour adapter `pom.xml` et `package.json` à votre projet:

* `pom.xml`: Les champs à modifier sont les suivants:

```xml
   <groupId>com.auchan.[GROUP_ID]</groupId>  <!-- Remplacer [[GROUP_ID]] par le nom de votre projet -->
   <artifactId>[ARTIFACT_ID]</artifactId> <!-- Remplacer [ARTIFACT_ID] par le nom de votre projet suffixé par -front par exemple -->
   <version>[VERSION]-SNAPSHOT</version> <!-- Initialiser la version à la valeur souhaitée, par exemple 0.0.1 -->
   <name>[APP_NAME]</name> <!-- Indiquer le nom de votre application -->

   <scm>
      <connection>scm:git:git@git@gitlab.dev.fr.auchan.com:XXXXXX/XXXXXX.git</connection> <!--Spécifier l'url git de votre projet-->
      <developerConnection>scm:git:git@gitlab.dev.fr.auchan.com:XXXXXX/XXXXXX.git</developerConnection> <!--Spécifier l'url git de votre projet-->
  </scm>
```

* `package.json`: 
On utilise le module [sync-pom-version](https://www.npmjs.com/package/sync-pom-version) pour synchroniser la version du pom.xml avec celle du package.json.

## Presentation of the application and delivery

* Le `README.md` de votre application doit contenir toutes les informations nécessaires de votre application.<br/>
[Exemple de README.md à fournir dans les sources de votre application](http://gitlab.dev.fr.auchan.com/id-apps/fakeapp)

* Créer une `issue` sur gitlab qui comporte les informations sur la livraison ainsi que le contenu du fichier `config.properties`.
[Exemple issue à créer](http://gitlab.dev.fr.auchan.com/id-apps/fakeapp/issues/5) 

* Pour plus d'information veuillez [consulter cette documentation](https://docs.google.com/presentation/d/13uBnxf8S8iYRfOffsiGT3rTq6lFqVZNzcp1rF7DWTE0/edit#slide=id.p4
)
## Developper une nouvelle API

Choisir la base de données à utiliser.Puis installer la dépendances adéquate:

```bash
npm install oracledb --save //DB Oracle
npm install pg --save //DB Postgres
npm install couchbase --save //DB Couchbase installer cette dépendance avant de faire `npm install`
npm install jdbc --save //DB Teradata

```

### Creer la configuration de la base de donnees

Dans la fichier `config.js` on va renseigner la configuration de la base de données

```
├──app/                         
│   ├──database/                    
│   ├──routes/                     
│   ├──utils/                  
│   │   
│   └──config.js   

```
* Exemple de configuration pour une base Oracle:

```javascript
module.exports = {
//Information to connecte to the oracle db
    "database": {
        "user": "NomUtilisatuer",
        "password": "MotDePasse",
        "connectString": "NomHote/NomDeService"
    }
}
```
[Lien gitlab](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsOracle/blob/master/app/config.js)
* Exemple de configuration pour une base Postgres:

``` javascript
module.exports = {
   database: {
        user: "NonUtilisateur",
        database: "database",
        password: "MotDePasse",
        host: "host",
        port: 5432
    }
}
```
[Lien gitlab](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJSPostgres/blob/master/app/config.js)
* Liens pour la configuration des bases données Teradata et Couchbase : <br/>
   * [Teradata](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsTeradata/blob/master/app/config.js)<br/>
   * [Couchbase](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsCouchbase/blob/master/app/config.js)<br/>

Maintenant dans le fichier `app/database/connection`, on fait un import du fichier de `config`

```
├──app/                         
│   ├──database/                
│   │   └──connection.js         
│   │
│   ├──routes/                  
│   ├──utils/                  
│   └──config.js   

```

* Exemple de fichier de connexion pour une base `Postgres`

```javascript
var pg = require('pg');
const config = require('./../config')

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var pg = {
  user: config.database.user, //env var: PGUSER
  database: config.database.database, //env var: PGDATABASE
  password: config.database.password, //env var: PGPASSWORD
  host: config.database.host, // Server hosting the postgres database
  port: config.database.port, //env var: PGPORT
  //number of connections to use in connection pool
  //0 will disable connection pooling
   max: 18

  //max milliseconds a client can go unused before it is removed
  //from the pool and destroyed
 
};
module.exports = pg;

```
[Lien gitlab](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJSPostgres/blob/master/app/database/connection.js)

* Ci-dessous les liens pour les autres bases

  * [Exemple d'une connection.js à une base Oracle](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsOracle/blob/master/app/database/connection.js)<br/>

  * [Exemple d'une connection.js à une base Teradata](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsTeradata/blob/master/app/database/connection.js)

  * [Exemple d'une connection.js à une base Couchbase](http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsCouchbase/blob/master/app/database/connection.js)

### Creer les services

* Dans le dossier `app/routes`, on va créer les apis qui seront regroupés par entité.
* Respecter la régle un service par table (ou bien par context).
* Une api peut avoir plusieurs endpoints
* Dans `app/routes/sample-api/sample-apiRouter.js` on trouve un exemple d'api qui nous renvoie le `{"Hello Nodejs": "with fwk Experssjs"}`

```javascript
"use strict";
const express = require('express'),
    HttpStatus = require('http-status-codes'),
    router = express.Router();

const logger = require('./../../utils/logger'),
    sample_apiService = require('./sample-apiService');
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - index
 *     description: welcome to the starter express
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: welcome page
 *         schema:
 *           $ref: '#/definitions/index'
 */
router.get('/sample/v1/hello', (req, res) => {
    sample_apiService.message()
        .then((result) => {
            logger.debug(result);
            res.status(HttpStatus.OK).send(result);
        });
});


module.exports = router;

```
Pour plus d'exemple regarder le [proto-express](http://gitlab.dev.fr.auchan.com/id-proto/proto-express)



## Cross origin
La fonctionnalité HTTP access control (CORS) est activée. <br/>
La configuration est dans le fichier `./app.js`

```javascript

//CORS middleware
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  next();
}

...

app.use(allowCrossDomain);

```


## Tests unitaires

* Dans chaque entité on aura un fichier de test unitaires `app/routes/sample-api/sample-apiSpec.js`<br/>
Exemple d'une spec de test:

``` javascript

const endpoint = 'http://localhost:3000/api/sample/v1/hello';

describe("sample-api", () => {
    describe('/ GET', () => {
        it('returns status code 200', (done) => {
            request.get(endpoint, (error, response) => {
                expect(response.statusCode).toEqual(HttpStatus.OK);
                done();
            });
        });
    });
});
```
* La configuration des tests est dans le fichier `jasmine.json`
* Pour executer les tests 

```bash
npm test

```

## Swagger

* Dans le fichier `app/routes/swagger.js`en choisie une configuration pour générer la documentation de nos apis (en utilisant swagger-jsDoc ou bien l'editeur de swagger).
* Le dossier de configuration de swagger se trouve dans: `app/utils/swagger`
* Si on utilise pas la bibliothèque swagger-jsDoc, on pourra rédiger la documentation des APIs on utilisant [l'éditeur de swagger](http://editor.swagger.io/#/)
* la configuration de swagger-ui se trouve dans: `public/swaggerui`.

* Pour plus d'informations consultez la [documentation swagger](http://wikiid.qualif.fr.auchan.com/index.php/Swagger)

## Logger

* Le fichier de configuration du logger se trouve dans : `app/utils/logger.js` 
* Pour surveiller les logs de l'application on fait un import de la configuration du logger dans le fichier `app.js`(Point d'entrée)
* Setter la variable d'environnement `NODEJS_PATH_LOGS`  dans le fichier `config.properties` pour spécifier le chemin ou sauvegarder les LOGS

## Visual Studio Code
* Editeur de code développé par Microsoft, peut être installé sur Windows, Linux et macOS
* Téléchargement sur https://code.visualstudio.com/

### Liste des plugins a installer

Liste des plugins à rajouter:
* [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
* [exports autocomplete](https://marketplace.visualstudio.com/items?itemName=capaj.vscode-exports-autocomplete), [JavaScript (ES6) snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets).
* [express](https://marketplace.visualstudio.com/items?itemName=Compulim.vscode-express), [ExpressSnippet](https://marketplace.visualstudio.com/items?itemName=vladmrnv.expresssnippet) et [Express-Lines](https://marketplace.visualstudio.com/items?itemName=spywhere.express-lines).
* [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory), [Git Project Manager](https://marketplace.visualstudio.com/items?itemName=felipecaputo.git-project-manager) et [gitignore](https://marketplace.visualstudio.com/items?itemName=codezombiech.gitignore).
* [jasmine code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JasmineSnippets).
* [Node.js Assertion Snippets](https://marketplace.visualstudio.com/items?itemName=jaymorrow.NodeAssertionSnippets), [Node.js Modules Intellisense](https://marketplace.visualstudio.com/items?itemName=leizongmin.node-module-intellisense), [View Node Package](https://marketplace.visualstudio.com/items?itemName=dkundel.vscode-npm-source) et [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script).
* [JS-CSS-HTML Formatter](https://marketplace.visualstudio.com/items?itemName=lonefy.vscode-JS-CSS-HTML-formatter)

### Debug avec vscode

En suivant la [Documentation officielle](https://code.visualstudio.com/docs/nodejs/nodejs-debugging), une fois que vous aurez gégérer le fichier `launch.json`, veuillez remplacer son sontenu par le suivant:
``` json

{
    // Utilisez IntelliSense pour découvrir les attributs de débogage Node.js possibles.
    // Pointez pour afficher la description des attributs existants.
    // Pour plus d'informations, visitez : https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [

        {
            "type": "node",
            "request": "launch",
            "name": "Lancer le programme",
            "program": "${workspaceRoot}/bin/www",
            "envFile": "${workspaceRoot}/config.properties",
             "env": {
                "NODE_ENV": "development",
                "NODEJS_CONF_PATH_APPNAME":"."
            }
        }
    ]
}

```

Le `envFile` nous permet de déclarer le fichier de configuration de l'application(dans cet exemple le fichier `config.properties` est à la racine du projet).<br/>
Le `env` nous permet de déclarer les variables d'environnement.




