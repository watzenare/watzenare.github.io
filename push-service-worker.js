// This is the serviceworker that will be running on background when a push is received

self.addEventListener('push', function(event) {
  // Since there is no payload data with the first version
  // of push messages, we'll grab some data from
  // an API and use it to populate a notification
  event.waitUntil(
    fetch(SOME_API_ENDPOINT).then(function(response) {
      if (response.status !== 200) {
        // Either show a message to the user explaining the error
        // or enter a generic message and handle the
        // onnotificationclick event to direct the user to a web page
        console.log('Looks like there was a problem. Status Code: ' + response.status);
      throw new Error();
      }

      // Examine the text in the response
      return response.json().then(function(data) {
        if (data.error || !data.notification) {
          console.error('The API returned an error.', data.error);
          throw new Error();
        }

        var title = data.notification.title;
        var message = data.notification.message;
        var icon = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/retro-mushroom-super-2.png';
        var notificationTag = data.notification.tag;

        return self.registration.showNotification(title, {
          body: message,
          icon: icon,
          tag: notificationTag
        });
      });
    }).catch(function(err) {
      console.error('Unable to retrieve data', err);

      var title = 'An error occurred';
      var message = 'We were unable to get the information for this push message';
      var icon = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/retro-mushroom-super-2.png';
      var notificationTag = 'notification-error';
      return self.registration.showNotification(title, {
          body: message,
          icon: icon,
          tag: notificationTag
        });
    })
  );
});

// self.addEventListener('push', function(event) {
//     var data = {};
//     var icon = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/retro-mushroom-super-2.png';

//     if (event.notification) {
//         console.log('Received a push message');
//         data = event.notification.json();

//         event.waitUntil(
//             self.registration.showNotification(data.title, {
//                 body: data.body,
//                 icon: icon,
//                 tag: data.tag
//             })
//         );
//     } else {
//         console.log('No push data received');
//         var title = 'Yay a message!';
//         var body = 'We have received a push message.';
//         var icon = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/retro-mushroom-super-2.png';
//         var tag = 'simple-push-demo-notification-tag';

//         event.waitUntil(
//             self.registration.showNotification(title, {
//                 body: body,
//                 icon: icon,
//                 tag: tag
//             })
//         );
//     }
// });

// // If user click on the notification window, we have to take him to the interesting content
// self.addEventListener('notificationclick', function(event) {
//     console.log('On notification click: ', event.notification.tag);
//     // Android doesn't close the notification when you click on it
//     // See: http://crbug.com/463146
//     event.notification.close();

//     console.log(event);
//     console.log(event.notification);

//     // // This looks to see if the current window is already open and focuses if it is
//     // event.waitUntil(
//     //     clients.matchAll({
//     //         type: "window"
//     //     })
//     //     .then(function(clientList) {
//     //         for (var i = 0; i < clientList.length; i++) {
//     //             var client = clientList[i];
//     //             if (client.url == '/' && 'focus' in client)
//     //                 return client.focus();
//     //             }
//     //         if (clients.openWindow) {
//     //             return clients.openWindow('/');
//     //         }
//     //     })
//     // );
// });