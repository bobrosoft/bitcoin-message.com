# bitcoin-message.com

[![React](https://img.shields.io/badge/React-v16.1.1-28defe.svg)]() [![Firebase](https://img.shields.io/badge/Firebase-v3.13-ffcf00.svg)]() [![GitHub top language](https://img.shields.io/github/languages/top/bobrosoft/bitcoin-message.com.svg)]() [![license](https://img.shields.io/github/license/bobrosoft/bitcoin-message.com.svg)]()

[bitcoin-message.com](https://bitcoin-message.com) — Leave your mark on cryptocurrency world!
Save your message in Bitcoin blockchain. Forever! 🚀

With Bitcoin you can not only pay for things, but also store data in its blockchain which will be saved
forever on thousand of blockchain-nodes across the world. So why not use it for something fun? 😉


### Dev things I wanted to achieve in that project:

 - try to use blockchain technologies for something fun
 - use React for frontend (despite the fact that I prefer Angular 2/4+ and @ngrx)
 - try Firebase for backend (and some frontend parts)
 - try MobX for state management (as I found it looks really cool OOP-wise, near the same as services in Angular+RxJS)
 - write serverless app (I mean: with backend, but without classic server)
 - write beautiful backend implementation
 - write beautiful frontend implementation (of course!)
 - try to use async/await more widely

## Prerequisites

Node 6+

## Install

`cd ./functions`

`yarn`

`cd ../`

`yarn`

## Run locally

You need to set next Firebase Environment Variables:

`firebase functions:config:set blockchain.network="btc or tbtc or bch or tbch"`

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
