import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles';

interface MNotificationProps {
    time: string;
    direction: string;
    distance: string;
    icon: string;
    eta?: string;
    totdistanc?: string;
}

const MapsNotification: React.FC<MNotificationProps> = ({
    icon,
    time,
    direction,
    distance,
    eta,
    totdistanc,
    
}) => {
    const [timeStr, distanceStr, etaStr] = time?.split(' · ') || [];

    const cleanText = (text: string) => text.replace(/\u00A0/g, ' ');

    return (
        <View style={styles.notificationWrapper}>
            <View style={styles.notification}>
                <View style={styles.imagesWrapper}>
                    {!!icon && (
                        <View style={styles.notificationIconWrapper}>
                            <Image source={{ uri: icon }} style={styles.notificationIcon} />
                        </View>
                    )}
                </View>
                <View style={styles.notificationInfoWrapper}>
                    {!!timeStr && (
                        <Text style={styles.textInfo}>{`Time Left: ${cleanText(timeStr)}`}</Text>
                    )}
                    {!!distanceStr && (
                        <Text style={styles.textInfo}>{`Distance: ${cleanText(distanceStr)}`}</Text>
                    )}
                    {!!etaStr && (
                        <Text style={styles.textInfo}>{`ETA: ${cleanText(etaStr)}`}</Text>
                    )}
                    {!!eta && !etaStr && (
                        <Text style={styles.textInfo}>{`ETA: ${cleanText(eta)}`}</Text>
                    )}
                    {!!direction && (
                        <Text style={styles.textInfo}>{`Direction: ${cleanText(direction)}`}</Text>
                    )}
                    {!!distance && (
                        <Text style={styles.textInfo}>{`Distance: ${cleanText(distance)}`}</Text>
                    )}
                    {!!totdistanc && (
                        <Text style={styles.textInfo}>{`Total Distance: ${cleanText(totdistanc)}`}</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default MapsNotification;
