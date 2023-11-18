import React, {useEffect, useState} from "react";
import {Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Menu from "../menu/Menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import jwtDecode from 'jwt-decode';

const CadastroProcedimentos = ({navigation}) => {
    const [tipoProcedimento, setTipoProcedimento] = useState("");
    const [dataProcedimento, setDataProcedimento] = useState("");
    const [especialidade, setEspecialidade] = useState("");

    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    const [selectedType, setSelectedType] = useState("");
    const [especialidades, setEspecialidades] = useState([]);

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
        const especialidadesDisponiveis = [
            "Obstetrícia",
            "Ginecologia",
            "Pediatria",
            "Neonatologia",
            "Enfermagem Obstétrica",
            "Ultrassonografia",
            "Amnioscopia",
            "Cardiotocografia",
            "Ultrassom Morfológico",
            "Exames de Sangue",
            "Genética",
            "Tocografia",
            "Dosagem de Hormônios",
            "Diabetologia Gestacional",
            "Fisioterapia Obstétrica",
            "Psicologia Perinatal",
        ];
        setEspecialidades(especialidadesDisponiveis);
    }, [token]);

    const handleSalvar = () => {
        if (!tipoProcedimento || !especialidade || !dataProcedimento) {
            console.log("Por favor, preencha todos os campos.");
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
        } else if (!validarDataProcedimento(dataProcedimento)) {
            console.log("Erro: Data inválida. Utilize o formato yyyy-MM-dd.");
            Alert.alert(
                "Erro",
                "Data inválida. Utilize o formato yyyy-MM-dd."
            );
        } else {
            const procedimento = {
                tipoProcedimento,
                dataProcedimento,
                especialidade,
            };

            console.log("Corpo da requisição:", JSON.stringify(procedimento));

            fetch(`http://IP:8080/api/v1/procedimento/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(procedimento),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    navigation.navigate("Procedimentos");
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const validarDataProcedimento = (data) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(data);
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../cadastroProcedimentos/img/TELA_LOGO.png')}
                             style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Cadastro de Procedimentos</Text>
                    </View>
                    <View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Tipo de Procedimento</Text>
                        </View>
                        <Picker
                            selectedValue={selectedType}
                            onValueChange={(itemValue) => {
                                setSelectedType(itemValue);
                                setTipoProcedimento(itemValue);
                            }}
                        >
                            <Picker.Item label="Selecione o tipo" value=""/>
                            <Picker.Item label="Consulta" value="Consulta"/>
                            <Picker.Item label="Exame" value="Exame"/>
                        </Picker>
                    </View>
                    <View style={styles.label}>
                        <Text style={styles.textInput}>Especialidade</Text>
                    </View>
                    <View>
                        <Picker
                            selectedValue={especialidade}
                            onValueChange={(itemValue) => setEspecialidade(itemValue)}
                        >
                            <Picker.Item label="Selecione a especialidade" value=""/>
                            {especialidades.map((especialidade, index) => (
                                <Picker.Item key={index} label={especialidade} value={especialidade}/>
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.label}>
                        <Text style={styles.textInput}>Data do Procedimento</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a data do procedimento"
                            value={dataProcedimento}
                            onChangeText={setDataProcedimento}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
                            <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
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

export default CadastroProcedimentos;
