import axios from 'axios'

axios.defaults.validateStatus = function () {
  return true
}

test('Deve criar uma conta para o passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
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
    cpf: '87748248800',
    isPassenger: true,
  }
  const secondAccount = {
    name: 'Jane Doe',
    email: sameEmail,
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
