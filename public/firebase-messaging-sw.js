importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD_BmQLQocC6DdFWjVHnKof5BJ4DjhHDqQ",
  authDomain: "aurorareg-b787f.firebaseapp.com",
  projectId: "aurorareg-b787f",
  storageBucket: "aurorareg-b787f.appspot.com",
  messagingSenderId: "1053648640246",
  appId: "1:1053648640246:web:6802b37a39d4ff5d9b34d7",
  measurementId: "G-CYNFWPLLSS"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/notification-icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});