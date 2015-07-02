// This is the serviceworker that will be running on background when a push is received

self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

    var data = {};
    var icon = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/retro-mushroom-super-2.png';

    // if (event.data) {
    //     data = event.data.json();
    //     console.log('Received a push message', event);
    // } else {
    //     console.log('No push data received', event);
    //     return;
    // }

    var title = 'New push!';
    var body = 'You have received a push message.';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        self.registration.showNotification(title, {
        // self.registration.showNotification(data.title, {
            body: body,
            // body: data.body,
            icon: icon,
            tag: tag
            // tag: data.tag
        })
    );

    // setTimeout(n.close.bind(event), 10000);
});

// // If user click on the notification window, we have to take him to the interesting content
// self.addEventListener('notificationclick', function(event) {
//     console.log('On notification click: ', event.notification.tag);
//     // Android doesn't close the notification when you click on it
//     // See: http://crbug.com/463146
//     event.notification.close();

//     // This looks to see if the current window is already open and focuses if it is
//     event.waitUntil(
//         clients.matchAll({
//             type: "window"
//         })
//         .then(function(clientList) {
//             for (var i = 0; i < clientList.length; i++) {
//                 var client = clientList[i];
//                 if (client.url == '/' && 'focus' in client)
//                     return client.focus();
//                 }
//             if (clients.openWindow) {
//                 return clients.openWindow('/');
//             }
//         })
//     );
// });
