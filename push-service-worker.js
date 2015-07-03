// var APPLICATION_CODE = "4F3E2-B560E";
// var pushwooshUrl = "https://cp.pushwoosh.com/json/1.3/";
// var hwid = "hwid";
// var url = null;


// self.addEventListener('push', function (event) {
//     // Since there is no payload data with the first version
//     // of push messages, we'll grab some data from
//     // an API and use it to populate a notification
//     event.waitUntil(
//         fetch(pushwooshUrl + 'getLastMessage', {
//             method: 'post',
//             headers: {
//                 "Content-Type": "text/plain;charset=UTF-8"
//             },
//             body: '{"request": {"application": "' + APPLICATION_CODE + '","hwid": "' + hwid + '"}}'
//         }).then(function (response) {
//             if (response.status !== 200) {
//                 // Either show a message to the user explaining the error
//                 // or enter a generic message and handle the
//                 // onnotificationclick event to direct the user to a web page
//                 console.log('Looks like there was a problem. Status Code: ' + response.status);
//                 throw new Error();
//             }

//             // Examine the text in the response
//             return response.json().then(function (data) {
//                 if (!data.response.notification) {
//                     console.error('The API returned an error.', data.error);
//                     throw new Error();
//                 }
//                 var notification = data.response.notification;
//                 console.log(notification);

//                 var title = notification.chromeTitle || 'Title';
//                 var message = notification.content;
//                 var icon = notification.chromeIcon || 'https://cp.pushwoosh.com/img/logo-medium.png';
//                 var messageHash = notification.messageHash;
//                 url = notification.url;

//                 return self.registration.showNotification(title, {
//                     body: message,
//                     icon: icon,
//                     tag: messageHash
//                 });
//             });
//         }).catch(function (err) {
//             console.error('Unable to retrieve data', err);

//             var title = 'An error occurred';
//             var message = 'We were unable to get the information for this push message';
//             var notificationTag = 'notification-error';
//             return self.registration.showNotification(title, {
//                 body: message,
//                 tag: notificationTag
//             });
//         })
//     );
// });

// This is the serviceworker that will be running on background when a push is received

self.addEventListener('push', function(event) {
    var data = {};
    var icon = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/retro-mushroom-super-2.png';

    if (event.notification) {
        console.log('Received a push message');
        data = event.notification.json();

        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: icon,
                tag: data.tag
            })
        );
    } else {
        console.log('No push data received');
        var title = 'Yay a message!';
        var body = 'We have received a push message.';
        var icon = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/retro-mushroom-super-2.png';
        var tag = 'simple-push-demo-notification-tag';

        event.waitUntil(
            self.registration.showNotification(title, {
                body: body,
                icon: icon,
                tag: tag
            })
        );
    }
});

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