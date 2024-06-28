# PKCE demo, nothing else init

## Known issue.

1. When the user first authorizing the application, after login it is not redirect back to original app.
2. Asking for authorization multiple times. WHich is not bad, but to make better user experience it should ask once.
   1. https://github.com/doorkeeper-gem/doorkeeper/issues/1468
   2. https://doorkeeper.gitbook.io/guides/configuration/skip-authorization
    
    Unfortunately, doorkeeper blocked this feature for public apps, https://github.com/doorkeeper-gem/doorkeeper/issues/1589 and https://github.com/doorkeeper-gem/doorkeeper/pull/1646.

3. The client secrets are committed, which shouldnt be the case

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

```bash
# Runs the app in the development mode.\
# Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
npm start`

# Builds the app for production to the `build` folder.\
# It correctly bundles React in production mode and optimizes the build for the best performance.

# The build is minified and the filenames include the hashes.\
# Your app is ready to be deployed!

# See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
npm run build
```
