import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, FlatList, TouchableOpacity } from "react-native";
import Menu from "../menu/Menu";
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Contatos = ({ navigation }) => {
    const [contatos, setContatos] = useState([]);
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

    const fetchContatos = async () => {
        try {
            const response = await fetch(`http://IP:8080/api/v1/contato/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });
            const data = await response.json();
            setContatos(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchContatos();
    }, [userId]);

    const navigateToAtualizarContatos = (idContato) => {
        navigation.navigate('AtualizarContatos', {
            idContato,
            fetchContatos: fetchContatos,
        });
    };

    useEffect(() => {
        const updateFetchContatos = () => {
            navigation.setParams({
                fetchContatos: fetchContatos,
            });
        };

        navigation.addListener('focus', updateFetchContatos);

        return () => {
            navigation.removeListener('focus', updateFetchContatos);
        };
    }, [navigation]);

    console.log(contatos)

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigateToAtualizarContatos(item.id)}>
            <View style={styles.itemContainer}>
                <Image source={require('../contatos/img/contatos.png')} style={styles.imageItem} />
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.nomeProcedimento}>{item.nome}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.texto}>Telefone:</Text>
                        <Text style={styles.texto}>{item.telefone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.texto}>Relacionamento:</Text>
                        <Text style={styles.texto}>{item.relacionamento}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../contatos/img/sem-logo.png')} style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Meus Contatos de Emergência</Text>
                    </View>
                    <FlatList
                        data={contatos}
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


export default Contatos;
