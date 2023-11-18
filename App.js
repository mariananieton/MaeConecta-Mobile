// GRUPO TILLS
// RM93042 - FILIPE SANTOS DA SILVA
// RM94467 - FRANKLIN PEREIRA DO NASCIMENTO
// RM92920 - JOSE GABRIEL DA SILVA COELHO
// RM94141 - MARIANA NIETON BORGES

import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import Login from "./components/login/Login"
import Cadastro from "./components/cadastro/Cadastro";
import Home from "./components/home/Home";
import CadastroContatos from "./components/cadastroContatos/CadastroContatos";
import CadastroOcorrencias from "./components/cadastroOcorrencias/CadastroOcorrencias";
import CadastroProcedimentos from "./components/cadastroProcedimentos/CadastroProcedimentos";
import Assistente from "./components/assistente/Assistente";
import Procedimentos from "./components/procedimentos/Procedimentos";
import AtualizarProcedimentos from "./components/atualizarProcedimentos/AtualizarProcedimentos";
import Contatos from "./components/contatos/Contatos";
import AtualizarContatos from "./components/atualizarContatos/AtualizarContatos";
import Ocorrencias from "./components/ocorrencias/Ocorrencias";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Cadastro"
                    component={Cadastro}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="CadastroContatos"
                    component={CadastroContatos}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="CadastroOcorrencias"
                    component={CadastroOcorrencias}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="CadastroProcedimentos"
                    component={CadastroProcedimentos}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Assistente"
                    component={Assistente}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Procedimentos"
                    component={Procedimentos}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="AtualizarProcedimentos"
                    component={AtualizarProcedimentos}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Contatos"
                    component={Contatos}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="AtualizarContatos"
                    component={AtualizarContatos}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Ocorrencias"
                    component={Ocorrencias}
                    options={{headerShown: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;