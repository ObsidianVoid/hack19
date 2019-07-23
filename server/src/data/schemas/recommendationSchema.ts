import {gql} from 'apollo-server';

const typeDefs = gql`
    type File {
        Id: Int!,
        Name: String!,
        FileRecommendations: [File]
        ContributorRecommendations: [Contributor]
    }

    input FileInput {
        Id: Int!,
        Name: String!
    }

    type Contributor {
        Id: Int!,
        Name: String!
    }

    input ContributorInput {
        Id: Int!,
        Name: String!
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