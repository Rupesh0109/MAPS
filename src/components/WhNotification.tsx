import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles';

interface WhNotificationProps {
    icon: string;
    text: string | { title: string, text: string }; // Handle both string or object
    app: string;
    timeString: string;
    messages: string[] | { title: string, text: string }[]; // Handle array of objects or strings
}

const WhNotification: React.FC<WhNotificationProps> = ({ icon, text, app, timeString, messages }) => {
    // Convert timeString to a readable date (assuming it's a timestamp)
    const timestamp = new Date(Number(timeString)).toLocaleString();

    return (
        <View style={styles.notificationWrapper}>
            <View style={styles.notification}>
                {/* Display the app icon */}
                <Image source={{ uri: icon }} style={styles.notificationIcon} />
                
                <View style={styles.notificationInfoWrapper}>
                    {/* Display the message count or text */}
                    <Text style={styles.textInfo}>
                        {messages.length === 1
                            ? "1 new message"
                            : typeof text === 'object'
                            ? text.text  // If text is an object, render the 'text' property
                            : text       // If text is a string, render it
                        }
                    </Text>

                    {/* Display messages */}
                    {Array.isArray(messages) &&
                        messages.map((message, index) => (
                            <View key={index}>
                            <Text style={styles.textInfo}>
                            {typeof message === 'object' ? message.title : message}:{typeof message === 'object' ? message.text : message} {/* Handle object or string */}
                            </Text>
                            </View>
                            
                        ))
                    }

                    {/* Display timestamp */}
                    <Text style={styles.textInfo}>{timestamp}</Text>
                </View>
            </View>
        </View>
    );
};

export default WhNotification;
