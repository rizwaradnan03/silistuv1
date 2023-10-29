import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Card, Text } from 'react-native-paper'
import Modal from 'react-native-modal';

const SettingScreen = ({ navigation} ) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleConfirmLogOut = async () => {
        try {
            setModalVisible(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogOut = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys()
            await AsyncStorage.multiRemove(keys)
            navigation.navigate("Login")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <View>
                <Card style={styles.container}>
                    <Card.Content>
                        <Button style={styles.buttonLogOut} onPress={() => handleConfirmLogOut()}>
                            <Text style={styles.buttonTextLogout}>Logout</Text>
                        </Button>
                    </Card.Content>
                </Card>
            </View>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Anda Yakin Untuk Logout?</Text>
                    <Button style={styles.modalText} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalText}>Tidak</Text>
                    </Button>
                    <Button style={styles.modalText} onPress={() => handleLogOut()}>
                        <Text style={styles.modalText}>Ya</Text>
                    </Button>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 40,
        color: 'white'
    },
    buttonLogOut: {
        width: "30%"
    },
    buttonTextLogout: {
        textAlign: 'left',
        color: 'black'
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
})

export default SettingScreen