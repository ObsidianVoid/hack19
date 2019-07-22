import {ApolloServer, gql} from 'apollo-server';
// import schema from './data/schemas/recommendationSchema';
import resolvers from './data/resolvers/recommendationResolver';

const typeDefs = gql`
    type File {
        Id: Int!,
        Name: String!,
        FileRecommendations: [File]
        ContributorRecommendations: [Contributor]
    }

    type Contributor {
        Id: Int!,
        Name: String!
    }

    type Query {
        file(id: Int!): File
    }
`;

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});