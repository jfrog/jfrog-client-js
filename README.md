[![Build status](https://github.com/jfrog/jfrog-client-js/workflows/Build/badge.svg)](https://github.com/jfrog/xray-client-js/actions)

# JFrog Javascript Client

JFrog Javascript Client is a Javascript library, which wraps some REST APIs exposed by JFrog's different services.

## Getting started

Add jfrog-client-js as a dependency to your package.json file:

```json
"dependencies": {
  "jfrog-client-js": "^2.0.0"
}
```

## APIs
### Setting up JFrog client

```javascript
let jfrogClient = new JfrogClient({
    platformUrl: 'my-platform-url.jfrog.io/',
    // artifactoryUrl - Set to use a custom Artifactory URL.
    // xrayUrl - Set to use a custom Xray URL.
    username: 'username',
    password: 'password',
    // OR
    accessToken: 'accessToken',
    proxy: {host: '<organization>-xray.jfrog.io', port: 8081, protocol: 'https'},
    headers: {'key1': 'value1', 'key2': 'value2'}
});
```

### Xray
#### Pinging Xray

```javascript
jfrogClient.xray().system().ping()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

#### Getting Xray version

```javascript
jfrogClient.xray().system().version()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

#### Scanning bulk of dependencies

```javascript
let express = new ComponentDetails('npm://express:4.0.0');
let request = new ComponentDetails('npm://request:2.0.0');
jfrogClient.xray().summary().component({
    component_details: [express, request]
  })
  .then(result => {
    console.log(JSON.stringify(result));
  })
  .catch(error => {
    console.error(error);
  });
```

#### Retrieving Xray Build Details

```javascript
jfrogClient.xray().details().build('Build Name', '1', 'Optional Project Key')
  .then(result => {
    console.log(JSON.stringify(result));
  })
  .catch(error => {
    console.error(error);
  });
```

### Artifactory

#### Pinging Artifactory

```javascript
jfrogClient.artifactory().system().ping()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

#### Getting Artifactory version

```javascript
jfrogClient.artifactory().system().version()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

#### Downloading an artifact

```javascript
jfrogClient.artifactory().download().downloadArtifact('path/to/artifact')
  .then(result => {
    console.log(JSON.stringify(result));
  })
  .catch(error => {
    console.error(error);
  });
```

#### Searching by AQL

```javascript
jfrogClient.artifactory()
    .search()
    .aqlSearch(
        'items.find({' +
        '"repo":"my-repo-name",' +
        '"path":{"$match":"*"}}' +
        ').include("name","repo","path","created").sort({"$desc":["created"]}).limit(10)'
    );
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

* Install and pack the _jfrog-client-js_ dependency locally, by running the following npm commands:

```bash
npm i && npm pack
```

If you'd like run the _jfrog-client-js_ integration tests, follow these steps:

* Make sure your JFrog platform is up and running.
* Set the _CLIENTTESTS_PLATFORM_URL_ environment variable with your JFrog platform URL.
* Set the _CLIENTTESTS_PLATFORM_ACCESS_TOKEN_ OR _CLIENTTESTS_PLATFORM_USERNAME_ and _CLIENTTESTS_PLATFORM_PASSWORD_ environment variables with your JFrog platform credentials.
* Run the following command:

```bash
npm t
```

Important: The tests use port 9090 to set up an HTTP proxy server. If this port is already used on the machines which runs the tests, please replace it in the tests code with a different port.

## Pull requests

We welcome pull requests from the community.

### Guidelines

* If the existing tests do not already cover your changes, please add tests.
* Pull requests should be created on the _master_ branch.
* Please run `npm run format` for formatting the code before submitting the pull request.
