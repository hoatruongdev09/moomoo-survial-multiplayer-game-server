const admin = require('firebase-admin')
const serviceAccount = require('./ServiceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://moumouio.firebaseio.com"
});

const db = admin.firestore()
const errRef = db.collection('crash')
const exitRef = db.collection('exit')

function uploadError(error) {
    let docRef = errRef.doc(`error: ${new Date()}`).set(error)
}

function uploadExit(code) {

    let docRef = exitRef.doc(`exit: ${new Date()}`).set({
        exitCode: code,
        time: new Date()
    })
}
module.exports = {
    uploadError: uploadError,
    uploadExit: uploadExit
}