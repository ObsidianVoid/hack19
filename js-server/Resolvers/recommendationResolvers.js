const files = require("./Utils");

const resolvers = {
    Query: {
        file: (parent, args) => {
            return files.find(file => file.Id == args.id);
        }
    },

    Mutation: {
        IngestPullRequest: (parent, args) => {
            var pullRequest = args.pullRequest;
            
            var contributor = {"Id": pullRequest.ModifiedBy.Id, "Name": pullRequest.ModifiedBy.Name};
            return contributor;
        }
    }
}

module.exports.mainResolver = resolvers;