import React from 'react';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from "graphql-tag";

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: 'http://localhost:4000/', //Replace with the gql server uri
  cache
});

const GQLquery = gql`
  query GetRecommendations ($id: Int!) {
    file(id: $id){
      Id,
      Name,
      FileRecommendations{
        Name
      },
      ContributorRecommendations{
        Name
      }
    }
  }
`;

const ContributorRecommendationsComponent = (props) => (
  <div>
    {
      // props.forEach(element => {
      <p>{props[0].Name}</p>
      // })
    }
  </div>
)
const FileRecommendationsComponent = (props) => (
  <div>
    {
      // props.forEach(element => {
      <p>{props[0].Name}</p>
      // })
    }
  </div>
)

const GQLqueryComponent = () => (
  <Query query={GQLquery} variables={{ id: 1 }} >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading</p>;
      }
      if (error) {
        console.log(error);
        return <p>Error..</p>;
      }
      console.log(data);
      return (
        <div>
          <p>{data.file.Name}</p>
          <ContributorRecommendationsComponent {...data.file.ContributorRecommendations} />
          <FileRecommendationsComponent {...data.file.FileRecommendations} />
        </div>
      );
    }}
  </Query>
);
const App = () => {
  return (
    <ApolloProvider client={client}>
      <GQLqueryComponent />
    </ApolloProvider>
  );
}

export default App;
