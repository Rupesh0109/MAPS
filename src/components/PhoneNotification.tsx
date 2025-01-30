import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import styles from '../styles';

interface PhoneNotificationProps {
  icon: string; // URI for the icon image
  text: string; // Notification message
  app: string;  // App name (e.g., "Phone")
  time: string; // Time of the notification
  title: string; // Notification title
}

const PhoneNotification: React.FC<PhoneNotificationProps> = ({ icon, text, app, time, title }) => {
  return (
    <View style={styles.notificationWrapper}>
      <View style={styles.notificationHeader}>
        {/* Notification Icon */}
        <View style={styles.notificationIconWrapper}>
          <Image 
  source={icon && icon !== "" ? { uri: icon } : require('../assets/default-icon.png')} 
  style={styles.notificationIcon} 
/>

        </View>
        {/* App Info (App Name and Time) */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>{}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      {/* Notification Title and Message */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{text}</Text>
    </View>
  );
};

export default PhoneNotification;