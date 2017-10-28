## Install

`cd ./functions`

`yarn`

`cd ../`

## Run locally

You need to set next Firebase Environment Variables:

`firebase functions:config:set blockchain.network="testnet"`

`firebase functions:config:set blockchain.wallet_wif="your wallet WIF here"`

`firebase functions:config:set blockchain.fee_satoshis_per_byte=20`

Then export it to .runtimeconfig.json for it can be used locally:

`firebase functions:config:get > ./functions/.runtimeconfig.json`
