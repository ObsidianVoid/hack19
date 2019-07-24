import {files} from '../Utils'
import * as GremlinClient from '../../cosmos/gremlinClient'

const resolvers = {
    Query: {
        file: (parent, args) => {
            return files.find(file => file.path == args.path);
        }
    },

    Mutation: {
        IngestPullRequest: (parent, args) => {
            var pullRequest = args.pullRequest;

            GremlinClient.AddFile(pullRequest.Files[0].path);
            
            var contributor = {"email": pullRequest.ModifiedBy.email, "name": pullRequest.ModifiedBy.name};
            return contributor;
        }
    }
}

export default resolvers;