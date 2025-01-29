import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles'; // Make sure to import your styles

interface WNotificationProps {
    icon: string;
    text?: string; // Make text optional
    app: string;
    timeStr: string;
    messages: string[];
}

const WhNotification: React.FC<WNotificationProps> = ({
    icon,
    text,
    app,
    timeStr,
    messages,
}) => {
    // Convert timestamp to a readable date
    const date = new Date(Number(timeStr));
    const formattedTime = date.toLocaleString(); // Format the date as needed

    // Clean up any non-breaking spaces in the text
    const cleanText = (text: string | undefined) => {
        if (typeof text === 'string') {
            return text.replace(/\u00A0/g, ' ');
        }
        return ''; // Return an empty string if text is undefined or not a string
    };

    return (
        <View style={styles.notificationWrapper}>
            <View style={styles.notification}>
                <View style={styles.imagesWrapper}>
                    {!!icon && (
                        <View style={styles.notificationIconWrapper}>
                            <Image
                                source={{ uri: icon }}
                                style={styles.notificationIcon}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.notificationInfoWrapper}>
                    {!!formattedTime && (
                        <Text style={styles.textInfo}>{`Time: ${formattedTime}`}</Text>
                    )}
                    {!!text && (
                        <Text style={styles.textInfo}>{`Text: ${cleanText(text)}`}</Text>
                    )}
                    {!!app && (
                        <Text style={styles.textInfo}>{`App: ${cleanText(app)}`}</Text>
                    )}
                    {messages && messages.length > 0 && (
                        <View>
                            <Text style={styles.textInfo}>Messages:</Text>
                            {messages.map((message, index) => (
                                <Text key={index} style={styles.textInfo}>
                                    {`- ${cleanText(message)}`}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default WhNotification;