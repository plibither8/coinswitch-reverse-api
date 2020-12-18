const polka = require('polka')
const fetch = require('node-fetch')
const keys = require('./keys.json')

const EXTERNAL_ENDPOINTS = {
  sell: 'https://cs-india.coinswitch.co/api/v1/fixed/offer',
  investmentWorth: 'https://cs-india.coinswitch.co/api/v1/custody-wallet-user/investment',
  balances: 'https://cs-india.coinswitch.co/api/v1/custody-wallet-user/account-balances'
}

const commonHeaders = () => ({
  Host: 'cs-india.coinswitch.co',
  accept: 'application/json, text/plain, */*',
  'content-type': 'application/json',
  'accept-encoding': 'gzip',
  'user-agent': 'okhttp/3.12.1',
  'x-app-version': '2.0.1',
  'x-auth-key': keys[Math.floor(Math.random() * keys.length)],
  'if-modified-since': new Date().toUTCString()
})

const resWrap = (data, success) => JSON.stringify({ success, data })

const getSellPrice = async (req, res) => {
  const { coin, amount } = req.query

  const response = await fetch(EXTERNAL_ENDPOINTS.sell, {
    method: 'POST',
    headers: commonHeaders(),
    body: JSON.stringify({
      destinationCoin: 'inr',
      destinationCoinAmount: null,
      depositCoin: coin,
      depositCoinAmount: amount
    })
  })

  const json = await response.json()
  if (!json.success) return res.end(null, false)

  const { data: {
    destinationCoinAmount,
    depositCoinAmount,
    depositCoin,
    rate
  } } = json

  res.end(resWrap({
    coin: depositCoin,
    value: Number(destinationCoinAmount),
    rate
  }, true))
}

const getInvestmentWorth = async (req, res) => {
  const response = await fetch(EXTERNAL_ENDPOINTS.investmentWorth, {
    method: 'GET',
    headers: commonHeaders()
  })

  const json = await response.json()
  if (!json.success) return res.end(resWrap(null, false))

  res.end(resWrap({ worth: json.data.current.inr }, true))
}

const getPortfolio = async (req, res) => {
  const response = await fetch(EXTERNAL_ENDPOINTS.balances, {
    method: 'GET',
    headers: commonHeaders()
  })

  const json = await response.json()
  if (!json.success) return res.end(resWrap(null, false))

  const portfolio = []
  for (const dataPoint of json.data) {
    const { main_balance: balance, coin: { symbol } } = dataPoint
    if (balance > 0 && symbol !== "inr") {
      portfolio.push({
        coin: symbol,
        amount: balance
      })
    }
  }

  res.end(resWrap(portfolio, true))
}

polka()
  .get('/sellPrice', getSellPrice)
  .get('/investmentWorth', getInvestmentWorth)
  .get('/portfolio', getPortfolio)
  .listen(5000, err => console.log('Up and running!'))
