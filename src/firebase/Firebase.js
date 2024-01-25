// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app'
// import {getAnalytics} from 'firebase/analytics'
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyABTSzel8D2L1AMU3WNhut1lPYqUmYO-EY',
  authDomain: 'focus-app-7ca5d.firebaseapp.com',
  projectId: 'focus-app-7ca5d',
  storageBucket: 'focus-app-7ca5d.appspot.com',
  messagingSenderId: '934772829424',
  appId: '1:934772829424:web:44867b7f786072371e6635',
  measurementId: 'G-FJV3PW4F36',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// const analytics = getAnalytics(app)
