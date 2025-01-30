import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D21', // Deep space blue background
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionStatus: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E0E0FF', // Neon white text
        textAlign: 'center',
        letterSpacing: 1,
    },
    notificationsWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.9,
    },
    notificationWrapper: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'rgba(42, 42, 61, 0.9)', // Glassmorphism translucent effect
        padding: 20,
        marginTop: 20,
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#4B8CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(75, 140, 255, 0.3)', // Subtle neon blue border
    },
    notification: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingBottom: 10,
    },
    imagesWrapper: {
        flexDirection: 'column',
    },
    notificationInfoWrapper: {
        flex: 1,
    },
    notificationIconWrapper: {
        backgroundColor: 'rgba(58, 58, 90, 0.7)', // Glass effect
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        marginRight: 20,
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#4B8CFF',
        shadowOpacity: 0.4,
    },
    notificationIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    notificationImageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        marginRight: 20,
        justifyContent: 'center',
    },
    notificationImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    buttonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    textInfo: {
        fontSize: 16,
        color: '#C0C0FF', // Soft neon for contrast
        textAlign: 'center',
    },
    noNotificationText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    appSwitchesWrapper: {
        marginVertical: 30,
        paddingHorizontal: 15,
    },
    switchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 12,
        backgroundColor: 'rgba(58, 58, 90, 0.8)', // Glass effect
        borderRadius: 15,
        elevation: 6,
        shadowColor: '#FF6600',
        shadowOpacity: 0.4,
    },
    switchLabel: {
        fontSize: 18,
        color: '#E0E0FF',
        fontWeight: '500',
    },
    appTogglesWrapper: {
        marginVertical: 15,
    },
    appToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    appName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FAFAFF',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#E1E1E6',
        marginVertical: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    futuristicButton: {
        backgroundColor: '#4B8CFF', // Vibrant neon blue
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 50,
        elevation: 6,
        shadowColor: '#4B8CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#FFFFFF40', // Subtle white glow
    },
    futuristicButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    gradientBackground: {
        flex: 1,
        borderRadius: 15,
        backgroundColor: 'linear-gradient(45deg, #FF0000, #FF6600, #FFCC00)', // Gradient for futuristic feel
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    appInfo: {
        flex: 1,
    },
    time: {
        fontSize: 12,
        color: '#A0A0A0',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E1E1E6',
        marginBottom: 5,
    },
    message: {
        fontSize: 14,
        color: '#B0B0B0',
    },
    // New styles for futuristic design
    futuristicContainer: {
        flex: 1,
        backgroundColor: '#0D0D21',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    futuristicText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E0E0FF',
        textAlign: 'center',
        letterSpacing: 1,
        textShadowColor: '#4B8CFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    futuristicCard: {
        width: width * 0.9,
        backgroundColor: 'rgba(42, 42, 61, 0.9)',
        padding: 20,
        marginTop: 20,
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#4B8CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(75, 140, 255, 0.3)',
    },
    futuristicCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    futuristicCardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E1E1E6',
        marginBottom: 5,
        textShadowColor: '#4B8CFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
    },
    futuristicCardMessage: {
        fontSize: 14,
        color: '#B0B0B0',
    },
    futuristicCardIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        tintColor: '#4B8CFF',
    },
    futuristicCardImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#4B8CFF',
    },
    futuristicCardButton: {
        backgroundColor: '#4B8CFF',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 50,
        elevation: 6,
        shadowColor: '#4B8CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#FFFFFF40',
    },
    futuristicCardButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
    },
    futuristicCardGradient: {
        flex: 1,
        borderRadius: 15,
        backgroundColor: 'linear-gradient(45deg, #FF0000, #FF6600, #FFCC00)',
    },
});