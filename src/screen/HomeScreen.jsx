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
import { findByIdIsNotCompletedAlgoritmaDanPemrograman, findByIdIsNotCompletedBahasaInggris, findByIdIsNotCompletedFisika, findByIdIsNotCompletedLogikaInformatika, findByIdIsNotCompletedMatematika, findByIdIsNotCompletedPendidikanKewargaNegaraan, findByIdIsNotCompletedPengantarIlmuKomputer } from '../Api/TaskEntryApi';
import AlgoritmaDanPemrograman from '../scene/AlgoritmaDanPemrogramanScene';

const HomeScreen = () => {
  const [isNotCompletedMatematika, setIsNotCompletedMatematika] = useState([])
  const [isNotCompletedLogikaInformatika, setIsNotCompletedLogikaInformatika] = useState([])
  const [isNotCompletedAlgoritmaDanPemrograman, setIsNotCompletedAlgoritmaDanPemrograman] = useState([])
  const [isNotCompletedBahasaInggris, setIsNotCompletedBahasaInggris] = useState([])
  const [isNotCompletedPengantarIlmuKomputer, setIsNotCompletedPengantarIlmuKomputer] = useState([])
  const [isNotCompletedPendidikanKewargaNegaraan, setIsNotCompletedPendidikanKewargaNegaraan] = useState([])
  const [isNotCompletedFisika, setIsNotCompletedFisika] = useState([])

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
        return <LogikaInformatikaScene data={isNotCompletedLogikaInformatika} refetchData={refetchData} />;
      case 'pengantarilmukomputer':
        return <PengantarIlmuKomputerScene data={isNotCompletedPengantarIlmuKomputer} refetchData={refetchData} />;
      case 'algoritmadanpemrograman':
        return <AlgoritmaDanPemrograman data={isNotCompletedAlgoritmaDanPemrograman} refetchData={refetchData} />;
      case 'bahasainggris':
        return <BahasaInggrisScene data={isNotCompletedBahasaInggris} refetchData={refetchData} />
      case 'pendidikankewarganegaraan':
        return <PendidikanKewargaNegaraanScene data={isNotCompletedPendidikanKewargaNegaraan} refetchData={refetchData} />
      case 'fisika':
        return <FisikaScene data={isNotCompletedFisika} refetchData={refetchData} />
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
      setIsNotCompletedMatematika(response.data.response.data)
    }

    const fetchLogikaInformatika = async (token,id) => {
      const response = await findByIdIsNotCompletedLogikaInformatika(token,id)
      setIsNotCompletedLogikaInformatika(response.data.response.data)
    }

    const fetchAlgoritmaDanPemrograman = async (token,id) => {
      const response = await findByIdIsNotCompletedAlgoritmaDanPemrograman(token,id)
      setIsNotCompletedAlgoritmaDanPemrograman(response.data.response.data)
    }

    const fetchBahasaInggris = async (token,id) => {
      const response = await findByIdIsNotCompletedBahasaInggris(token,id)
      setIsNotCompletedBahasaInggris(response.data.response.data)
    }

    const fetchPengantarIlmuKomputer = async (token,id) => {
      const response = await findByIdIsNotCompletedPengantarIlmuKomputer(token,id)
      setIsNotCompletedPengantarIlmuKomputer(response.data.response.data)
    }

    const fetchPendidikanKewargaNegaraan = async (token,id) => {
      const response = await findByIdIsNotCompletedPendidikanKewargaNegaraan(token,id)
      setIsNotCompletedPendidikanKewargaNegaraan(response.data.response.data)
    }

    const fetchFisika = async (token,id) => {
      const response = await findByIdIsNotCompletedFisika(token,id)
      setIsNotCompletedFisika(response.data.response.data)
    }

    const fetchData = async () => {
      const token = await AsyncStorage.getItem("AccessToken")
      const id = await AsyncStorage.getItem("Id")
      await fetchMatematika(token, id)
      await fetchLogikaInformatika(token,id)
      await fetchAlgoritmaDanPemrograman(token,id)
      await fetchBahasaInggris(token,id)
      await fetchPengantarIlmuKomputer(token,id)
      await fetchPendidikanKewargaNegaraan(token,id)
      await fetchFisika(token,id)
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
