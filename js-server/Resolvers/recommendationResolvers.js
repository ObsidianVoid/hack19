const files = require("./Utils");

const resolvers = {
    Query: {
        file: (parent, args) => {
            return files.find(file => file.id == args.id);
        }
    },

    Mutation: {
        IngestPullRequest: (parent, args) => {
            var pullRequest = args.pullRequest;
            
            var contributor = {"id": pullRequest.ModifiedBy.id, "name": pullRequest.ModifiedBy.name};
            return contributor;
        }
    }
}

module.exports.mainResolver = resolvers;