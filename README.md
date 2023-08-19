# General Comments

Much of the homepage's content is stored in Firebase Firestore. To change the content of these pages, first refer to the admin pages then to the database directly.

<strong>The dependencies of this website aren't all updated to the latest release version, updating them may cause the website to break.</strong>

Additionally, in the future, it is recommended to remove create-react-app and replace it with a tool like Vite, since create-react-app is depreciated.

# Building & Deployment

Depending on where in the server you want the homepage to reference, change accordingly:

1. In App.js, replace the basename with the wanted page name. For example, current basename = "/", new basename = "/some/page/".

2. In package.json, at the end of the value for homepage, add the same page name. For example, homepage = "https://www.mysite.com/" -> homepage = "https://www.mysite.com/some/page/".

3. Run the command `npm run build` in the <strong>MIC</strong> folder to create an updated build. Then contents will be in the <strong>build</strong> folder.

4. Connect to the server, and replace the appropriate files with those of the built files. Additionally, if the `.htaccess` file is not in the same directory as the built files, add it.

# Available Scripts

In the project directory (directory containing the package.json file), you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
