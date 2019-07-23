import {files} from '../Utils'

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

export default resolvers;