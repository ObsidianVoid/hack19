import * as Gremlin from 'gremlin';
import {credentials} from './config/credentials';

const authenticator = new Gremlin.driver.PlainTextSaslAuthenticator('/dbs/${credentials.database}/colls/${credentials.collection}', credentials.primaryKey);

const client = new Gremlin.driver.Client(
    credentials.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);