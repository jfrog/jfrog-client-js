# JFrog Javascript Client

JFrog Javascript Client is a Javascript library, which wraps some REST APIs exposed by JFrog's different services.

## Project Status

[![Tests](https://github.com/jfrog/jfrog-client-js/actions/workflows/test.yml/badge.svg)](https://github.com/jfrog/jfrog-client-js/actions/workflows/test.yml)
[![Code coverage](https://codecov.io/github/jfrog/jfrog-client-js/coverage.svg?branch=master)](https://codecov.io/github/jfrog/jfrog-client-js?branch=master)

## Contributions

We welcome pull requests from the community. To help us improve this project, please read our [contribution](./CONTRIBUTING.md#guidelines) guide.

## Getting started

Add jfrog-client-js as a dependency to your package.json file:

```json
"dependencies": {
  "jfrog-client-js": "^2.0.0"
}
```

## APIs

- [JFrog Javascript Client](#jfrog-javascript-client)
  - [Project Status](#project-status)
  - [Contributions](#contributions)
  - [Getting started](#getting-started)
  - [APIs](#apis)
    - [Setting up JFrog client](#setting-up-jfrog-client)
    - [Xray](#xray)
      - [Pinging Xray](#pinging-xray)
      - [Getting Xray Version](#getting-xray-version)
      - [Scanning Bulk of Dependencies](#scanning-bulk-of-dependencies)
      - [Scanning a Dependency Tree with Consideration to the JFrog Project](#scanning-a-dependency-tree-with-consideration-to-the-jfrog-project)
      - [Scanning a Dependency Tree with Consideration to the Xray Watches](#scanning-a-dependency-tree-with-consideration-to-the-xray-watches)
      - [Retrieving Xray Build Details](#retrieving-xray-build-details)
    - [Artifactory](#artifactory)
      - [Pinging Artifactory](#pinging-artifactory)
      - [Getting Artifactory Version](#getting-artifactory-version)
      - [Downloading an Artifact](#downloading-an-artifact)
      - [Downloading an Artifact content](#downloading-an-artifact-content)
      - [Downloading an Artifact to file](#downloading-an-artifact-to-file)
      - [Downloading an Artifact checksum](#downloading-an-artifact-checksum)
      - [Searching by AQL](#searching-by-aql)

### Setting up JFrog client

```javascript
let jfrogClient = new JfrogClient({
  platformUrl: 'https://my-platform-url.jfrog.io/',
  // artifactoryUrl - Set to use a custom Artifactory URL.
  // xrayUrl - Set to use a custom Xray URL.
  username: 'username',
  password: 'password',
  // OR
  accessToken: 'accessToken',

  // Optional parameters
  proxy: { host: '<organization>-xray.jfrog.io', port: 8081, protocol: 'https' },
  headers: { key1: 'value1', key2: 'value2' },
  // Connection retries. If not defined, the default value is 3.
  retries: 3,
});
```

### Xray

#### Pinging Xray

```javascript
jfrogClient
  .xray()
  .system()
  .ping()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Getting Xray Version

```javascript
jfrogClient
  .xray()
  .system()
  .version()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Scanning Bulk of Dependencies

```javascript
let express = new ComponentDetails('npm://express:4.0.0');
let request = new ComponentDetails('npm://request:2.0.0');
jfrogClient
  .xray()
  .summary()
  .component({
    component_details: [express, request],
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Scanning a Dependency Tree with Consideration to the JFrog Project

```javascript
const progress: XrayScanProgress = {
    setPercentage(percentage: number): void {
        // Add progress
    },
} as XrayScanProgress;

jfrogClient.xray().scan().graph({
  component_id: 'root-node',
  nodes: [{component_id: 'npm://express:4.0.0'}, {component_id: 'npm://request:2.0.0'}]
  }, progress, () => { /* if (something) throw Error('Aborted')*/ }, 'projectKey', [])
  .then(result => {
    console.log(JSON.stringify(result));
  })
  .catch(error => {
    console.error(error);
  });
```

#### Scanning a Dependency Tree with Consideration to the Xray Watches

```javascript
const progress: XrayScanProgress = {
    setPercentage(percentage: number): void {
        // Add progress
    },
} as XrayScanProgress;

jfrogClient.xray().scan().graph({
  component_id: 'root-node',
  nodes: [{component_id: 'npm://express:4.0.0'}, {component_id: 'npm://request:2.0.0'}]
  }, progress, () => { /* if (something) throw Error('Aborted')*/ }, '', ['watch-1', 'watch-2'])
  .then(result => {
    console.log(JSON.stringify(result));
  })
  .catch(error => {
    console.error(error);
  });
```

#### Retrieving Xray Build Details

```javascript
jfrogClient
  .xray()
  .details()
  .build('Build Name', '1', 'Optional Project Key')
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
```

### Artifactory

#### Pinging Artifactory

```javascript
jfrogClient
  .artifactory()
  .system()
  .ping()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Getting Artifactory Version

```javascript
jfrogClient
  .artifactory()
  .system()
  .version()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Downloading an Artifact

```javascript
jfrogClient
  .artifactory()
  .download()
  .downloadArtifact('path/to/artifact')
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Downloading an Artifact content

The content of the Artifact will be returned as a string.

```javascript
jfrogClient
  .artifactory()
  .download()
  .downloadArtifact('path/to/artifact')
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Downloading an Artifact to file

```javascript
jfrogClient
  .artifactory()
  .download()
  .downloadArtifactToFile('path/to/artifact', 'local/path/to/download')
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Downloading an Artifact checksum

```javascript
jfrogClient
  .artifactory()
  .download()
  .getArtifactChecksum('path/to/artifact')
  .then((result) => {
    console.log('sha1:' + result.sha1 + 'sha256:' + result.sha256 + 'md5:' + result.md5);
  })
  .catch((error) => {
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
