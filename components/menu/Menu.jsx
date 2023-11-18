import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const Menu = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.texto}>HOME</Text>
                <Image source={require('../menu/img/home.png')} style={styles.image}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigation.navigate('Procedimentos')}>
                <Text style={styles.texto}>PROCEDIMENTOS</Text>
                <Image source={require('../menu/img/procedimentos.png')} style={styles.image}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigation.navigate('Ocorrencias')}>
                <Text style={styles.texto}>OCORRÊNCIAS</Text>
                <Image source={require('../menu/img/ocorrencias.png')} style={styles.image}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigation.navigate('Assistente')}>
                <Text style={styles.texto}>ASSISTENTE</Text>
                <Image source={require('../menu/img/assistente.png')} style={styles.image}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigation.navigate('Contatos')}>
                <Text style={styles.texto}>CONTATOS</Text>
                <Image source={require('../menu/img/contatos.png')} style={styles.image}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#A6CCEF',
        width: 430,
        height: 104,
    },
    texto: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 10,
        marginRight: 15,
    },
    touchableOpacity: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 48,
        height: 48,
        marginRight: 15,
    },
});

export default Menu;
