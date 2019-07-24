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
query GetRecommendations ($path: String!) {
  file(path: $path){
    path,
    url,
    FileRecommendations{
      path
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
                  if(object && object.name){
                  return <div key={i}>
                    {
                      object.name
                    }
                    </div>;
                }
                else{
                    return <div>
                      No Contributors Available
                      </div>;
                }
              })
              }
  </div>
)
const FileRecommendationsComponent = (props) => (
  <div>
    <h5>Files</h5>
    {
                props.fileData.map(function(object,i){
                  if(object && object.path){
                  return <div key={i}>
                    {
                      object.path
                    }
                    </div>;
                }
                else{
                  return <div>
                    No File Recommendations
                    </div>;
                }
              })
              }
  </div>
)

const GQLqueryComponent = (props) => (

<Query query = { GQLquery} variables={{ path : props.textData }}>
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
              {data.file?<p>{data.file.path}</p>:<p>No File</p>}
              {data.file?<p>{data.file.url}</p>:<p>No File</p>}
              {data.file && data.file.FileRecommendations?<FileRecommendationsComponent fileData={data.file.FileRecommendations}></FileRecommendationsComponent>:<p>No FR</p>}
              {data.file && data.file.ContributorRecommendations?<ContributorRecommendationsComponent contributorData={data.file.ContributorRecommendations}></ContributorRecommendationsComponent>:<p>No CR</p>}
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
        {this.state.isClicked?<GQLqueryComponent textData={this.state.textValue}/>:null}
      </ApolloProvider>
    );
  }
}
