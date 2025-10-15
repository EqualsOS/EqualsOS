import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// This configures how notifications behave when the app is in the foreground.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});

class NotificationHandler {
    async sendLocalNotification(title: string, message: string) {
        // --- UPDATED: Web-specific notification logic ---
        if (Platform.OS === 'web') {
            // 1. Check if the browser supports notifications
            if (!('Notification' in window)) {
                alert('This browser does not support desktop notifications.');
                return;
            }

            // 2. Request permission from the user
            const permission = await Notification.requestPermission();

            // 3. If permission is granted, create the notification
            if (permission === 'granted') {
                new Notification(title, {
                    body: message,
                    // You can add an icon for web notifications here if you have one
                    // icon: '/path/to/icon.png',
                });
            }
        }
        // --- Native mobile logic (unchanged) ---
        else {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to send notifications was denied!');
                return;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: message,
                },
                trigger: null, // null means "send now"
            });
        }
    }
}

// Export a single instance for the entire app to use
export default new NotificationHandler();
