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
  console.log(output.status, output.data)
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
  console.log(`Status should be 200:${firstAccountSignup.status}`)
  console.log(
    `Property account_id should exist:${firstAccountSignup.data['accountId']}`,
  )
  const secondAccountSignup = await axios.post(
    'http://localhost:3000/signup',
    secondAccount,
  )
  console.log(`Status should be 400:${secondAccountSignup.status}`)
  console.log(
    `Error message should be 'Error: E-mail is already used':${secondAccountSignup.data}`,
  )
})
