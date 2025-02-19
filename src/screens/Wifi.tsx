import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import WifiManager from 'react-native-wifi-reborn';
import { RootState } from '../redux/store';

const Wifi = () => {
    const lastMapsNotification = useSelector((state: RootState) => state.notifications.mapsNotification);
    const lastPhoneNotification = useSelector((state: RootState) => state.notifications.phoneNotification);
    const[iswifienabled,setiswifiEnabled]=useState(false);
    useEffect(()=>{


    },[])
  return (
    <View>
      <Text>Wifi</Text>
    </View>
  )
}

export default Wifi

const styles = StyleSheet.create({})