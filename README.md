## Install

`cd ./functions`

`yarn`

`cd ../`

## Run locally

You need to set next Firebase Environment Variables:

`firebase functions:config:set blockchain.network="testnet or bitcoin"`

`firebase functions:config:set blockchain.wallet_wif="your wallet WIF here"`

`firebase functions:config:set blockchain.fee_satoshis_per_byte=20`

`firebase functions:config:set donations.imap_user="your email"`

`firebase functions:config:set donations.imap_password="email password"`

`firebase functions:config:set donations.imap_host="IMAP of mail provider"`

`firebase functions:config:set donations.imap_mailbox_name="mailbox name if different from INBOX"`

Then export it to .runtimeconfig.json for it can be used locally:

`firebase functions:config:get > ./functions/.runtimeconfig.json`
