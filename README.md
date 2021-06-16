[![Build status](https://github.com/jfrog/xray-client-js/workflows/Build/badge.svg)](https://github.com/jfrog/xray-client-js/actions)

# Xray Javascript Client

Xray Javascript Client is a Javascript library, which wraps some of the REST APIs exposed by JFrog Xray.

## Getting started

Add xray-client-js as a dependency to your package.json file:

```json
"dependencies": {
  "xray-client-js": "^1.0.0"
}
```

## APIs

### Setting up Xray client

```javascript
let xrayClient = new XrayClient({
  serverUrl: 'ArtifactoryUrl',
  username: 'username',
  password: 'password',
  proxy: {host: '<organization>-xray.jfrog.io', port: 80, protocol: 'https'},
  headers: { 'key1': 'value1', 'key2': 'value2' };
});
```

### Pinging Xray

```javascript
xrayClient.system().ping()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

### Getting Xray version

```javascript
xrayClient.system().version()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

### Scanning bulk of dependencies

```javascript
let express = new ComponentDetails('npm://express:4.0.0');
let request = new ComponentDetails('npm://request:2.0.0');
xrayClient.summary().component({
    component_details: [express, request]
  })
  .then(result => {
    console.log(JSON.stringify(result));
  })
  .catch(error => {
    console.error(error);
  });
```

## Building and testing the sources

To build the plugin sources, please follow these steps:

* Clone the code from git.

* Install and pack the _xray-client-js_ dependency locally, by running the following npm commands:

```bash
npm i && npm pack
```

If you'd like run the _xray-client-js_ integration tests, follow these steps:

* Make sure your Xray instance is up and running.
* Set the CLIENTTESTS_ARTIFACTORY_URL, _CLIENTTESTS_XRAY_URL_, _CLIENTTESTS_PLATFORM_USERNAME_ and _CLIENTTESTS_PLATFORM_PASSWORD_ environment variables with your Artifactory & Xray URLs, username and password.
* Run the following command:

```bash
npm t
```

Important: The tests use port 9090 to set up an HTTP proxy server. If this port is already used on the machines which runs the tests, please replace it in the tests code with a different port.

## Pull requests

We welcome pull requests from the community.

### Guidelines

* Before creating your first pull request, please join our contributors community by signing [JFrog's CLA](https://secure.echosign.com/public/hostedForm?formid=5IYKLZ2RXB543N).
* If the existing tests do not already cover your changes, please add tests.
* Pull requests should be created on the _dev_ branch.
* Please run `npm run format` for formatting the code before submitting the pull request.
