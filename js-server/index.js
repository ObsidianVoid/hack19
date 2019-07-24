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
        id: 1,
        name: "file1",
        FileRecommendations: [
            {
                id: 2,
                name: "file2",
            }
        ],
        ContributorRecommendations: [
            {
                id: 1,
                name: "Anirudh"
            }
        ]
    },
    {
        id: 2,
        name: "file2",
        FileRecommendations: [
            {
                id: 1,
                name: "file1",
            },
            {
                id: 3,
                name: "file3",
            }
        ],
    }
];

const typeDefs = `
type File {
    id: Int!,
    name: String!,
    FileRecommendations: [File]
    ContributorRecommendations: [Contributor]
}

input FileInput {
    id: Int!,
    name: String!
}

type Contributor {
    id: Int!,
    name: String!
}

input ContributorInput {
    id: Int!,
    name: String!
}

type Query {
    file(id: Int!): File
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
            return files.find(file => file.id == args.id);
        }
    },

    Mutation: {
        IngestPullRequest: (root, args) => {
            var pullRequest = args.pullRequest;
            GremlinClient(pullRequest.Files[0].name);
            var contributor = {"id": pullRequest.ModifiedBy.id, "name": pullRequest.ModifiedBy.name};
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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

