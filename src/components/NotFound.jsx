import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

const NotFound = () => {
    return (
        <>
            <View style={styles.container}>
                <Image source={require('../../assets/not-found.png')} style={styles.image} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    image: {
        maxWidth: '70%',
        maxHeight: 250
    }
})

export default NotFound