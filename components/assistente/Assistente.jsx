import React, {useEffect, useState} from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from "react-native";
import Menu from "../menu/Menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const Assistente = ({ navigation }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [resposta, setResposta] = useState("");

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

    const sendMessage = async () => {
        try {
            if (message.trim() !== "") {
                const response = await fetch("http://IP:8080/api/v1/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `${token}`,
                    },
                    body: JSON.stringify({
                        message,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Falha ao enviar mensagem");
                }

                const respostaDoServidor = await response.text();
                setResposta(respostaDoServidor);


                setMessages([{ text: message }]);
                setMessage("");
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../assistente/img/logo.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>MamãeAssistente</Text>
            </View>
            <View style={styles.chatContainer}>
                <View style={styles.messagesContainer}>
                    {messages.map((msg, index) => (
                        <Text key={index} style={styles.message}>
                            {msg.text}
                        </Text>
                    ))}
                    {resposta !== "" && (
                        <Text style={styles.resposta}>
                            {resposta}
                        </Text>
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua mensagem"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.button} onPress={sendMessage}>
                        <Image source={require('../assistente/img/send.png')} style={styles.image}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
        marginTop: 20,
    },
    messagesContainer: {
        flex: 1,
        padding: 10,
    },
    message: {
        fontSize: 15,
        marginBottom: 5,
    },
    resposta: {
        fontSize: 15,
        marginBottom: 5,
        color: "#D644D0",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#989698",
        borderRadius: 30,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    buttonText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBE6E6',
        padding: 10,
        height: '14%',
    },
    icon: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginTop: 40,
        resizeMode: 'contain',

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 40,
        marginLeft: 15,
        color: '#D644D0',
    },
    image: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
});

export default Assistente;