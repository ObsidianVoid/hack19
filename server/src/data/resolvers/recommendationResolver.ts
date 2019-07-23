import {files} from '../Utils'
import * as GremlinClient from '../../cosmos/gremlinClient'

const resolvers = {
    Query: {
        file: (parent, args) => {
            return files.find(file => file.Id == args.id);
        }
    },

    Mutation: {
        IngestPullRequest: (parent, args) => {
            var pullRequest = args.pullRequest;

            GremlinClient.AddFile(pullRequest.Files[0].Name);
            
            var contributor = {"Id": pullRequest.ModifiedBy.Id, "Name": pullRequest.ModifiedBy.Name};
            return contributor;
        }
    }
}

export default resolvers;