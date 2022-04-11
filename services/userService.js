const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} = require("firebase/auth")
const auth = getAuth();

exports.addUser = (email, password) => {

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`user created : [${user.email}]`)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode}: ${errorMessage}`)
        });
}

exports.authenticate = async (email, password) => {
    let res = null;
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user) {
                res = user;
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode}: ${errorMessage}`)
        });

    return res;
}

exports.signOut = async () => {
    let res = false;
    await signOut(auth).then(() => {
        res = true;
    }).catch((error) => {
        res = false;
    });

    return res;
}