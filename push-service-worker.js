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
        console.log(event);
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

//     // // This looks to see if the current is already open and
    // focuses if it is
    // event.waitUntil(
    //     clients.matchAll({
    //         type: "window"
    //     }).then(function (clientList) {
    //         if (clients.openWindow) {
    //             if (url) {
    //                 var openUrl = url;
    //                 url = null;
    //                 return clients.openWindow(openUrl);
    //             }
    //             return clients.openWindow('/');
    //         }
    //     })
    // );
// });