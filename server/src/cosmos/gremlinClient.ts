import * as Gremlin from 'gremlin';
import {credentials} from './config/credentials';

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${credentials.database}/colls/${credentials.collection}`, credentials.primaryKey)

const client = new Gremlin.driver.Client(
    credentials.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);

export function AddFile(name: string){
    client.open()
    .then(() => {
        client.submit(`g.addV('file').property('path', '${name}')`, {})
            .then((result) => {
                client.close();
                console.log(result);
            }, (error) => {
                console.log(error);
            });
    });
}