var API_KEY = 'AIzaSyCt3s2McCe7vfvoxQnYvW9WtUR60HFAgPc';

function sendSubscriptionToServer(subscription) {
  if (!subscription) {
    $("#demo").html("Fail");
  } else {
    console.log(subscription);
    $("#demo").html(subscription.subscriptionId);
  }
}


// Once the service worker is registered set the initial state
function initialiseState() {
  // Are Notifications supported in the service worker?
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported.');
    return;
  }

  // Check the current Notification permission.
  // If its denied, it's a permanent block until the user changes the permission
  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.');
    return;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.');
    return;
  }

  // We need the service worker registration to check for a subscription
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // Do we already have a push message subscription?
    serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription) {
        if (!subscription) {
          return;
        }

        // Keep your server in sync with the latest subscriptionId
        sendSubscriptionToServer(subscription);
      })
      .catch(function(err) {
        console.warn('Error during getSubscription()', err);
      });
  })
  .catch(function(err) {
    console.warn('Error during initialiseState()', err);
  });
}

function subscribe() {
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe().then(function(subscription) {
        return sendSubscriptionToServer(subscription);
      }, function(err) {
        console.log("subscribe2");
        console.log(err);
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          console.warn('Permission for Notifications was denied');
        } else {
          // A problem occurred with the subscription; common reasons
          // include network errors, and lacking gcm_sender_id and/or
          // gcm_user_visible_only in the manifest.
          console.error('Unable to subscribe to push.', e);
        }
      });
  }).catch(function(e) {
    console.log('Subscription error: ', e);
  });
}



function unsubscribe() {
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // To unsubscribe from push messaging, you need get the
    // subscription object, which you can call unsubscribe() on.
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function(pushSubscription) {
        // Check we have a subscription to unsubscribe
        if (!pushSubscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          return;
        }

        var subscriptionId = pushSubscription.subscriptionId;
        return sendSubscriptionToServer(pushSubscription);

        // We have a subscription, so call unsubscribe on it
        pushSubscription.unsubscribe().then(function(successful) {
        }).catch(function(e) {
          // We failed to unsubscribe, this can lead to
          // an unusual state, so may be best to remove
          // the users data from your data store and
          // inform the user that you have done so

          console.log('Unsubscription error: ', e);
        });
      });
  });
}


// Requesting to the user if he wants to receive notifications (you can use the manifest.json to
// ge the same funcitonality)
function requestPermission() {
  Notification.requestPermission(function(result) {
      $("#perm").html(result);
      if (result === 'denied') {
          console.log('Permission wasn\'t granted. Allow a retry.');
          return;
      } else if (result === 'default') {
          console.log('The permission request was dismissed.');
          return;
      }
      console.log('Permission was granted for notifications');
  });
}


window.addEventListener('load', function() {
  // Check that service workers are supported, if so, progressively
  // enhance and add push messaging support, otherwise continue without it.
  if ('serviceWorker' in navigator) {
    // requestPermission();
    navigator.serviceWorker.register('/push-service-worker.js').then(initialiseState);
    subscribe();
  } else {
    $("#demo").html("<b>Push is no available for your browser (use Chrome or Firefox updated)</b>");
    console.warn('<b>Service workers aren\'t supported in this browser.</b>');
  }
});

// var params = {
//   'id': subscription.subscriptionId
// };
//
// $.post(BASE_URL + '/push/user/update', params, function(data) {
//     if (data) {
//         console.log("Push id obtained");
//     } else {
//         console.log("Push id not obtained");
//     }
// });