import React from 'react';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider  } from "react-apollo";
import { Query } from "react-apollo";
import { InMemoryCache } from 'apollo-cache-inmemory'
import { gql } from "apollo-boost";
import { loadPartialConfig } from '@babel/core';

const cache = new InMemoryCache();

const client = new ApolloClient({
    uri: 'https://ganes-server.azurewebsites.net/graphql', //Replace with the gql server uri
    cache
});

const GQLquery = gql`
{
  message
}
`;

const GQLqueryComponent: React.FC = () => (
<Query query = { GQLquery} >
      {({loading, error, data}) => {
          if(loading) {
            return <p>Loading</p>;
          }
          if(error) {
            console.log(error);
            return <p>Error..</p>;
          }
          return data.message;
        }}
    </Query>
); 
const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <GQLqueryComponent/>
    </ApolloProvider>
  );
}

export default App;
