const auth = firebase.auth();
const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");
const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const userDetails = document.getElementById("userDetails");

// set up random thing generator
const db = firebase.firestore();
const thingsList = document.getElementById("thingsList");
const createThingButton = document.getElementById("createThing");
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.

    console.log("User signed in: ", user.displayName);
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    signInButton.disabled = true;
    signOutButton.disabled = false;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3>`;

    thingsRef = db.collection("things");

    createThingButton.addEventListener("click", () => {
      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        price: faker.commerce.price(),
        description: faker.lorem.sentence(),
      });
    });

    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        thingsList.innerHTML = "";
        snapshot.forEach((doc) => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${doc.data().name}</strong> - ${
            doc.data().price
          } <br> ${doc.data().description}
          <button class="delete" data-id="${doc.id}">Delete</button>`;
          li.querySelector(".delete").addEventListener("click", () => {
            thingsRef.doc(doc.id).delete();
          });
          thingsList.appendChild(li);
        });
      });
  } else {
    // No user is signed in.
    if (unsubscribe) {
      unsubscribe();
    }
    console.log("No user signed in");
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    signInButton.disabled = false;
    signOutButton.disabled = true;
  }
});

// document.addEventListener("DOMContentLoaded", function () {
//   const app = firebase.app();
//   const db = firebase.firestore();
//   console.log("Loading DB");
//   const myPost = db.collection("posts").doc("myPost");
//   myPost
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         console.log("Document data:", doc.data());
//       } else {
//         console.log("No such document!");
//       }
//     })
//     .catch((error) => {
//       console.log("Error getting document:", error);
//     });
// });

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in: ", user.dispayName);
    })
    .catch((error) => {
      console.error("Error signing in: ", error);
    });
}

function googleLogout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
}
