# Apresentando MãeConecta: Sua Aliada Confiável na Jornada da Maternidade 
Bem-vinda ao MãeConecta, o aplicativo que entende que cada momento da gestação é único e que, por vezes, surgem situações inesperadas. Estamos aqui para oferecer suporte e garantir que você esteja sempre no controle da sua saúde e bem-estar durante essa fase especial da vida. 
Recursos Especiais: 
1.	Registro de Procedimentos: Mantenha um histórico detalhado de consultas e exames para acompanhar de perto o progresso da sua gestação. O MãeConecta permite que você registre informações essenciais para discussão com seu profissional de saúde. 
2.	Ocorrências Gestacionais: Registre eventos que demandam atenção especial. Seja um sangramento vaginal, contrações, enxaqueca, ou qualquer outra situação fora do comum, o MãeConecta oferece um espaço seguro para documentar essas ocorrências. Isso permite que você se lembre de relatar esses eventos em consultas ou exames, promovendo uma comunicação eficaz com seu profissional de saúde. 
3.	Contatos de Emergência: Cadastre contatos importantes para situações de emergência, proporcionando a segurança de que você está conectada com quem mais importa. Em momentos críticos, a facilidade de acionar ajuda faz toda a diferença. 
4.	Chat com Assistente Virtual: Converse com nosso assistente virtual especializado em gestação, parto e pré-natal. Tire dúvidas sobre ocorrências gestacionais, receba orientações e sinta-se apoiada a qualquer momento, mantendo-se informada e preparada para cada situação.

No MãeConecta, acreditamos que a informação é a chave para uma gestação saudável. Com nosso aplicativo, tenha ao seu alcance uma ferramenta que não apenas registra momentos especiais, mas que também proporciona suporte essencial em situações imprevistas.

MãeConecta: porque sua jornada é única, e nós estamos aqui para ajudar em cada passo, oferecendo tranquilidade e suporte quando mais você precisa.

