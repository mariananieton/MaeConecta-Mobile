import React, {useEffect, useState} from "react";
import {FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Menu from "../menu/Menu";
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Ocorrencias = ({navigation}) => {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [procedimentos, setProcedimentos] = useState({});

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

    const fetchOcorrencias = async () => {
        try {
            const response = await fetch(`http://IP:8080/api/v1/ocorrencia/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });
            const data = await response.json();
            setOcorrencias(data);

            const procedimentoIds = data.map(ocorrencia => ocorrencia.procedimentoId).filter(Boolean);
            const procedimentosResponse = await Promise.all(
                procedimentoIds.map(async (procedimentoId) => {
                    const procedimentoResponse = await fetch(`http://IP:8080/api/v1/procedimento/${procedimentoId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`,
                        },
                    });
                    return await procedimentoResponse.json();
                })
            );

            const procedimentosMap = {};
            procedimentosResponse.forEach(procedimento => {
                procedimentosMap[procedimento.id] = procedimento;
            });

            setProcedimentos(procedimentosMap);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOcorrencias();
    }, [userId]);

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            fetchOcorrencias();
        });

        return unsubscribeFocus;
    }, [userId, navigation]);

    const navigateToAtualizarOcorrencias = (idOcorrencia) => {
        navigation.navigate('AtualizarOcorrencias', {
            idOcorrencia,
            fetchOcorrencias: fetchOcorrencias,
        });
    };

    useEffect(() => {
        const updateFetchOcorrencias = () => {
            navigation.setParams({
                fetchOcorrencias: fetchOcorrencias,
            });
        };

        navigation.addListener('focus', updateFetchOcorrencias);

        return () => {
            navigation.removeListener('focus', updateFetchOcorrencias);
        };
    }, [navigation]);

    console.log(ocorrencias)

    const renderItem = ({item}) => (
        <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigateToAtualizarOcorrencias(item.id)}>
            <View style={styles.itemContainer}>
                <Image source={require('../ocorrencias/img/ocorrencias.png')} style={styles.imageItem}/>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.nomeProcedimento}>{item.titulo}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.texto}>Data da Ocorrência Gestacional:</Text>
                        <Text style={styles.texto}>{item.dataOcorrencia}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.texto}>Descrição:</Text>
                        <Text style={styles.texto}>{item.descricao}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.texto}>Procedimento relacionado:</Text>
                        <Text
                            style={styles.texto}>{item.procedimentoId && procedimentos[item.procedimentoId] ? procedimentos[item.procedimentoId].especialidade : 'N/A'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../ocorrencias/img/sem-logo.png')} style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Minhas Ocorrências Gestacionais</Text>
                    </View>
                    <FlatList
                        data={ocorrencias}
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


export default Ocorrencias;
