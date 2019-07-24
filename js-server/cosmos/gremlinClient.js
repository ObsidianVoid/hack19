var gremlin = require('gremlin');
var credentials = require('./config/credentials');


const authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${credentials.creds.database}/colls/${credentials.creds.collection}`, credentials.creds.primaryKey)

const client = new gremlin.driver.Client(
    credentials.creds.endpoint,
    {
        authenticator,
        traversalsource: "g",
        rejectUnauthorized: true,
        mimeType: "application/vnd.gremlin-v2.0+json"
    }
);
 module.exports = function AddFile(name){
    client.open()
    .then(() => {
        client.submit(`g.addV('file').property('name', '${name}')`, {})
            .then((result) => {
                client.close();
                console.log(result);
            }, (error) => {
                console.log(error);
            });
    });
 }