- Observações :
  
    - Clone o repositório e nos endpoints deve-se colocar o IP local caso queira emular pelo Android.
    - Aqui está o link para o projeto do Back-End (Java): [https://github.com/mariananieton/MaeConecta](https://github.com/mariananieton/MaeConecta)
    

- Integrantes : 
    - RM93042 - FILIPE SANTOS DA SILVA
    - RM94467 - FRANKLIN PEREIRA DO NASCIMENTO
    - RM92920 - JOSE GABRIEL DA SILVA COELHO
    - RM94141 - MARIANA NIETON BORGES

--------------------------

### ENDPOINTS


- Usuario Controller
  
    - salvar ( método que faz a persistência tanto de Usuário quanto de Login )

    - buscar por ID ( apenas os dados do Usuário )

    - deletar por ID ( método deleta Usuário, Login, Procedimentos, Ocorrências e Contatos por cascade, pelo ID do usuário )

    - atualizar por ID ( atualiza o Usuário isoladamente )

--------------------------

- Login Controller
  
   - login ( método de autenticação com JWT )

   - atualizar por ID ( atualiza o Login isoladamente )
     
--------------------------

- Procedimento Controller
  
    - salvar ( método que faz a persistência do Procedimento )

    - buscar por ID ( apenas os dados do Procedimento )

    - deletar por ID ( método que deleta o Procedimento e Ocorrências relacionadas por cascade, pelo ID do procedimento )

    - atualizar por ID ( atualiza o Procedimento isoladamente )
      
    - buscar todos por ID do usuário ( busca todos os procedimentos do usuário, de acordo com o id do usuário )

--------------------------

- Ocorrencia Controller
  
    - salvar ( método que faz a persistência da Ocorrência e atrela a um Procedimento já existente, caso passe o procedimentoId )

    - buscar por ID ( apenas os dados da Ocorrência + procedimentoId caso tenha )

    - deletar por ID ( método que deleta a Ocorrência, pelo ID da ocorrência )

    - atualizar por ID ( atualiza a Ocorrência isoladamente )
      
    - buscar todos por ID do usuário ( busca todas as ocorrências do usuário, de acordo com o id do usuário )

--------------------------

- Contato Controller
  
    - salvar ( método que faz a persistência do Contato )

    - buscar por ID ( apenas os dados do Contato )

    - deletar por ID ( método que deleta o Contato, pelo ID do Contato )

    - atualizar por ID ( atualiza o Contato isoladamente )
      
    - buscar todos por ID do usuário ( busca todos os contatos do usuário, de acordo com o id do usuário )

--------------------------

- Chat Controller
  
    - enviar mensagem ( método que envia uma request a integração com o ChatGPT )

--------------------------

### Usuario Controller

### Salvar usuário

`POST` /api/v1/usuario - não requer autenticação

**Campos da Requisição**

- Usuario

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|nome | String | sim | o nome do usuario deve ser entre 3 a 200
|dataNascimento | LocalDate | sim | a data do usuario deve ser no formato YYYY-MM-DD
|semanasGestacao | Integer | sim | o número de semanas de gestação
|tipoSanguineo | String | sim | deve estar no formato "O+" ou "AB-" 

- Login

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|email | String | sim | o valor do email, único
|senha | String | sim | a senha não pode ser nula e vai ser criptografada

**Exemplo de corpo de requisição**

```js
{
    "nome": "Bella Swan",
    "dataNascimento": "2000-04-17",
    "semanasGestacao": 24,
    "tipoSanguineo":"O-",
    "login": {
        "email": "bella@swan.com",
        "senha": "12345678"
    }
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 201 | Usuário salvo
| 400 | Campos inválidos
----

### Detalhes do Usuário - buscar por ID 

`GET` /api/v1/usuario{id} - requer autenticação

**Exemplo de corpo de resposta**

```js

{
    "id": 1,
    "nome": "Bella Swan",
    "dataNascimento": "2000-04-17",
    "dataCadastro": "2023-11-22",
    "tipoSanguineo": "O-",
    "semanasGestacao": 24
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Dados do usuário retornados
| 404 | Não existe usuário com o ID informado
------------------

### Deleta usuário por ID 

`DELETE` /api/v1/usuario{id} - requer autenticação

**Códigos de Respostas**

| código | descrição
|-|-
| 204 | Usuário deletado
| 403 | Não autorizado
----
### Atualiza usuário por ID 

`PUT` /api/v1/usuario/{id} - requer autenticação

**Campos da Requisição**

- Usuario

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|nome | String | sim | o nome do usuario deve ser entre 3 a 200
|dataNascimento | LocalDate | sim | a data do usuario deve ser no formato YYYY-MM-DD
|semanasGestacao | Integer | sim | o número de semanas de gestação
|tipoSanguineo | String | sim | deve estar no formato "O+" ou "AB-" 


**Exemplo de corpo de requisição**

```js
{
    "nome": "Hayley Williams",
    "dataNascimento": "2000-11-15",
    "semanasGestacao": 40,
    "tipoSanguineo":"AB-"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Usuário salvo
| 400 | Campos inválidos
----
### Login Controller 

### Login (método de autenticação JWT)

`POST` /api/v1/login - não requer autenticação

**Campos da Requisição**

 **Exemplo de corpo de requisição**

```js
{
    "email": "bella@swan.com",
    "senha": "12345678"
}

```  

**Resposta da  Requisição** - O Token deve ir em todos os cabeçalhos das demais requisições para autorizar

```js
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6InVzdWFyaW8uZmlhcEBleGFtcGxlLmNvbSIsImlzcyI6IlNldUNhbnRlaXJvIiwiZXhwIjoxNjg2MDczMDYxfQ.jUVpPpyqIarDJVqbC1d60Eqto1newaMgN4o1ELLOhTs",
    "type": "JWT",
    "prefix": "Bearer "
}

```   

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Usuário logado
| 403 | Não autorizado
----

### Atualizar login por ID

`PUT` /api/v1/login/{id} - requer autenticação

**Campos da Requisição**

- Login

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|email | String | sim | o valor do email, único
|senha | String | sim | a senha não pode ser nula e vai ser criptografada


**Exemplo de corpo de requisição**

```js
{
    "email": "miles@morales.com",
    "senha": "senhaFacil000"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Login atualizado 
| 400 | Campos inválidos
----
### Procedimento Controller

### Salvar procedimento

`POST` /api/v1/procedimento/{id} - requer autenticação - {id} refere-se ao id do usuário em que o contato será cadastrado

**Campos da Requisição**

- Procedimento

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|tipoProcedimento | String | sim | aceita os valores "Exame" ou "Consulta"
|dataProcedimento | LocalDate | sim | a data do procedimento deve ser no formato YYYY-MM-DD
|especialidade | Integer | sim | aceita os valores pré-definidos abaixo:

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
"Psicologia Perinatal"

**Exemplo de corpo de requisição**

```js
{
    "tipoProcedimento": "Consulta",
    "dataProcedimento": "2023-02-06",
    "especialidade": "Dosagem de Hormônios"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 201 | Procedimento salvo
| 400 | Campos inválidos
----

### Detalhes do Procedimento - buscar por ID 

`GET` /api/v1/procedimento{id} - requer autenticação

**Exemplo de corpo de resposta**

```js

{
    "id": 1,
    "dataProcedimento": "2023-02-06",
    "tipoProcedimento": "Consulta",
    "especialidade": "Dosagem de Hormônios"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Dados do procedimento retornados
| 404 | Não existe procedimento com o ID informado
------------------

### Deleta procedimento por ID 

`DELETE` /api/v1/procedimento{id} - requer autenticação

**Códigos de Respostas**

| código | descrição
|-|-
| 204 | Procedimento deletado
| 403 | Não autorizado
----
### Atualiza procedimento por ID 

`PUT` /api/v1/procedimento/{id} - requer autenticação

**Campos da Requisição**

- Procedimento

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|tipoProcedimento | String | sim | aceita os valores "Exame" ou "Consulta"
|dataProcedimento | LocalDate | sim | a data do procedimento deve ser no formato YYYY-MM-DD
|especialidade | Integer | sim | aceita os valores pré-definidos abaixo:

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
"Psicologia Perinatal" 


**Exemplo de corpo de requisição**

```js
{
    "tipoProcedimento": "Exame",
    "dataProcedimento": "2023-06-19",
    "especialidade": "Exames de Sangue"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Procedimento salvo
| 400 | Campos inválidos
----

### Buscar todos por ID do usuário

`GET` /api/v1/procedimento/user/{id} - requer autenticação

**Exemplo de corpo de resposta**

```js

[
    {
        "id": 1,
        "dataProcedimento": "2023-06-19",
        "tipoProcedimento": "Exame",
        "especialidade": "Exames de Sangue"
    },
    {
        "id": 2,
        "dataProcedimento": "2023-02-06",
        "tipoProcedimento": "Consulta",
        "especialidade": "Dosagem de Hormônios"
    },
    {
        "id": 3,
        "dataProcedimento": "2023-02-06",
        "tipoProcedimento": "Exame",
        "especialidade": "Ultrassom Morfológico"
    }
]

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Dados dos procedimentos retornados
| 404 | Não existem procedimentos com o ID do usuário informado
------------------

----
### Ocorrencia Controller

### Salvar ocorrencia

`POST` /api/v1/ocorrencia/{id} - requer autenticação - {id} refere-se ao id do usuário em que a ocorrência será cadastrada

**Campos da Requisição**

- Ocorrencia

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|titulo | String | sim | o titulo deve ter no mínimo 3 caracteres
|dataOcorrencia | LocalDate | sim | a data da ocorrencia deve ser no formato YYYY-MM-DD
|descricao | String | sim | deve ter entre 3 e 200 caracteres
|procedimentoId | Integer | não | deve ser o id de um procedimento já cadastrado anteriormente

**Exemplo de corpo de requisição**

```js
{
    "titulo": "Sangramento",
    "dataOcorrencia": "2023-11-15",
    "descricao": "Sangramento vaginal fora do esperado",
    "procedimentoId": 1
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 201 | Ocorrência salva
| 400 | Campos inválidos
----

### Detalhes da Ocorrência - buscar por ID 

`GET` /api/v1/ocorrencia{id} - requer autenticação

**Exemplo de corpo de resposta**

```js

{
    "id": 1,
    "titulo": "Sangramento",
    "dataOcorrencia": "2023-11-15",
    "descricao": "Sangramento vaginal fora do esperado",
    "procedimentoId": 1
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Dados da ocorrência retornados
| 404 | Não existe ocorrência com o ID informado
------------------

### Deleta ocorrência por ID 

`DELETE` /api/v1/ocorrencia{id} - requer autenticação

**Códigos de Respostas**

| código | descrição
|-|-
| 204 | Ocorrência deletada
| 403 | Não autorizado
----
### Atualiza ocorrência por ID 

`PUT` /api/v1/ocorrencia/{id} - requer autenticação

**Campos da Requisição**

- Ocorrencia

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|titulo | String | sim | o titulo deve ter no mínimo 3 caracteres
|dataOcorrencia | LocalDate | sim | a data da ocorrencia deve ser no formato YYYY-MM-DD
|descricao | String | sim | deve ter entre 3 e 200 caracteres

**Exemplo de corpo de requisição**

```js
{
    "titulo": "Dor de cabeça",
    "dataOcorrencia": "2023-07-02",
    "descricao": "Enxaqueca"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Ocorrência salva
| 400 | Campos inválidos
----

### Buscar todas por ID do usuário

`GET` /api/v1/ocorrencia/user/{id} - requer autenticação

**Exemplo de corpo de resposta**

```js

[
    {
        "id": 1,
        "titulo": "Dor de cabeça",
        "dataOcorrencia": "2023-07-02",
        "descricao": "Enxaqueca",
        "procedimentoId": 1
    },
    {
        "id": 2,
        "titulo": "Sangramento",
        "dataOcorrencia": "2023-11-15",
        "descricao": "Sangramento vaginal fora do esperado",
        "procedimentoId": 2
    }
]

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Dados das ocorrências retornados
| 404 | Não existem ocorrências com o ID do usuário informado
------------------

### Contato Controller

### Salvar contato

`POST` /api/v1/contato/{id} - requer autenticação - {id} refere-se ao id do usuário em que o contato será cadastrado

**Campos da Requisição**

- Contato

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|nome | String | sim | o nome deve ter entre 3 e 200 caracteres
|telefone | String | sim | o telefone do contato de emergência 
|relacionamento | String | sim | deve ter entre 3 e 100 caracteres

**Exemplo de corpo de requisição**

```js
{
    "nome": "Miles Morales",
    "telefone": "987654321",
    "relacionamento": "Marido"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 201 | Contato salvo
| 400 | Campos inválidos
----

### Detalhes do Contato - buscar por ID 

`GET` /api/v1/contato{id} - requer autenticação

**Exemplo de corpo de resposta**

```js

{
    "id": 1,
    "nome": "Miles Morales",
    "telefone": "987654321",
    "relacionamento": "Marido"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Dados do contato retornados
| 404 | Não existe contato com o ID informado
------------------

### Deleta contato por ID 

`DELETE` /api/v1/contato{id} - requer autenticação

**Códigos de Respostas**

| código | descrição
|-|-
| 204 | Contato deletado
| 403 | Não autorizado
----
### Atualiza contato por ID 

`PUT` /api/v1/contato/{id} - requer autenticação

**Campos da Requisição**

- Contato

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|nome | String | sim | o nome deve ter entre 3 e 200 caracteres
|telefone | String | sim | o telefone do contato de emergência
|relacionamento | String | sim | deve ter entre 3 e 100 caracteres

**Exemplo de corpo de requisição**

```js
{
    "nome": "Peter Parker",
    "telefone": "912345678",
    "relacionamento": "Marido"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Contato salvo
| 400 | Campos inválidos
----

### Buscar todas por ID do usuário

`GET` /api/v1/contato/user/{id} - requer autenticação

**Exemplo de corpo de resposta**

```js

[
    {
        "id": 1,
        "nome": "Peter Parker",
        "telefone": "912345678",
        "relacionamento": "Marido"
    },
    {
        "id": 2,
        "nome": "Miles Morales",
        "telefone": "987654321",
        "relacionamento": "Irmão"
    }
]

```

**Códigos de Respostas**

| código | descrição
|-|-
| 200 | Dados dos contatos retornados
| 404 | Não existem contatos com o ID do usuário informado
------------------

### Chat Controller

### Enviar mensagem

`POST` /api/v1/chat - requer autenticação - o application.properties precisa estar preenchido com uma apiKey válida

**Campos da Requisição**

- Contato

| campo | tipo | obrigatório | descrição 
|-------|------|:-------------:|---
|message | String | sim | a mensagem a ser enviada

**Exemplo de corpo de requisição**

```js
{
    "message": "Quais os principais sintomas de gravidez?"
}

```

**Códigos de Respostas**

| código | descrição
|-|-
| 201 | Mensagem enviada
| 400 | Campos inválidos
----
