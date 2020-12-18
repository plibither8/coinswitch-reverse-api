# coinswitch-portfolio-worth

> Simplified proxy API for CoinSwitch's internal API.

Used by [coinswitch-portfolio-worth](https://github.com/plibither8/coinswitch-portfolio-worth).

## About

* Add your auth keys in [keys.json](keys.json).
  * Try to add many auth keys as possible, to mitigate detection and blacklisting.
* Currently exposed endpoints and external counterparts:
  * `/sellPrice` : `/api/v1/fixed/offer`
  * `/investmentWorth` : `/api/v1/custody-wallet-user/investment`
  * `/portfolio` : `/api/v1/custody-wallet-user/account-balances`
* External hostname: cs-india.coinswitch.co

## License

[MIT](LICENSE)
