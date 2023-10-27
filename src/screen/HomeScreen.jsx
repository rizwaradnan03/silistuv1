import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Avatar, Card, Text, useTheme } from 'react-native-paper';
import { StyleSheet, SafeAreaView, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import MatematikaScene from '../scene/MatematikaScene';
import LogikaInformatikaScene from '../scene/LogikaInformatikaScene';
import PengantarIlmuKomputerScene from '../scene/PengantarIlmuKomputerScene';
import BahasaInggrisScene from '../scene/BahasaInggrisScene';
import PendidikanKewargaNegaraanScene from '../scene/PendidikanKewargaNegaraanScene';
import FisikaScene from '../scene/FisikaScene';
import { findByIdIsNotCompletedMatematika } from '../Api/TaskEntryApi';

const HomeScreen = () => {
  const [isNotCompletedMatematika, setIsNotCompletedMatematika] = useState([])

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'matematika', title: 'MTK' },
    { key: 'logikainformatika', title: 'Logika' },
    { key: 'pengantarilmukomputer', title: 'PIK' },
    { key: 'bahasainggris', title: 'inggris' },
    { key: 'algoritmadanpemrograman', title: 'Algo' },
    { key: 'pendidikankewarganegaraan', title: 'PKN' },
    { key: 'fisika', title: 'fisika' },
  ]);

  const refetchData = async () => {
    fetchData()
  }

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'matematika':
        return <MatematikaScene data={isNotCompletedMatematika} refetchData={refetchData} />;
      case 'logikainformatika':
        return <LogikaInformatikaScene />;
      case 'pengantarilmukomputer':
        return <PengantarIlmuKomputerScene />;
      case 'bahasainggris':
        return <BahasaInggrisScene />
      case 'pendidikankewarganegaraan':
        return <PendidikanKewargaNegaraanScene />
      case 'fisika':
        return <FisikaScene />
      default:
        return null;
    }
  }

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: 'white' }}
      activeColor="black"
      inactiveColor="gray"
    />
  );

    const fetchMatematika = async (token, id) => {
      const response = await findByIdIsNotCompletedMatematika(token,id)
      console.log('hayzzzzzzzzzzzz', response.data.response.data)
      setIsNotCompletedMatematika(response.data.response.data)
    }

    const fetchData = async () => {
      const token = await AsyncStorage.getItem("AccessToken")
      const id = await AsyncStorage.getItem("Id")
      await fetchMatematika(token, id)
    }

    useEffect(() => {
      fetchData()
    }, [])

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20, // Tetapkan margin hanya di bagian atas
  },
  cardUser: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  cardUserTitle: {
    color: 'black',
  },
  sceneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
