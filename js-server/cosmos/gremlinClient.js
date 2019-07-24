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

async function Add(pullRequest) {
    // run loops
    // create node for each file
    var key = pullRequest.Properties[0].Key;
    var value = pullRequest.Properties[0].Value;
    for (var i=0;i<pullRequest.Files.length;i++) {
        var file = pullRequest.Files[i];
        var vertex = await client.submit(`g.V().has('path', '${file.path}')`, {});
        console.log("files " + vertex.length);
        if (vertex.length === 0) {
            // create vertex
            await client.submit(`g.addV('file').property('pk', 'file').property('path', '${file.path}')`, {});
        }
    }

    for (var i=0;i<pullRequest.Files.length;i++) {
        for (var j=0;j<pullRequest.Files.length;j++) {
                if (i != j) {
                var file1 = pullRequest.Files[i];
                var file2 = pullRequest.Files[j];
                // add an edge
                
                await client.submit(`g.V().has('path', '${file1.path}').addE("isRelated").to(g.V().has('path', '${file2.path}')).property('${key}', '${value}')`);
                }
            }
    }

    await AddContributors(pullRequest);
}
async function getRecom(path){
    var result = await client.submit(`g.V().has('path','${path}')`,{});
    return result;
}
async function AddContributors(pullRequest) {
    var key = pullRequest.Properties[0].Key;
    var value = pullRequest.Properties[0].Value;
    var email = pullRequest.ModifiedBy.email;
    var name = pullRequest.ModifiedBy.name;
    var vertex = await client.submit(`g.V().has('email', '${email}')`, {});
    console.log("contributors " + vertex.length);
    if (vertex.length === 0) {
        // create vertex
        await client.submit(`g.addV('contributor').property('pk', 'contributor').property('email', '${email}').property('name', '${name}')`, {});
    }

    for (var i=0;i<pullRequest.Files.length;i++) {
        var file = pullRequest.Files[i];
        // add an edge
        await client.submit(`g.V().has('path', '${file.path}').addE("modifiedBy").to(g.V().has('email', '${email}')).property('${key}', '${value}')`);
    }
}

 module.exports = async function AddFile(pullRequest){
    // pullRequest.File[] -> path
    // pullRequest.ModifiedBy -> email and name
    client.open()
    .then(() => {
        // check if already exists
        Add(pullRequest).then(() => { client.close(); });
        // var result = await client.submit(`g.V().has('path', '${name}')`, {});
        // client.close();
            // .then((result) =>{
            //     console.log(result.length);
            // });
        // client.submit(`g.addV('file').property('path', '${name}')`, {})
        //     .then((result) => {
        //         client.submit(`g.V().has('path', '${name}').addE(')`)
        //             .then((result) => {
        //                 client.close();
        //                 console.log(result);
        //             })
            // }, (error) => {
            //     console.log(error);
            // });
 });
}

module.exports.recommendationFn=async function GetRecommendations(path){

    return client.open()
    .then((result) => {
         return getRecom(path).then((value)=>{
            client.close();
            return value;
        },(error)=>{
            console.log(error);
        });
    });
    
}