import React, {useEffect, useState} from "react";
import {FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Menu from "../menu/Menu";
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Procedimentos = ({navigation}) => {
    const [procedimentos, setProcedimentos] = useState([]);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken || '');
            decodeToken();
        };

        fetchToken();
    }, []);

    const decodeToken = () => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log(decodedToken);
                const userId = decodedToken.id;
                setUserId(userId);
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
            }
        }
    };

    useEffect(() => {
        decodeToken();
    }, [token]);

    const fetchProcedimentos = async () => {
        try {
            const response = await fetch(`http://IP:8080/api/v1/procedimento/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });
            const data = await response.json();
            setProcedimentos(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProcedimentos();
    }, [userId]);

    const navigateToAtualizarProcedimentos = (idProcedimento) => {
        navigation.navigate('AtualizarProcedimentos', {
            idProcedimento,
            fetchProcedimentos: fetchProcedimentos,
        });
    };

    useEffect(() => {
        const updateFetchProcedimentos = () => {
            navigation.setParams({
                fetchProcedimentos: fetchProcedimentos,
            });
        };

        navigation.addListener('focus', updateFetchProcedimentos);

        return () => {
            navigation.removeListener('focus', updateFetchProcedimentos);
        };
    }, [navigation]);

    console.log(procedimentos)

    const renderItem = ({item}) => (
        <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigateToAtualizarProcedimentos(item.id)}>
            <View style={styles.itemContainer}>
                <Image source={require('../procedimentos/img/procedimentos.png')} style={styles.imageItem}/>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.nomeProcedimento}>{item.especialidade}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.texto}>Data do Procedimento:</Text>
                        <Text style={styles.texto}>{item.dataProcedimento}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.texto}>Tipo de Procedimento:</Text>
                        <Text style={styles.texto}>{item.tipoProcedimento}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../procedimentos/img/sem-logo.png')} style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Meus Procedimentos</Text>
                    </View>
                    <FlatList
                        data={procedimentos}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.listContainer}
                        contentContainerStyle={styles.listContentContainer}
                    />
                </View>
                <Menu navigation={navigation}/>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: 430,
        height: 895,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255)',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingBottom: 10,
        marginBottom: 10,
        width: 430,
    },
    imageItem: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    infoContainer: {
        marginLeft: 10,
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nomeProcedimento: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D644D0',
        marginBottom: 5,
    },
    texto: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#9D9494',
        textAlign: 'center',
        marginRight: 10,
    },
    listContainer: {
        marginTop: 30,
    },
    listContentContainer: {
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    touchableOpacity: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#9D9494',
    },
});


export default Procedimentos;
