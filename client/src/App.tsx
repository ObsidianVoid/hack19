import React from 'react';
import  { Component } from 'react';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider  } from "react-apollo";
import { Query } from "react-apollo";
import { InMemoryCache } from 'apollo-cache-inmemory'
import { gql } from "apollo-boost";
import { loadPartialConfig } from '@babel/core';
import { tryFunctionOrLogError } from 'apollo-utilities';

const cache = new InMemoryCache();

const client = new ApolloClient({
    uri: 'https://ganes-server.azurewebsites.net/graphql', //Replace with the gql server uri
    cache
});

const GQLquery = gql`
query GetRecommendations ($id: Int!) {
  file(id: $id){
    id,
    name,
    FileRecommendations{
      name
    },
    ContributorRecommendations{
      name
    }
  }
}
`;


const ContributorRecommendationsComponent = (props) => (
  <div>
    <h5>Contributors</h5>
    {
      
                props.contributorData.map(function(object,i){
                  return <div key={i}>
                    {
                      object.name
                    }
                    </div>;
                })
              }
  </div>
)
const FileRecommendationsComponent = (props) => (
  <div>
    <h5>Files</h5>
    {
                props.fileData.map(function(object,i){
                  return <div key={i}>
                    {
                      object.name
                    }
                    </div>;
                })
              }
  </div>
)

const GQLqueryComponent = (props) => (

<Query query = { GQLquery} variables={{ id : props.textData }}>
      {({loading, error, data}) => {
  
          if(loading) {
            return <p>Loading</p>;
          }
          if(error) {
            console.log(error);
            return <p>Error..</p>;
          }
          return (
            <div>
              <p>{data.file.name}</p>
              <FileRecommendationsComponent fileData={data.file.FileRecommendations}></FileRecommendationsComponent>
              <ContributorRecommendationsComponent contributorData={data.file.ContributorRecommendations}></ContributorRecommendationsComponent>
            </div>
          );
        }}
    </Query>
); 

export class App extends Component<{}, any>{

  constructor(props){
    super(props);
    this.state = {
      isClicked: false,
      textValue: ""
    }
    this.handler = this.handler.bind(this);
  }
  handler(){
    this.setState({isClicked: true});
  }

  handleChange(event){

    this.setState({textValue: event.target.value});
  }
  render(){
    return (
      <ApolloProvider client={client}>
        <input type="text" id="inputFileId" name="textValue" value={this.state.textValue} 
    onChange={this.handleChange.bind(this)}></input>
        <input type="button" id="inputButton" value ="Submit" onClick={this.handler}></input>
        {this.state.isClicked?<GQLqueryComponent textData={parseInt(this.state.textValue,10)}/>:null}
      </ApolloProvider>
    );
  }
}
