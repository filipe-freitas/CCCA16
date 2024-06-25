# Próxima etapa do projeto

Utilizando as técnicas de refactoring que vimos na aula, refatore o código do UC1 - Signup, disponível em:
https://github.com/rodrigobranas/cccat16_1/blob/master/src/signup.ts

## UC1 - Signup

Ator: Passageiro, Motorista
Input: name, email, cpf, carPlate, password, isPassenger, isDriver
Output: account_id

- [x] deve verificar se o email já existe e lançar um erro caso já exista;
- [x] deve gerar o account_id (uuid);
- [x] deve validar o nome, email e cpf;
- [x] deve apenas salvar a senha, por enquanto em claro;

Para testar adequadamente o UC1 será necessário criar o **UC2 - GetAccount**.

## UC2 - GetAccount

Input: account_id

Output: todas as informações da conta

Observações:
Crie uma API REST para interagir com os use cases criados por meio do protocolo HTTP e não se esqueça de também criar testes para a API.

O modelo de dados está disponível em https://github.com/rodrigobranas/cccat16_1/blob/master/create.sql