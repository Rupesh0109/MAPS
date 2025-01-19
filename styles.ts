import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionStatus: {
        marginBottom: 20,
        fontSize: 18,
    },
    notificationsWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationWrapper: {
        flexDirection: 'column',
        width: width * 0.8,
        backgroundColor: '#f2f2f2',
        padding: 20,
        marginTop: 20,
        borderRadius: 5,
        elevation: 2,
    },
    notification: {
        flexDirection: 'row',
    },
    imagesWrapper: {
        flexDirection: 'column',
    },
    notificationInfoWrapper: {
        flex: 1,
    },
    notificationIconWrapper: {
        backgroundColor: '#aaa',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        marginRight: 15,
        justifyContent: 'center',
    },
    notificationIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    notificationImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        marginRight: 15,
        justifyContent: 'center',
    },
    notificationImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    buttonWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    scrollView: {
        flex: 1,
    },
    textInfo: {
        color: '#000',
    },
    noNotificationText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    appSwitchesWrapper: {
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    switchWrapper: {
        flexDirection: 'row', // Align the switch and label horizontally
        alignItems: 'center', // Vertically center the items
        justifyContent: 'flex-start', // Align items to the left
        marginVertical: 5,
        paddingHorizontal: 10, // Ensure there's space between the switch and the container
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10, // Space between the switch and the label
    },
    switchContainer: {  // New style for a container around the switch and label
        marginVertical: 10,  // Adjust the space around the entire switch container
        paddingHorizontal: 20,  // Padding for the switch container
        borderWidth: 1,  // Optional: you can add a border to the container
        borderRadius: 8, // Optional: rounded corners for the container
        backgroundColor: '#f9f9f9', // Optional: background color for the container
    },
    appTogglesWrapper: {
        marginVertical: 10,
    },
    appToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    appName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    appSelectionWrapper: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    appSelection: {
        fontSize: 18,
        color: '#007bff',
        marginVertical: 5,
        textAlign: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
});
