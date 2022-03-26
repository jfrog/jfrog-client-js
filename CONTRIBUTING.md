# Guidelines

- If the existing tests do not already cover your changes, please add tests.
- Pull requests should be created on the _master_ branch.
- Please run `npm run format` for formatting the code before submitting the pull request.

# Building and Testing the Sources

To build the plugin sources, please follow these steps:

- Clone the code from git.

- Install and pack the _jfrog-client-js_ dependency locally, by running the following npm commands:

```bash
npm i && npm pack
```

If you'd like run the _jfrog-client-js_ integration tests, follow these steps:

- Make sure your JFrog platform is up and running.
- Set the _CLIENTTESTS_PLATFORM_URL_ environment variable with your JFrog platform URL.
- Set the _CLIENTTESTS_PLATFORM_ACCESS_TOKEN_ OR _CLIENTTESTS_PLATFORM_USERNAME_ and _CLIENTTESTS_PLATFORM_PASSWORD_ environment variables with your JFrog platform credentials.
- Run the following command:

```bash
npm t
```

Important: The tests use port 9090 to set up an HTTP proxy server. If this port is already used on the machines which runs the tests, please replace it in the tests code with a different port.
