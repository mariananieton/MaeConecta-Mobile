import React, {useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput, Alert} from "react-native";

const Cadastro = ({navigation}) => {
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [tipoSanguineo, setTipoSanguineo] = useState("");
    const [semanasGestacao, setSemanasGestacao] = useState(0);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [repetirSenha, setRepetirSenha] = useState("")

    const handleSalvar = () => {
        if (!nome || !tipoSanguineo || !dataNascimento || !semanasGestacao || !email || !senha || !repetirSenha) {
            console.log("Por favor, preencha todos os campos.");
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
        } else if (nome.length < 3 || nome.length > 50) {
            console.log("Erro: O nome precisa ter entre 3 e 50 caracteres.");
            Alert.alert("Erro", "O nome precisa ter entre 3 e 50 caracteres.");
        } else if (!validarEmail(email)) {
            console.log("Erro: Digite um e-mail válido.");
            Alert.alert("Erro", "Digite um e-mail válido.");
        } else if (!validarDataNascimento(dataNascimento)) {
            console.log("Erro: Data de nascimento inválida. Utilize o formato yyyy-MM-dd.");
            Alert.alert("Erro", "Data de nascimento inválida. Utilize o formato yyyy-MM-dd.");
        } else if (!validarTipoSanguineo(tipoSanguineo)) {
            console.log("Erro: Tipo sanguíneo inválido. Utilize o formato 'O+', 'AB-'.");
            Alert.alert("Erro", "Tipo sanguíneo inválido. Utilize o formato 'O+', 'AB-'.");
        } else if (!validarSemanasGestacao(semanasGestacao)) {
            console.log("Erro: Semanas de gestação inválidas. Deve estar entre 0 e 45.");
            Alert.alert("Erro", "Semanas de gestação inválidas. Deve estar entre 0 e 45.");
        } else if (senha.length < 8 || senha.length > 16) {
            console.log("Erro: A senha precisa ter entre 8 e 16 caracteres.");
            Alert.alert("Erro", "A senha precisa ter entre 8 e 16 caracteres.");
        } else if (senha !== repetirSenha) {
            console.log("Erro: As senhas digitadas não coincidem.");
            Alert.alert("Erro", "As senhas digitadas não coincidem.");
        } else {

            const usuario = {
                nome,
                dataNascimento,
                tipoSanguineo,
                semanasGestacao,
                login: {
                    email,
                    senha,
                }
            };

            console.log('Corpo da requisição:', JSON.stringify( usuario ));

            fetch('http://IP:8080/api/v1/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    navigation.navigate('Login');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const validarEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@.]+$/.test(email);
    };

    const validarDataNascimento = (data) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(data);
    };

    const validarSemanasGestacao = (semanasGestacao) => {
        const semanasGestacaoInt = parseInt(semanasGestacao, 10);
        return !isNaN(semanasGestacaoInt) && semanasGestacaoInt >= 0 && semanasGestacaoInt <= 45;
    };

    const validarTipoSanguineo = (tipoSanguineo) => {
        const regexTipoSanguineo = /^[ABO][\+-]|[ABO]{2}[\+-]$/;
        return regexTipoSanguineo.test(tipoSanguineo);
    };


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../cadastro/img/sem-logo.png')} style={styles.backgroundImage}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Cadastro</Text>
                    </View>
                    <View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Nome completo</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome"
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Data de Nascimento</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua data de nascimento"
                                value={dataNascimento}
                                onChangeText={setDataNascimento}
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Tipo Sanguíneo</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu tipo sanguíneo"
                                value={tipoSanguineo}
                                onChangeText={setTipoSanguineo}
                            />
                        </View>
                        <View>
                            <View style={styles.label}>
                                <Text style={styles.textInput}>Semanas de Gestação</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite em qual semana você está"
                                    value={semanasGestacao === 0 ? '' : semanasGestacao.toString()}
                                    onChangeText={(text) => {
                                        const numericValue = parseInt(text, 10);
                                        setSemanasGestacao(isNaN(numericValue) ? 0 : numericValue);
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>E-mail</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Senha</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.label}>
                            <Text style={styles.textInput}>Repita a senha</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite a senha novamente"
                                value={repetirSenha}
                                onChangeText={setRepetirSenha}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.buttonText}>Voltar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
        marginTop: 5,
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

export default Cadastro;
