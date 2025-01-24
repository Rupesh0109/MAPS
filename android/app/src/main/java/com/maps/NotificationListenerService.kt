package com.maps

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback

class NotificationListenerService : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val notification = sbn.notification
        val packageName = sbn.packageName
        val notificationText = notification?.extras?.getCharSequence("android.text")?.toString() ?: ""
        
        // Check if the notification is from Google Maps (you can modify this check as per your requirement)
        if (packageName == "com.google.android.apps.maps") {
            // Extract relevant data from the notification
            val time = notification.extras.getCharSequence("android.subText")?.toString()
            val title = notification.extras.getCharSequence("android.title")?.toString()

            // You can then send this data back to React Native via the bridge
            // Example: Using `AsyncStorage` to store the data (from here, you can fetch it in JS)
            val data = mapOf(
                "title" to title,
                "time" to time,
                "text" to notificationText
            )

            // Here you can communicate with JS, e.g., using `sendIntent` or via the React Native bridge.
            // Note: You might need to use `sendBroadcast` to update your JavaScript side.
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
    }
}
