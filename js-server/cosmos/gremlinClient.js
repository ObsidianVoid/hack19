var gremlin = require('gremlin');
var credentials = require('./config/credentials');


const authenticator = new gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${credentials.creds.database}/colls/${credentials.creds.collection}`, credentials.creds.primaryKey)

const client = new gremlin.driver.Client(
    credentials.creds.endpoint,
    {
        authenticator,
        traversalsource: "g",
        rejectUnauthorized: false,
        mimeType: "application/vnd.gremlin-v2.0+json"
    }
);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function Add(pullRequest) {
    // run loops
    // create node for each file
    var key = pullRequest.Properties[0].Key;
    var value = pullRequest.Properties[0].Value;
    console.log("-------------------------------------");
    for (var i=0;i<pullRequest.Files.length;i++) {
        var file = pullRequest.Files[i];
        var vertex = await client.submit(`g.V().has('path', '${file.path}')`, {});
        await sleep(2000);
        console.log("--files " + vertex.length + "  !" + file.path + "!");
        if (vertex.length === 0) {
            // create vertex
            if (value === "6") 
            {
            console.log("Creating vertex ------------------------------------------------ " + file.path);
            }
            await client.submit(`g.addV('file').property('pk', 'file').property('url', '${file.url}').property('path', '${file.path}')`, {});
            await sleep(2000);
            if (value === "6") 
            {
            console.log("Created vertex ------------------------------------------------ " + file.path);
            }
        }
    }
    console.log("-------------------------------------");

    for (var i=0;i<pullRequest.Files.length;i++) {
        for (var j=0;j<pullRequest.Files.length;j++) {
                if (i !== j) {
                var file1 = pullRequest.Files[i];
                var file2 = pullRequest.Files[j];
                console.log("PRID: " + value + " " + i + " " + j + " " + file1.path + " " + file2.path);
                // add an edge
                await client.submit(`g.V().has('path', '${file1.path}').addE("isRelated").to(g.V().has('path', '${file2.path}')).property('${key}', '${value}')`);
                await sleep(2000);
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
    await sleep(2000);
    if (vertex.length === 0) {
        // create vertex
        await client.submit(`g.addV('contributor').property('pk', 'contributor').property('email', '${email}').property('name', '${name}')`, {});
        await sleep(2000);
    }

    for (var i=0;i<pullRequest.Files.length;i++) {
        var file = pullRequest.Files[i];
        // add an edge
        await client.submit(`g.V().has('path', '${file.path}').addE("modifiedBy").to(g.V().has('email', '${email}')).property('${key}', '${value}')`);
        await sleep(2000);
    }
}

 module.exports = async function AddFile(pullRequest){
    // pullRequest.File[] -> path
    // pullRequest.ModifiedBy -> email and name
    return client.open()
    .then(async () => {
        // check if already exists
        return await Add(pullRequest).then(async () => { await client.close(); });
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