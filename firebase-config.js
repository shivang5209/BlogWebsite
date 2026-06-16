// Firebase SDK Configuration & Initialization
// Connects to your shivang-blog cloud project

const firebaseConfig = {
  apiKey: "AIzaSyDw-k9KowZTiDx9Q38XHIdRz42dp5Ij2HE",
  authDomain: "shivang-blog.firebaseapp.com",
  projectId: "shivang-blog",
  storageBucket: "shivang-blog.firebasestorage.app",
  messagingSenderId: "23488086703",
  appId: "1:23488086703:web:3b736c4b12b11a42010a5a",
  measurementId: "G-8XBHR5ELBD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Expose services globally for client scripts
window.db = firebase.firestore();
window.auth = firebase.auth();
window.storage = firebase.storage();
