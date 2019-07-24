using System;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Client;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.WebApi;
using System.Collections.Generic;
using System.Linq;
using Contracts;
using System.Web;
using System.Threading;

namespace ConsoleApp2
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            const String c_collectionUri = "https://dev.azure.com/ankhokha";

            // Interactively ask the user for credentials, caching them so the user isn't constantly prompted
            
            VssCredentials creds = new VssBasicCredential(String.Empty, "");

            // Connect to Azure DevOps Services
            VssConnection connection = new VssConnection(new Uri(c_collectionUri), creds);

            // Get a GitHttpClient to talk to the Git endpoints
            GitHttpClient gitClient = connection.GetClient<GitHttpClient>();

            int pullRequestId = 1;
            IList<string> fileList = new List<string>();
            IList<File> fileDetailsList = new List<File>();
            List<FileInput> fileMutationDetailsList = new List<FileInput>();
            var repository = gitClient.GetRepositoryAsync("8ff8a410-814b-463b-8ecc-949c96fe2007").SyncResult();
            var repoLink = (repository.Links.Links["web"] as ReferenceLink).Href;
            var uriBuilder = new UriBuilder(repoLink);
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);

            while (true)
            {
                fileMutationDetailsList.Clear();
                Console.WriteLine(pullRequestId);
                // Get data about a specific repository
                IList<GitCommitRef> commitsList;
                try
                {
                    commitsList = gitClient.GetPullRequestCommitsAsync("8ff8a410-814b-463b-8ecc-949c96fe2007", pullRequestId).SyncResult();
                }
                catch (VssServiceException ex)
                {
                    Console.WriteLine(String.Format("Pull request with id {0} not found. Exiting...", pullRequestId));
                    break;
                }

                string email = "";
                string authorName = "";

                foreach (var commit in commitsList)
                {
                    var commitId = commit.CommitId;
                    var result = gitClient.GetChangesAsync(commitId, new Guid("8ff8a410-814b-463b-8ecc-949c96fe2007")).SyncResult<GitCommitChanges>();
                    var changes = result.Changes.ToList();
                    

                    foreach (var change in changes)
                    { 
                        fileList.Add(change.Item.Path);
                        query["path"] = change.Item.Path;
                        email = commit.Author.Email;
                        authorName = commit.Author.Name;
                        uriBuilder.Query = query.ToString();

                        var include = true;
                        foreach (var file in fileMutationDetailsList)
                        {
                            if (file.Path == change.Item.Path)
                            {
                                include = false;
                            }
                        }
                        if (include)
                        {
                            fileMutationDetailsList.Add(new FileInput(change.Item.Path, uriBuilder.ToString()));
                        }
                    }
                }

                string graphqlServer = "https://ganes-server.azurewebsites.net/graphql";

                var graphQlCLient = new GraphQL.Client.GraphQLClient(graphqlServer);

                var q = new GraphQL.Common.Request.GraphQLRequest();

                List<FileInput> a = new List<FileInput> ();

                q.Query = @"mutation Mutation1($files: [FileInput]!, $email: String!, $name: String!, $pullRequestId: String!)
                            {
                              IngestPullRequest(
                                pullRequest: {
                                  Files: $files,
                                  ModifiedBy:
                                        {
                                        email: $email,
                                        name: $name
                                  },
                                Properties:
                                        {
                                        Key: ""pullRequestId"",
                                        Value: $pullRequestId
                                    }
                                }
                              )
                              {
                                name
                                }
                            }";

                

                q.Variables = new {
                    files = fileMutationDetailsList,
                    email = email,
                    name = authorName,
                    pullRequestId = pullRequestId.ToString()
                };
                
                var response = graphQlCLient.PostAsync(q).SyncResult();

                Thread.Sleep(2000);

                pullRequestId++;
            }
        }
    }
}
