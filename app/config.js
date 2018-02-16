const dotenv = require('dotenv');

//To set path name you must modifie the name of application
dotenv.config({ path: './config.properties' });

module.exports = {
    //Config LOGGER
    logs: {
        path: process.env.NODEJS_LOGS_PATH,
        file: process.env.NODEJS_LOGS_FILE,
        level: process.env.NODEJS_LOGS_LEVEL,
        max_size: process.env.NODEJS_LOGS_MAXSIZE,
        max_file: process.env.NODEJS_LOGS_MAXFILE,
        logstash_port: process.env.NODEJS_LOGSTASH_PORT,
        logstash_node_name: process.env.NODEJS_LOGSTASH_NODE_NAME,
        logstash_host: process.env.NODEJS_LOGSTASH_HOST
    },
    ssh_key: {
        key_pem: process.env.KEY_PEM,
        server_crt: process.env.SERVER_CRT
    },
    database: {
        connectionLimit: process.env.DB_CONNECTION_LIMIT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
    /**
     * Exemple de configuration d'une base Postgers
     * http://gitlab.dev.fr.auchan.com/id-proto/ExpressJSPostgres/blob/master/app/config.js
     */
    /**
     * Exemple de configuration d'une base Oracle
     * http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsOracle/blob/master/app/config.js
     */
    /**
     * Exemple de configuration d'une base Teradata
     * http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsTeradata/blob/master/app/config.js
     */
    /**
     * Exemple de configuration d'une base Couchbase
     * http://gitlab.dev.fr.auchan.com/id-proto/ExpressJsCouchbase/blob/master/app/config.js
     */
};