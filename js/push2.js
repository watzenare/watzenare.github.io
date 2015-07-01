var isPushEnabled = false;

var API_KEY = 'AIzaSyCt3s2McCe7vfvoxQnYvW9WtUR60HFAgPc';

// Once the service worker is registered set the initial state
function initialiseState() {

  // Are Notifications supported in the service worker?
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported.');
    return;
  }


  // Check the current Notification permission.
  // If its denied, it's a permanent block until the
  // user changes the permission
  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.');
    return;
  }


  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.');
    return;
  }
  console.log("ini5");

  // We need the service worker registration to check for a subscription
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
  console.log("ini6");
    // Do we already have a push message subscription?
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
  console.log("ini7");
        // Enable any UI which subscribes / unsubscribes from
        // push messages.

        if (!subscription) {
  console.log("ini8");
          // We aren't subscribed to push, so set UI
          // to allow the user to enable push
          return;
        }

  console.log("ini9");
        // Keep your server in sync with the latest subscriptionId
        sendSubscriptionToServer(subscription);

        // Set your UI to show they have subscribed for
        // push messages
      })
      .catch(function(err) {
  console.log("ini10err");
        console.warn('Error during getSubscription()', err);
      });
  })
  .catch(function(err) {
  console.log("ini11err");
    console.warn('Error during initialiseState()', err);
  });
}

function sendSubscriptionToServer(subscription) {
  console.log(subscription.subscriptionId);
}

// function subscribe() {
//   console.log("subs1");
//   // Disable the button so it can't be changed while
//   // we process the permission request
//   navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
//     console.log("subs2");
//     serviceWorkerRegistration.pushManager.subscribe()
//       .then(function(subscription) {
//         console.log("subs3");
//         // The subscription was successful

//         return sendSubscriptionToServer(subscription);
//       })
//       .catch(function(e) {
//         console.log("subs4");
//         if (Notification.permission === 'denied') {
//           // The user denied the notification permission which
//           // means we failed to subscribe and the user will need
//           // to manually change the notification permission to
//           // subscribe to push messages
//           console.warn('Permission for Notifications was denied');
//         } else {
//           // A problem occurred with the subscription; common reasons
//           // include network errors, and lacking gcm_sender_id and/or
//           // gcm_user_visible_only in the manifest.
//           console.error('Unable to subscribe to push.', e);
//         }
//       });
//   }).catch(function(e) {
//     console.log("subs5");
//   console.error(e);
// });
// }



// function unsubscribe() {

//   navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
//     // To unsubscribe from push messaging, you need get the
//     // subscription object, which you can call unsubscribe() on.
//     serviceWorkerRegistration.pushManager.getSubscription().then(
//       function(pushSubscription) {
//         // Check we have a subscription to unsubscribe
//         if (!pushSubscription) {
//           // No subscription object, so set the state
//           // to allow the user to subscribe to push
//           return;
//         }

//         var subscriptionId = pushSubscription.subscriptionId;
//         return sendSubscriptionToServer(pushSubscription);

//         // We have a subscription, so call unsubscribe on it
//         pushSubscription.unsubscribe().then(function(successful) {
//         }).catch(function(e) {
//           // We failed to unsubscribe, this can lead to
//           // an unusual state, so may be best to remove
//           // the users data from your data store and
//           // inform the user that you have done so

//           console.log('Unsubscription error: ', e);
//         });
//       }).catch(function(e) {
//         console.error('Error thrown while unsubscribing from push messaging.', e);
//       });
//   });
// }

// Opens an alert asking to the user if he wants to receive notifications
Notification.requestPermission(function(result) {
    if (result === 'denied') {
        console.log('Permission wasn\'t granted. Allow a retry.');
        return;
    } else if (result === 'default') {
        console.log('The permission request was dismissed.');
        return;
    }
    console.log('Permission was granted for notifications');
});

// if (isPushEnabled) {
//   unsubscribe();
// } else {
//   subscribe();
// }

// Check that service workers are supported, if so, progressively
// enhance and add push messaging support, otherwise continue without it.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('js/sw.js')
  // navigator.serviceWorker.register('/push-service-worker.js')
  .then(initialiseState);
} else {
  console.warn('Service workers aren\'t supported in this browser.');
}