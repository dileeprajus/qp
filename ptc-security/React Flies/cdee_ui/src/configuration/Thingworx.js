/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/*global SERVER_APP_KEY, SERVER_BASE_URL*/
import axios from 'axios';
class ThingWorx {

  getHeaders(headers = {}) {
    let default_headers = {
      'Content-Type':'application/json',
      Accept:'application/json'
    };

    // If headers is null or empty then it has to be an object
    if (headers !== null && typeof headers === 'object') {
    } else {
      headers = {};
    }

    // Add or override default header properties
    for (var property in default_headers) {
      if (default_headers.hasOwnProperty(property)) {
        headers[property] = default_headers[property];
      }
    }
    //headers['appKey'] = ieGlobalVariable.serverAppKey;
    return headers;
  }

  getQueryParamsString(queryparams) {
    let queryString = '?appKey='.concat(ieGlobalVariable.serverAppKey);
    if (queryparams !== null && typeof queryparams === 'object') {
      for (var property in queryparams) {
        if (queryparams.hasOwnProperty(property)) {
          queryString.concat('&', property, '=', JSON.stringify(queryparams[property]));
        }
      }
    }
    return queryString;
  }

  midUrl(thingName) {
    return SERVER_BASE_URL.concat('/Thingworx/Things/', thingName, '/Services');
  }

  get_mid_url(midname, headers) {
    return axios.create({
      baseURL: SERVER_BASE_URL.concat('/Thingworx/Things/', midname, '/Services'),
      headers: this.getHeaders(headers),
      timeout: 100000
    });
  }

  api_call(input) {
    const {
      midpoint,
      endpoint,
      payload,
      queryparams,
      headers
    } = input;
    const genericAPI = this.get_mid_url(midpoint, headers);
  const queryParamString = this.getQueryParamsString(queryparams);
  //  const queryParamString = '';
    return new Promise(function (resolve, reject) {
      // TODO: add a conditional http request type
      genericAPI.post(endpoint+queryParamString, payload)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}

export default ThingWorx;
