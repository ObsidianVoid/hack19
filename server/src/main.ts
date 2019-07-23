import {ApolloServer, gql} from 'apollo-server';
import typeDefs from './data/schemas/recommendationSchema';
import resolvers from './data/resolvers/recommendationResolver';

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});