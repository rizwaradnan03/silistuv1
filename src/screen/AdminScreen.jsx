import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Button, Modal, Text } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { findAllKelas } from '../Api/KelasApi';
import { findAllTeacher } from '../Api/TeacherApi';
import { findAllSubject } from '../Api/SubjectApi';
import { createTask } from '../Api/TaskApi';

const AdminScreen = () => {
    const [dataKelas, setDataKelas] = useState([]);
    const [dataTeacher, setDataTeacher] = useState([]);
    const [dataSubject, setDataSubject] = useState([]);

    const [kelas, setKelas] = useState('');
    const [teacher, setTeacher] = useState('');
    const [subject, setSubject] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDropDownKelas, setShowDropDownkelas] = useState(false);
    const [showDropDownTeacher, setShowDropDownTeacher] = useState(false);
    const [showDropDownSubject, setShowDropDownSubject] = useState(false);

    const [showModalSuccess, setShowModalSuccess] = useState(false)
    const [showModalFailed, setShowModalFailed] = useState(false)

    const handleSubmit = async (values) => {
        const token = await AsyncStorage.getItem("AccessToken")
        const name = values.name
        const description = values.description

        const dataToJson = {
            name: name,
            description: description,
            kelasId: kelas,
            teacherId: teacher,
            subjectId: subject,
            deadLine: selectedDateTime
        }

        const response = await createTask(token, dataToJson)
        if(response.status === 201){
            setShowModalSuccess(true)
        }else{
            setShowModalFailed(true)
        }

    };

    const fetchKelas = async (token) => {
        const response = await findAllKelas(token);
        setDataKelas(response.data.response.data);
    };

    const fetchTeacher = async (token) => {
        const response = await findAllTeacher(token);
        setDataTeacher(response.data.response.data);
    };

    const fetchSubject = async (token) => {
        const response = await findAllSubject(token);
        setDataSubject(response.data.response.data);
    };

    const fetchData = async () => {
        const token = await AsyncStorage.getItem('AccessToken');
        await fetchKelas(token);
        await fetchTeacher(token);
        await fetchSubject(token);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Tambah Tugas" style={styles.cardTitle} />
                <Card.Content>
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                        }}
                        onSubmit={(values) => handleSubmit(values)}
                        validate={(values) => {
                            const errors = {};
                            if (!values.name) {
                                errors.name = 'Nama Tugas is required';
                            }
                            if (!values.description) {
                                errors.description = 'Deskripsi Tugas is required';
                            }
                            return errors;
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                    placeholder="Nama Tugas"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    value={values.description}
                                    placeholder="Deskripsi Tugas"
                                />

                                <DropDown
                                    dropDownStyle={{ marginBottom: 20 }}
                                    label="Kelas"
                                    visible={showDropDownKelas}
                                    showDropDown={() => setShowDropDownkelas(true)}
                                    value={kelas}
                                    setValue={(value) => setKelas(value)}
                                    onDismiss={() => setShowDropDownkelas(false)}
                                    list={dataKelas.map((item, index) => ({
                                        label: item.name,
                                        value: item.id,
                                    }))}
                                />

                                <DropDown
                                    dropDownStyle={{ marginBottom: 20 }}
                                    label="Guru"
                                    visible={showDropDownTeacher}
                                    showDropDown={() => setShowDropDownTeacher(true)}
                                    value={teacher}
                                    setValue={(value) => setTeacher(value)}
                                    onDismiss={() => setShowDropDownTeacher(false)}
                                    list={dataTeacher.map((item, index) => ({
                                        label: item.name,
                                        value: item.id,
                                    }))}
                                />

                                <DropDown
                                    dropDownStyle={{ marginBottom: 20 }}
                                    label="Matkul"
                                    visible={showDropDownSubject}
                                    showDropDown={() => setShowDropDownSubject(true)}
                                    value={subject}
                                    setValue={(value) => setSubject(value)}
                                    onDismiss={() => setShowDropDownSubject(false)}
                                    list={dataSubject.map((item, index) => ({
                                        label: item.name,
                                        value: item.id,
                                    }))}
                                />

                                <Button onPress={() => setShowDatePicker(true)}>
                                    Pilih Deadline
                                </Button>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={selectedDateTime}
                                        mode="datetime"
                                        is24Hour={true}
                                        display="compact"
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) {
                                                setSelectedDateTime(date);
                                            }
                                        }}
                                    />
                                )}
                                <Button
                                    style={styles.button}
                                    onPress={handleSubmit}
                                    mode="contained"
                                >
                                    Submit
                                </Button>
                            </View>
                        )}
                    </Formik>
                </Card.Content>
            </Card>
            <Modal visible={showModalSuccess}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Membuat Tugas Baru Berhasil!</Text>
                    <Button style={styles.modalText} onPress={() => setShowModalSuccess(false)}>
                        <Text style={styles.modalText}>Ya</Text>
                    </Button>
                </View>
            </Modal>
            <Modal visible={showModalFailed}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Gagal Membuat Tugas Baru!</Text>
                    <Button style={styles.modalText} onPress={() => setShowModalFailed(false)}>
                        <Text style={styles.modalText}>Ya</Text>
                    </Button>
                </View>
            </Modal>
        </View>
    );
};

// Update your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    card: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#ffffff',
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    button: {
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: 'purple',
    },
    buttonText: {
        color: '#ffffff',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    dropdown: {
        marginBottom: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        color: 'black'
    },
});

export default AdminScreen;
