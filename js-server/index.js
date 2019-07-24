// import mainSchema from './Schema/recommendationSchema';
// import mainResolver from './Resolvers/recommendationResolvers';
const mainSchema = require('./Schema/recommendationSchema')
const mainResolver = require('./Resolvers/recommendationResolvers');
var express = require('express');
var bodyParser = require('body-parser');
var express_graphql = require('express-graphql');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
var GremlinClient = require('./cosmos/gremlinClient');
var cors = require('cors')

const files = 
[
    {
        path: "file1",
        FileRecommendations: [
            {
                path: "file2",
            }
        ],
        ContributorRecommendations: [
            {
                email: "ankhokha@microsoft.com",
                name: "Ankit"
            }
        ]
    },
    {
        path: "file2",
        FileRecommendations: [
            {
                path: "file1",
            },
            {
                path: "file3",
            }
        ],
    }
];

const typeDefs = `
type File {
    path: String!,
    FileRecommendations: [File]
    ContributorRecommendations: [Contributor]
}

input FileInput {
    path: String!
}

type Contributor {
    email: String!,
    name: String!
}

input ContributorInput {
    email: String!,
    name: String!
}

type Query {
    file(path: String!): File
}

input EdgePropertiesInput {
    Key: String!
    Value: String!
}

input IngestionContract {
    Files: [FileInput]!
    ModifiedBy: ContributorInput
    Properties: [EdgePropertiesInput]
}

type Mutation {
    IngestPullRequest(pullRequest: IngestionContract!): Contributor
}
`;
// Root resolver
const resolvers =  {
    Query: {
        file: (parent, args) => {
            //return files.find(file => file.path == args.path);
        
            var path = args.path;

            return GremlinClient.recommendationFn(path).then((data)=>{
                data = data["_items"][0].properties;
                console.log(data);
                return data;

            },(error)=>{
                console.log("hsakjfhsak");
            });
        }
    },

    Mutation: {
        IngestPullRequest: (root, args) => {
            console.log("Inside mutation function");
            var pullRequest = args.pullRequest;
            console.log(pullRequest);
            console.log(pullRequest.Files[0].path);
            GremlinClient(pullRequest);
            console.log(pullRequest.ModifiedBy.email);
            console.log(pullRequest.ModifiedBy.name);
            var contributor = {"email": pullRequest.ModifiedBy.email, "name": pullRequest.ModifiedBy.name};
            return contributor;
        }
    }
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Create an express server and a GraphQL endpoint
var app = express();
app.use(cors())
app.use('/graphql',bodyParser.json(), graphqlExpress({
    schema
}));

app.use('/graphiql',graphiqlExpress({endpointURL: '/graphql'}));
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

