import firebase from "firebase"

//firebase config stuff

require("dotenv").config({ path: "../../.env" });

var config = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};

// var adminConf = {
//     type: process.env.REACT_APP_type,
//     project_id: process.env.REACT_APP_project_id,
//     private_key_id: process.env.REACT_APP_private_key_id,
//     private_key: process.env.REACT_APP_private_key,
//     client_email: process.env.REACT_APP_client_email,
//     client_id: process.env.REACT_APP_client_id,
//     auth_uri: process.env.REACT_APP_auth_uri,
//     token_uri: process.env.REACT_APP_token_uri,
//     auth_provider_x509_cert_url: process.env.REACT_APP_auth_provider_x509_cert_url,
//     client_x509_cert_url: process.env.REACT_APP_client_x509_cert_url,
// };


const fire = firebase.initializeApp(config);
export default fire;
