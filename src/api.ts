import crypto from 'crypto'
import express from 'express'
import pgp from 'pg-promise'
import { validate } from './validateCpf'
import pg from 'pg-promise/typescript/pg-subset'
const app = express()
app.use(express.json())

app.post('/signup', async function (req, res) {
  const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
  try {
    const id = crypto.randomUUID()

    const [accountFound] = await GetAccountByEmail(req.body.email, connection)

    if (accountFound) {
      res.status(400).json('Error: E-mail is already used') //result = -4;
      return
    }

    if (!ValidateName(req.body.name)) {
      res.status(400).json('Error: Name is invalid') //result = -3
      return
    }

    if (!ValidateEmail(req.body.email)) {
      res.status(400).json('Error: E-mail is invalid') //result = -2
      return
    }

    if (!validate(req.body.cpf)) {
      res.status(400).json('Error: CPF is invalid') //result = -1
      return
    }

    if (req.body.isDriver && !ValidateCarPlate(req.body.carPlate)) {
      res.status(400).json('Error: Car plate is invalid') // result = -5
      return
    }

    await connection.query(
      'insert into cccat16.account (account_id, name, email, password, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        id,
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.cpf,
        req.body.carPlate,
        !!req.body.isPassenger,
        !!req.body.isDriver,
      ],
    )

    res.status(200).json({
      accountId: id,
    })
  } finally {
    await connection.$pool.end()
  }
})

app.get('/getaccount/:accountId', async function (req, res) {
  const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
  try {
    const [foundAccount] = await connection.query(
      'select * from cccat16.account where account_id = $1',
      [req.params.accountId],
    )
    res.status(200).json(foundAccount)
  } finally {
    await connection.$pool.end()
  }
})

async function GetAccountByEmail(
  email: string,
  conn: pgp.IDatabase<{}, pg.IClient>,
) {
  const isEmailValid = ValidateEmail(email)
  if (!isEmailValid) {
    return []
  }
  const accountFound = await conn.query(
    'select * from cccat16.account where email = $1',
    email,
  )
  if (!accountFound) return []
  return accountFound
}

function ValidateEmail(email: string): boolean {
  return email.match(/^(.+)@(.+)$/) ? true : false
}

function ValidateName(name: string): boolean {
  return name.match(/[a-zA-Z] [a-zA-Z]+/) ? true : false
}

function ValidateCarPlate(carPlate: string): boolean {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/) ? true : false
}

app.listen(3000)
