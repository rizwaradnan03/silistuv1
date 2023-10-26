import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Card, Text } from 'react-native-paper'
import Modal from 'react-native-modal';

const SettingScreen = ({ navigation }) => {
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
            await AsyncStorage.removeItem("AccessToken")
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
                    <Text>Anda Yakin Untuk Logout?</Text>
                    <Button onPress={() => setModalVisible(false)}>
                        <Text>Tidak</Text>
                    </Button>
                    <Button onPress={() => handleLogOut()}>
                        <Text>Ya</Text>
                    </Button>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 40
    },
    buttonLogOut: {
        width: "30%"
    },
    buttonTextLogout: {
        textAlign: 'left'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
})

export default SettingScreen