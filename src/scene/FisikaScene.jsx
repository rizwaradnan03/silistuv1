import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, IconButton, Modal, Button } from 'react-native-paper';
import { doneCompletingTask, findByIdTaskEntry } from '../Api/TaskEntryApi';
import NotFound from '../components/NotFound';

const FisikaScene = (props) => {
  const data = props.data

  //modal
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadLine, setDeadLine] = useState('')
  const [visible, setVisible] = useState(false)

  const handleDetail = async (id) => {
    setVisible(true)
    const token = await AsyncStorage.getItem("AccessToken")
    const response = await findByIdTaskEntry(token, id)

    setId(response.data.response.data.id)
    setName(response.data.response.data.task.name)
    setDescription(response.data.response.data.task.description)
    setDeadLine(response.data.response.data.task.deadLine)
  }

  const handleDone = async () => {
    const token = await AsyncStorage.getItem("AccessToken")
    await doneCompletingTask(token, id)
    setVisible(false)

    props.refetchData()
  }

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <NotFound />
      ) : (
        <>
          {data.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleDetail(item.id)}>
              <Card style={styles.card}>
                <IconButton
                  icon="book"
                  color="black"
                  size={20}
                />
                <Text style={styles.text}>{item.task.name}</Text>
                <Text style={styles.text}>{'Deadline: ' + item.task.deadLine}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </>
      )}
      <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
        {visible && (
          <View>
            <Text style={styles.text}>Nama Tugas : {name}</Text>
            <Text style={styles.text}>Deskripsi Tugas : {description}</Text>
            <Text style={styles.text}>Deadline Tugas : {deadLine}</Text>
            <Button contentStyle={{ backgroundColor: 'black' }} style={[styles.text, { marginTop: 20 }]} onPress={() => handleDone()}>Selesai</Button>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'grey',
    padding: 20
  },
  container: {
    paddingTop: 10,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    marginLeft: 10,
  },
});

export default FisikaScene;
