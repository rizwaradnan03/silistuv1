import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, DataTable, Modal, Text } from 'react-native-paper';
import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native';
import { findAllIsNotCompletedTaskEntry, findByIdTaskEntry, doneCompletingTask } from '../Api/TaskEntryApi';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [notCompletedTask, setNotCompletedTask] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);

  //detail matkul
  const [id, setId] = useState('')
  const [matkul, setMatkul] = useState('')
  const [task, setTask] = useState('')
  const [descriptionTask, setDescriptionTask] = useState('')

  const fetchUserName = async () => {
    const storedUsername = await AsyncStorage.getItem('Username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

  const fetchFindAllIsNotCompletedTaskEntry = async (token) => {
    const response = await findAllIsNotCompletedTaskEntry(token);
    setNotCompletedTask(response.data.response.data);
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('AccessToken');
      fetchUserName();
      fetchFindAllIsNotCompletedTaskEntry(token);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleAksi = async (id) => {
    const token = await AsyncStorage.getItem('AccessToken');
    const response = await findByIdTaskEntry(token, id)
    setId(response.data.response.data.id)
    setMatkul(response.data.response.data.subject.name)
    setTask(response.data.response.data.task.name)
    setDescriptionTask(response.data.response.data.task.description)
    console.log('ada data nichhh ', response.data.response.data)

    setModalVisible(true)
  }

  const handleDoneTask = async () => {
    const token = await AsyncStorage.getItem('AccessToken');
    setModalVisible(false)
    await doneCompletingTask(token, id)

    setTimeout(() => {
      fetchData()
    }, 1500)
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Card.Title
        title={`Halo, ${username}`}
        left={(props) => <Avatar.Icon {...props} icon="account" />}
        style={styles.cardUser}
        titleStyle={styles.cardUser}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollContainerBackground}>
        <Card style={styles.cardList}>
          <Card.Content>
            <Text style={styles.cardListTitle}>List Tugas Yang Belum</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title><Text style={styles.dataTableTitle}>Matkul</Text></DataTable.Title>
                <DataTable.Title><Text style={styles.dataTableTitle}>Deadline</Text></DataTable.Title>
                <DataTable.Title><Text style={styles.dataTableTitle}>Aksi</Text></DataTable.Title>
              </DataTable.Header>
              {notCompletedTask &&
                notCompletedTask.map((item, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{item.subject && item.subject.name}</DataTable.Cell>
                    <DataTable.Cell>{item.task && item.task.deadLine}</DataTable.Cell>
                    <DataTable.Cell><Button mode="contained" onPress={() => handleAksi(item.id)}>Aksi</Button></DataTable.Cell>
                  </DataTable.Row>
                ))}
            </DataTable>
          </Card.Content>
        </Card>
      </ScrollView>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTextHeader}>Detail Tugas</Text>
            <Text style={styles.modalText}>Mata Kuliah: {matkul}</Text>
            <Text style={styles.modalText}>Task: {task}</Text>
            <Text style={styles.modalText}>Deskripsi: {descriptionTask}</Text>
            <View style={styles.buttonContainer}>
              <Button style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Tutup</Text>
              </Button>
              <Button style={styles.modalButton} onPress={() => handleDoneTask()}>
                <Text style={styles.buttonText}>Selesai</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginTop: 20,
  },
  cardUser: {
    top: 0,
    right: 0,
    color: 'black'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardList: {
    flex: 1,
  },
  cardListTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  dataTableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextHeader: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
