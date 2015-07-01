var API_KEY = 'AIzaSyCt3s2McCe7vfvoxQnYvW9WtUR60HFAgPc';

// Subscribes the browser to the GCM and obtains an unique push id
function subscribe() {
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe().then(function(subscription) {
            // Keep your server in sync with the latest subscriptionId
            return sendSubscriptionToServer(subscription);
        }).catch(function(e) {
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
    });
}

// Unsubscribes the browser from the GCM in order to stop receiving more push messages
function unsubscribe() {
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // To unsubscribe from push messaging, you need get the
        // subscription object, which you can call unsubscribe() on.
        serviceWorkerRegistration.pushManager.getSubscription().then(
        function(pushSubscription) {
            // Check we have a subscription to unsubscribe
            if (!pushSubscription) {
                return;
            }

            var subscriptionId = pushSubscription.subscriptionId;
            // Removing the subscription id from the user
            return sendSubscriptionToServer(pushSubscription);

            // We have a subscription, so call unsubscribe on it
            pushSubscription.unsubscribe().then(function(successful) {
                console.log('Unsubscribed successfully');
            }).catch(function(e) {
                // We failed to unsubscribe, this can lead to
                // an unusual state, so may be best to remove
                // the users data from your data store and
                // inform the user that you have done so

                console.log('Unsubscription error: ', e);
            });
        }).catch(function(e) {
            console.error('Error thrown while unsubscribing from push messaging.', e);
        });
    });
}

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

window.addEventListener('load', function() {
    // Check that service workers are supported, if so, progressively
    // enhance and add push messaging support, otherwise continue without it.
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('js/sw.js').then(initialiseState);
        if (Notification.permission === 'granted') {
            subscribe();
        } else {
            unsubscribe();
        }
    } else {
        console.warn('Service workers aren\'t supported in this browser.');
    }
});

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

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription) {
            if (!subscription) {
                // We aren't subscribed to push, so set UI
                // to allow the user to enable push
                return;
            }

            // Keep your server in sync with the latest subscriptionId
            sendSubscriptionToServer(subscription);
        })
        .catch(function(err) {
            console.warn('Error during getSubscription()', err);
        });
  });
}

function sendSubscriptionToServer(subscription) {
    // The curl command to trigger a push message straight from GCM
    var curlCommand = 'curl --header "Authorization: key=' + API_KEY +
        '" --header Content-Type:"application/json" ' + subscription.endpoint +
        ' -d "{\\"registration_ids\\":[\\"' + subscription.subscriptionId + '\\"]}"';

    console.log(curlCommand);

    // var params = {
    //     'id': subscription.subscriptionId
    // };

    // $.post(BASE_URL + '/push/user/update', params, function(data) {
    //     if (data) {
    //         console.log("Push id obtained");
    //     } else {
    //         console.log("Push id not obtained");
    //     }
    // });
}