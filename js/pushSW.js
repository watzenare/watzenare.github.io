// This is the serviceworker that will be running on background when a push is received

self.addEventListener('push', function(event) {

    var data = {};
    var icon = 'https://es.tviso.com/img/tviso-chrome-extension-logo.png';
    // var icon = 'https://es.tviso.com/img/tviso-app-logo.png';

    if (event.data) {
        data = event.data.json();
        console.log('Received a push message', event);
    }

    var title = 'Tviso';
    var body = 'You have received a push message.';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: icon,
            tag: data.tag
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
