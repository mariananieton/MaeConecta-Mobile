import React, {useEffect, useState} from "react";
import {Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Menu from "../menu/Menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import {Picker} from '@react-native-picker/picker';

const CadastroOcorrencias = ({navigation}) => {
    const [titulo, setTitulo] = useState("");
    const [dataOcorrencia, setDataOcorrencia] = useState("");
    const [descricao, setDescricao] = useState("");
    const [procedimentos, setProcedimentos] = useState([]);
    const [procedimentoId, setProcedimentoId] = useState(null);
    const [procedimentosCarregados, setProcedimentosCarregados] = useState(false);

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
            setProcedimentos(data || []);
            setProcedimentosCarregados(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log("Procedimentos:", procedimentos);
        fetchProcedimentos();
    }, [userId, token]);


    const handleSalvar = () => {
        if (!titulo || !descricao || !dataOcorrencia) {
            console.log("Por favor, preencha todos os campos.");
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
        } else if (titulo.length < 3 || titulo.length > 50) {
            console.log("Erro: O titulo precisa ter entre 3 e 50 caracteres.");
            Alert.alert("Erro", "O titulo precisa ter entre 3 e 50 caracteres.");
        } else if (!validarDataOcorrencia(dataOcorrencia)) {
            console.log("Erro: Data inválida. Utilize o formato yyyy-MM-dd.");
            Alert.alert("Erro", "Data inválida. Utilize o formato yyyy-MM-dd.");
        } else if (descricao.length < 3 || descricao.length > 200) {
            console.log("Erro: Descricao precisa ter entre 3 e 100 caracteres.");
            Alert.alert("Erro", "Descricao precisa ter entre 3 e 100 caracteres.");
        } else {

            const ocorrencia = {
                titulo,
                dataOcorrencia,
                descricao,
                ...(procedimentoId !== null && {procedimentoId}),
            };

            console.log('Corpo da requisição:', JSON.stringify(ocorrencia));

            fetch(`http://IP:8080/api/v1/ocorrencia/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(ocorrencia),
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    navigation.navigate("Home");
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const validarDataOcorrencia = (data) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(data);
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../cadastroOcorrencias/img/TELA_LOGO.png')}
                             style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Cadastro de Ocorrência Gestacional</Text>
                    </View>
                    <View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Título da Ocorrência</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite o título da ocorrência"
                                value={titulo}
                                onChangeText={setTitulo}
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Data da Ocorrência</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite a data da ocorrência"
                                value={dataOcorrencia}
                                onChangeText={setDataOcorrencia}
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Descrição</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Descreva o acontecimento"
                                value={descricao}
                                onChangeText={setDescricao}
                            />
                        </View>
                        <View>
                            {procedimentosCarregados && (
                                <Picker
                                    selectedValue={procedimentoId}
                                    onValueChange={(itemValue) => setProcedimentoId(itemValue)}
                                >
                                    <Picker.Item label="Selecione um procedimento (opcional)" value={null}/>
                                    {(procedimentos && Array.isArray(procedimentos)) ? (
                                        procedimentos.map((procedimento) => (
                                            <Picker.Item key={procedimento.id} label={procedimento.especialidade}
                                                         value={procedimento.id}/>
                                        ))
                                    ) : null}
                                </Picker>
                            )}
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
                                <Text style={styles.buttonText}>Salvar</Text>
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

export default CadastroOcorrencias;
