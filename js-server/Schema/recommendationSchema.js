const typeDefs = `
    type File {
        id: Int!,
        Name: String!,
        FileRecommendations: [File]
        ContributorRecommendations: [Contributor]
    }

    input FileInput {
        id: Int!,
        Name: String!
    }

    type Contributor {
        id: Int!,
        Name: String!
    }

    input ContributorInput {
        id: Int!,
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

module.exports.typeDefs = typeDefs;