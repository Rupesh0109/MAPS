package com.maps



import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            // Start the NotificationListenerService when the device reboots
            val serviceIntent = Intent(context, NotificationListenerService::class.java)
            context?.startService(serviceIntent)
            Log.d("BootReceiver", "Notification Listener Service started after boot")
        }
    }
}
