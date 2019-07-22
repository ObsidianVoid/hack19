import {gql} from 'apollo-server';

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

export default typeDefs;