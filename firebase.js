const firebaseConfig = {
  apiKey: "AIzaSyC99NUO9YS1c5qQ38rbr_n6rBpCXZfsMkI",
  authDomain: "rental-inventory-96b16.firebaseapp.com",
  projectId: "rental-inventory-96b16",
  storageBucket: "rental-inventory-96b16.firebasestorage.app",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();