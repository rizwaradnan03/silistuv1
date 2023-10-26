import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import HomeScreen from '../screen/HomeScreen';
import { FontAwesome } from '@expo/vector-icons';
import SettingScreen from '../screen/SettingScreen';

const BottomTabsNavigator = ({ navigation }) => {
    const Tab = createBottomTabNavigator();

    return (
        <>
            <Tab.Navigator initialRouteName='HomeScreen' screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "HomeScreen") {
                        iconName = focused ? "home" : "home";
                    } else if (route.name === "Setting") {
                        iconName = focused ? "cog" : "cog";
                    }
                    return <FontAwesome name={iconName} size={size} color={color} />;
                }
            })}>
                <Tab.Screen name="HomeScreen" options={{ headerShown: false }} component={HomeScreen} />
                <Tab.Screen name="Setting" options={{ headerShown: false }} component={SettingScreen} />
            </Tab.Navigator>
        </>
    );
};

export default BottomTabsNavigator;
