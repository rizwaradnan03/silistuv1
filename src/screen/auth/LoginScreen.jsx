import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { loginUser } from '../../Api/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const LoginScreen = ({ navigation }) => {
    const loginValidationSchema = yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handleCheckToken = async () => {
        const currentTime = new Date().getTime();
        const token = await AsyncStorage.getItem("AccessToken");

        console.log(token);

        if (!token) {
            navigation.navigate("Login");
        } else {
            const tokenPayload = jwt.decode(token);
            const tokenExpirationTime = tokenPayload.exp * 1000;

            if (currentTime > tokenExpirationTime) {
                console.log('Token kedaluwarsa');
                navigation.navigate("Login");
            } else {
                console.log('Token valid');
                navigation.navigate("Home");
            }
        }
    };


    const handleSubmit = async (values) => {
        try {
            const response = await loginUser(values)
            console.log(response.data.token)
            if (response.status === 201) {
                const decodedToken = jwtDecode(response.data.token);

                await AsyncStorage.setItem("ExpirationTime", JSON.stringify(decodedToken.exp))
                await AsyncStorage.setItem("AccessToken", response.data.token)
                await AsyncStorage.setItem("Username", decodedToken.name)
                navigation.navigate('Home');
            } else {
                Alert.alert('Login Failed', 'Invalid username or password. Please try again.');
            }
        } catch (error) {
            console.log('Error While Login ', error);
        }
    };

    useEffect(() => {
        handleCheckToken()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('../../../assets/logounpak.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={loginValidationSchema}
                    onSubmit={(values) => handleSubmit(values)} // Perubahan disini
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                            />
                            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            <Button onPress={handleSubmit} style={styles.buttonSubmit} title="Submit" />
                        </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    formContainer: {
        flex: 1,
        width: '80%',
        justifyContent: 'flex-start',
    },
    form: {
        width: '100%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    buttonSubmit: {
        backgroundColor: 'blue'
    }
});

export default LoginScreen;
