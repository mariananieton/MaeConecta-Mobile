import React, {useEffect, useState} from "react";
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Menu from "../menu/Menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const Home = ({navigation}) => {
    const [usuario, setUsuario] = useState(null);
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

    const fetchUsuario = async () => {
        try {
            const response = await fetch(`http://IP:8080/api/v1/usuario/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });
            const data = await response.json();
            setUsuario(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, [userId]);

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            fetchUsuario();
        });

        return unsubscribeFocus;
    }, [userId, navigation]);

    const navigateToAtualizarDados = (idUsuario) => {
        navigation.navigate('AtualizarDados', {
            idUsuario,
            fetchUsuario: fetchUsuario,
        });
    };

    useEffect(() => {
        const updateFetchUsuario = () => {
            navigation.setParams({
                fetchUsuario: fetchUsuario,
            });
        };

        navigation.addListener('focus', updateFetchUsuario);

        return () => {
            navigation.removeListener('focus', updateFetchUsuario);
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../home/img/sem-logo.png')} style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Image source={require('../home/img/gestante.png')} style={styles.image}/>
                        <Text style={styles.title}>Home</Text>
                    </View>
                    {usuario && (
                        <View>
                            <Text style={styles.textContent}>Olá, {usuario.nome}!</Text>
                            <Text style={styles.textContent}>Você está na {usuario.semanasGestacao}ª semana de
                                gravidez!</Text>
                            <Text style={styles.textContent}>Está conosco desde {usuario.dataCadastro}.</Text>
                            <Text style={styles.textContent}>Tipo Sanguíneo: {usuario.tipoSanguineo}</Text>
                        </View>
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => navigateToAtualizarDados(userId)}>
                            <Text style={styles.buttonText}>Atualizar Dados</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.title}>Deseja cadastrar algo?</Text>
                        <View style={styles.iconRow}>
                            <TouchableOpacity style={styles.iconContainer}
                                              onPress={() => navigation.navigate('CadastroProcedimentos')}>
                                <Image source={require('../home/img/PROCEDIMENTO.png')} style={styles.icon}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer}
                                              onPress={() => navigation.navigate('CadastroOcorrencias')}>
                                <Image source={require('../home/img/OCORRENCIAS.png')} style={styles.icon}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer}
                                              onPress={() => navigation.navigate('CadastroContatos')}>
                                <Image source={require('../home/img/CONTATO.png')} style={styles.icon}/>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        height: '120%',
    },
    contentContainer: {
        flex: 1,
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255)',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 170,
        marginTop: 30,
    },
    image: {
        width: 190,
        height: 190,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9D9494',
    },
    textContent: {
        fontSize: 16,
        color: '#797676',
        textAlign: 'center',
        marginRight: 5,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    iconContainer: {
        marginBottom: 20,
    },
    icon: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
    },
    button: {
        width: 200,
        height: 35,
        backgroundColor: '#82F0FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
    },
    buttonText: {
        color: '#000',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Home;