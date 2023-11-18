import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput, Alert} from "react-native";
import Menu from "../menu/Menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const AtualizarContatos = ({ route, navigation }) => {
    const {  idContato, fetchContatos } = route.params;

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [relacionamento, setRelacionamento] = useState("");

    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken || '');
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

    const handleAtualizar = () => {
        if (!nome || !relacionamento || !telefone) {
            console.log("Por favor, preencha todos os campos.");
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
        } else if (nome.length < 3 || nome.length > 50) {
            console.log("Erro: O nome precisa ter entre 3 e 50 caracteres.");
            Alert.alert("Erro", "O nome precisa ter entre 3 e 50 caracteres.");
        } else if (!validarTelefone(telefone)) {
            console.log("Erro: Telefone inválido. Precisa ter 9 dígitos.");
            Alert.alert("Erro", "Telefone inválido. Precisa ter 9 dígitos.");
        } else if (relacionamento.length < 3 || relacionamento.length > 100) {
            console.log("Erro: Relacionamento precisa ter entre 3 e 100 caracteres.");
            Alert.alert("Erro", "Relacionamento precisa ter entre 3 e 100 caracteres.");
        } else {

            const contato = {
                nome,
                telefone,
                relacionamento,
            };

            console.log('Corpo da requisição:', JSON.stringify( contato ));

            fetch(`http://IP:8080/api/v1/contato/${idContato}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(contato),
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    fetchContatos();
                    navigation.navigate("Contatos");
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const validarTelefone = (telefone) => {
        return /^\d{9}$/.test(telefone);
    };

    const handleExcluir = async () => {
        try {
            await fetch(`http://IP:8080/api/v1/contato/${idContato}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });
            fetchContatos();
            navigation.navigate("Contatos");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../atualizarContatos/img/TELA_LOGO.png')} style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Atualizar Contato de Emergência</Text>
                    </View>
                    <View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Nome completo</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite o nome do contato"
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Telefone</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite o telefone do contato"
                                value={telefone}
                                onChangeText={setTelefone}
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Relacionamento</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Exemplo: noivo, pai, mãe, etc."
                                value={relacionamento}
                                onChangeText={setRelacionamento}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleAtualizar}>
                                <Text style={styles.buttonText}>Atualizar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleExcluir}>
                                <Text style={styles.buttonText}>Excluir</Text>
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
        height: '130%',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255)',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#9D9494',
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
    },
    input: {
        width: '70%',
        height: 40,
        borderWidth: 1,
        borderColor: '#989698',
        borderRadius: 30,
        marginTop: 5,
        paddingHorizontal: 10,
        textAlign: 'left',
    },
    button: {
        width: 170,
        height: 35,
        backgroundColor: '#82F0FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginBottom: 20,
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
        fontWeight: "bold",
    },
    titleContainer: {
        marginBottom: 20,
    },
    textInput: {
        color: '#6C6B6B',
    },
    label: {
        marginLeft: 60,
    },
});

export default AtualizarContatos;
