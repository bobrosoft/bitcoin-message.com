## About

### Dev things I wanted to achieve in that project:

 - use React for frontend (despite the fact that I prefer Angular 2/4+ and @ngrx)
 - try MobX for state management (as I found it looks really cool OOP-wise, near the same as services in Angular+RxJS)
 - try Firebase for backend (and some frontend parts)
 - write serverless app (I mean: with backend, but without classic server)
 - write beautiful backend implementation
 - write beautiful frontend implementation (of course!)
 - try to use async/await more widely

## Install

`cd ./functions`

`yarn`

`cd ../`

## Run locally

You need to set next Firebase Environment Variables:

`firebase functions:config:set blockchain.network="btc or tbtc"`

`firebase functions:config:set blockchain.wallet_wif="your wallet WIF here"`

`firebase functions:config:set blockchain.fee_satoshis_per_byte=20`

`firebase functions:config:set donations.imap_user="your email"`

`firebase functions:config:set donations.imap_password="email password"`

`firebase functions:config:set donations.imap_host="IMAP of mail provider"`

`firebase functions:config:set donations.imap_mailbox_name="mailbox name if different from INBOX"`

`firebase functions:config:set donations.min_donation_amount=1.20`

`firebase functions:config:set donations.min_donation_currency="USD"`

Then export it to .runtimeconfig.json for it can be used locally:

`firebase functions:config:get > ./functions/.runtimeconfig.json`

Then execute `yarn server`