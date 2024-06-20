import axios from 'axios'

axios.defaults.validateStatus = function () {
  return true
}

test('Deve criar uma conta para o passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    password: '123',
    cpf: '87748248800',
    isPassenger: true,
  }
  const output = await axios.post('http://localhost:3000/signup', input)
  expect(output.status).toBe(200)
  expect(output.data).toBeDefined()
})

test('Não deve criar uma conta caso o e-mail já esteja em uso', async function () {
  const sameEmail = `john.doe${Math.random()}@example.com`
  const firstAccount = {
    name: 'John Doe',
    email: sameEmail,
    password: '123',
    cpf: '87748248800',
    isPassenger: true,
  }
  const secondAccount = {
    name: 'Jane Doe',
    email: sameEmail,
    password: '123',
    cpf: '87748248801',
    isPassenger: true,
  }
  const firstAccountSignup = await axios.post(
    'http://localhost:3000/signup',
    firstAccount,
  )
  const secondAccountSignup = await axios.post(
    'http://localhost:3000/signup',
    secondAccount,
  )
  expect(firstAccountSignup.status).toBe(200)
  expect(secondAccountSignup.status).toBe(400)
  expect(secondAccountSignup.data).toBe('Error: E-mail is already used')
})

test('Deve criar o account_id da conta criada', async function () {
  const account = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    password: '123',
    cpf: '87748248800',
    isPassenger: true,
  }
  const accountSignup = await axios.post(
    'http://localhost:3000/signup',
    account,
  )
  expect(accountSignup.status).toBe(200)
  expect(accountSignup.data['accountId']).toBeDefined()
})

test('Deve validar criar uma conta com nome, email e cpf válidos', async function () {
  const invalidAccountName = {
    name: '',
    email: `john.doe${Math.random()}@gmail.com`,
    password: '123',
    cpf: '87748248800',
    isPassenger: true,
  }
  const invalidAccountNameSignup = await axios.post(
    'http://localhost:3000/signup',
    invalidAccountName,
  )
  expect(invalidAccountNameSignup.status).toBe(400)
  expect(invalidAccountNameSignup.data).toBe('Error: Name is invalid')

  const invalidAccountEmail = {
    name: 'John Doe',
    email: 'john.doe',
    password: '123',
    cpf: '87748248800',
    isPassenger: true,
  }
  const invalidAccountEmailSignup = await axios.post(
    'http://localhost:3000/signup',
    invalidAccountEmail,
  )
  expect(invalidAccountEmailSignup.status).toBe(400)
  expect(invalidAccountEmailSignup.data).toBe('Error: E-mail is invalid')

  const invalidAccountCpf = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    password: '123',
    cpf: '123',
    isPassenger: true,
  }
  const invalidAccountCpfSignup = await axios.post(
    'http://localhost:3000/signup',
    invalidAccountCpf,
  )
  expect(invalidAccountCpfSignup.status).toBe(400)
  expect(invalidAccountCpfSignup.data).toBe('Error: CPF is invalid')
})

test('Deve criar uma conta e salvar sua senha no banco de dados', async function () {
  const account = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    password: '123456',
    cpf: '87748248800',
    isPassenger: true,
  }
  const accountSignup = await axios.post(
    'http://localhost:3000/signup',
    account,
  )
  expect(accountSignup.status).toBe(200)

  const foundAccount = await axios.get(
    `http://localhost:3000/getaccount/${accountSignup.data['accountId']}`,
  )
  expect(foundAccount.status).toBe(200)
  expect(foundAccount.data['password']).toBe('123456')
})
