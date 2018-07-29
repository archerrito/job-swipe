const admin = require('firebase-admin');
const functions = require('firebase-functions');
const createUser = require('./create_user');
const serviceAccount = require('./service_account.json');
const requestOneTimePassword = require('./request_one_time_password');
const verifyOneTimePassword = require('./verify_one_time_password');

//access service client to write data
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://job-swipe-f5a94.firebaseio.com"
  });

//anytime http request comes in, run function create_user
//saving it to createUSer tells firebase new cloud function named
exports.createUser = functions.https.onRequest(createUser);
exports.requestOneTimePassword = functions.https.onRequest(requestOneTimePassword);
exports.verifyOneTimePassword = functions.https.onRequest(verifyOneTimePassword);