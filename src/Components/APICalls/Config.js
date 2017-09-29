import { Component } from 'react';

let axios = require('axios');
const apiUrl = "http://localhost:5000";
const initialAppState = {
			authenticated: false,
			loginError: null,
			registrationError: null,
	    newBucketlist: null,
	    newBucketlistItem: null,
};

class Requests extends Component {
	constructor(){
		super();
		this.state = initialAppState;
	}

	resetState(){
		this.setState(initialAppState);
	}

	setHeaders(token){
		return {
			headers: {
				"Authorization": "Bearer " + token,
				"Content-Type": "application/json",
			}
		};
	}

	authenticate(endPoint,credentials){
		/* 
			Authenticate User so that they may be able to access resources.
		*/
		axios.post(apiUrl + endPoint, credentials)
    .then((response) => {
      let responseData = response.data.message,
      		registrationMsg = "registered successfully";
      if(responseData.info === undefined){
      	if(responseData.includes(registrationMsg)){
	      	this.handleLogin(credentials);
	      }
      } else {
      	this.setState({
	      	authenticated: response.data,
	      });
      }   
    })
    .catch((error) => {
      console.log(error.response.data);
      let desiredEndPoint = endPoint,
      		resource = "register";
      if(desiredEndPoint.includes(resource)){
	      this.setState({
	      	registrationError: error.response.data.error,
	      	loginError: null,
	      	authenticated: false
	      });
	    } else {
	    	this.setState({
      	loginError: error.response.data.error,
      	registrationError: null,
      	authenticated: false,
      });
	    }
    });
	}

	getResource(resourceName, resourceUrl, token){
		/* 
			Get Resource Method does perform the get requests to API.
			The response is loaded to state to be shared across components.
		*/
		axios.get(apiUrl+resourceUrl, this.setHeaders(token))
		.then((response) => {
			const configs = this.state;
			configs[resourceName] = (	response.data.message.length > 0 ?
																response.data.message:
																null
															);
			this.setState(configs);
		})
		.catch((error) => {
			console.log(error.response.data.error);
			return error.response.data;
		})
	}	

	createResource(resourceType, resourceUrl, details){
		const token = this.state.authenticated.message.access_token;
		const headers = this.setHeaders(token);
		let payload = details;
		console.log(payload)
		axios.post(apiUrl + resourceUrl, payload, headers)
		.then((response) => {
			(resourceType === 'bucketlist' ? 
				this.setState({
					newBucketlist: response.data,
					newBucketlistItem: null,
				})
			:
				this.setState({
					newBucketlistItem: response.data,
					newBucketlist: null,
				}))
		})
		.catch(error => {
			console.log(error.response)
		})
	}

	deleteResource(resourceUrl, token){
		/*
			Delete Resource Method basically deletes either a 
			Bucketlist or a Bucketlist Item Resource
		*/
		axios.delete(apiUrl+resourceUrl, this.setHeaders(token))
		.then((response) => {
			console.log(response.data)
		})
		.catch((error) => {
			console.log(error.response)
		})
	}

	updateResource(resourceUrl, newDetails, token){
		const headers = this.setHeaders(token)
		const payload = newDetails
		axios.put(apiUrl + resourceUrl, payload, headers)
		.then((response) => {
			console.log(response.data)
		})
		.catch(error => {
			console.log(error.response)
		})
	}
}


export default Requests;