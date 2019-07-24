import {gql} from 'apollo-server';

const typeDefs = gql`
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

export default typeDefs;