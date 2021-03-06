import firebase from 'firebase';
import "firebase/auth";
import { showError } from './App';

var firebaseInitialize = {
    apiKey: "AIzaSyD-eMjoURAtrpfJKncCA02A4mP4hLkCDXM",
    authDomain: "kawan-kkn.firebaseapp.com",
    databaseURL: "https://kawan-kkn.firebaseio.com",
    projectId: "kawan-kkn",
    storageBucket: "kawan-kkn.appspot.com",
    messagingSenderId: "310367799040",
    appId: "1:310367799040:web:ac7457e70b9b1f1f3d55e5"
};

firebase.initializeApp(firebaseInitialize);

export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();

// SESSION
export const session = localStorage.getItem("session");
export const statusSession = localStorage.getItem("status");
export const addressSession = localStorage.getItem("address");

export const createSession = (uid, status, address) => {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("session", uid);
        localStorage.setItem("status", status);
        localStorage.setItem("address", address);
    } else {
        alert("Browser not supoort Session Place")
    }
}

// SIGNIN
export const getAuth = (dataUser) => {
    auth.signInWithEmailAndPassword(dataUser.email, dataUser.password).catch(function (error) {
        showError(error.message);
    });

    auth.onAuthStateChanged(function (user) {
        if (user != null) {
            var ref = database.ref('users/' + user.uid);

            ref.on("value", function (snapshot) {
                createSession(user.uid, snapshot.val().status, snapshot.val().address);
                auth.signOut().then(function () {

                }).catch(function (error) {
                    showError(error);
                });

                window.location.href = "/";
            }, function (err) {
                showError("Gagal dalam memproses, " + err.code);
            });
        }
        
    })
}

// SIGNUP
export const createAuth = (dataUser) => {
    auth.createUserWithEmailAndPassword(dataUser.email, dataUser.password).catch(function (error) {
        showError(error.message);
    });

    auth.onAuthStateChanged(function (user) {
        if (user != null) {
            database.ref('users/' + user.uid).set({
                username: dataUser.username,
                email: dataUser.email,
                password: dataUser.password,
                address: dataUser.address,
                status: dataUser.status
            })

            createSession(user.uid, dataUser.status, dataUser.address);
            auth.signOut().then(function () {

            }).catch(function (error) {
                showError(error);
            });

            window.location.href = "/";
        }
    })
}

// LOGOUT
export const logoutAuth = () => {
    window.localStorage.clear();
    window.location.href = "/";
}