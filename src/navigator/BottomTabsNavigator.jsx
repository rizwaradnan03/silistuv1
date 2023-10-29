import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import HomeScreen from '../screen/HomeScreen';
import { FontAwesome } from '@expo/vector-icons';
import SettingScreen from '../screen/SettingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminScreen from '../screen/AdminScreen';

const BottomTabsNavigator = ({ navigation }) => {
    const Tab = createBottomTabNavigator();
    const [role, setRole] = useState('')

    const fetchData = async () => {
        const role = await AsyncStorage.getItem("Role")
        setRole(role)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Tab.Navigator initialRouteName='HomeScreen' screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "HomeScreen") {
                        iconName = focused ? "home" : "home";
                    } else if (route.name === "AdminScreen") {
                        iconName = focused ? "user" : "user";
                    } else if (route.name === "Setting") {
                        iconName = focused ? "cog" : "cog";
                    }
                    return <FontAwesome name={iconName} size={size} color={color} />;
                }
            })}>
                {role === "Admin" ? (
                    <Tab.Screen name="AdminScreen" options={{ headerShown: false }} component={AdminScreen} />
                ) : (
                    <Tab.Screen name="HomeScreen" options={{ headerShown: false }} component={HomeScreen}  />
                )}
                <Tab.Screen name="Setting" options={{ headerShown: false }} component={SettingScreen} />
            </Tab.Navigator>
        </>
    );
};

export default BottomTabsNavigator;
