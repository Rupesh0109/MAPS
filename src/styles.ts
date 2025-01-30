import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E2D', // Dark background for a sleek, modern feel
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionStatus: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: '600',
        color: '#F1F1F1', // Light text on dark background
        textAlign: 'center',
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
        backgroundColor: '#2A2A3D', // Deep gray-blue for a futuristic vibe
        padding: 25,
        marginTop: 20,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
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
        backgroundColor: '#3A3A5A',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        marginRight: 20,
        justifyContent: 'center',
        elevation: 3,
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
        width: 45,
        height: 45,
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
        color: '#B0B0B0', // Lighter gray text for better contrast on dark background
        textAlign: 'center',
    },
    // New style for 'noNotificationText'
    noNotificationText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    appSwitchesWrapper: {
        marginVertical: 30, // Increased margin for better spacing
        paddingHorizontal: 15,
    },
    switchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#3A3A5A', // Background for switch section
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    switchLabel: {
        fontSize: 18,
        color: '#F1F1F1', // Light text color for labels
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
        color: '#FAFAFF', // Light color for better contrast
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E1E1E6', // Slightly lighter shade of white for section headers
        marginVertical: 15,
        textAlign: 'center',
    },
    futuristicButton: {
        backgroundColor: '#4B8CFF', // Bright, vibrant color for CTA buttons
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    futuristicButtonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: '600',
        textAlign: 'center',
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
      
});
