import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import getTimesService from './services/getTimesService';

import * as Location from 'expo-location';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    top: 100,
    fontSize: 50,
    color: '#fff',
  },
  startButton: {
    bottom: 100,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ef5350',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  startButtonText: {
    position: 'relative',
    color: '#fff',
    fontSize: 23,
  },
});

const App = () => {
  
  const [location, setLocation] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [started, setStarted] = useState(false);
  const [intervalHandler, setIntervalHandler] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (started === true && !errorMsg) {
        const position = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.BestForNavigation});
        const {
          coords: {
            latitude,
            longitude,
          },
        } = position;
        
        if (latitude !== location[0] && longitude !== location[1]) {
          setLocation([latitude, longitude]);
        }
      } else {
        clearInterval(intervalHandler);
      } 
    }, 3000);
    setIntervalHandler(interval);
  }, [started])

  const StartButton = () => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        setStarted( !started );
      }}
      style={styles.startButton}
    > 
      <Text style={styles.startButtonText}>
       { !started ? 'START' : 'STOP' }
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>traffic</Text>
      <StartButton />
      <StatusBar style="auto" />
    </View>
  );
}

export default App;
