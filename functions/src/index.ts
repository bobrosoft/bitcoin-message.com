import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {ProjectConfig} from './models/project-config.model';
import {BlockchainService} from './services/blockchain.service';
import {MessagesService} from './services/messages.service';
import {ExchangeRatesService} from './services/exchange-rates.service';
import {DonationsService} from './services/donations.service';
// import {TestFunction} from './functions/test.function';
import {SaveMessageFunction} from './functions/save-message.function';
import {CheckDonationsFunction} from './functions/check-donations.function';

// Init Firebase Admin SDK
admin.initializeApp(functions.config().firebase);

// Create project's config
const config = functions.config() as ProjectConfig;

// Create services (manual DI)
const blockchainService = new BlockchainService(config);
const messagesService = new MessagesService(blockchainService);
const exchangeRatesService = new ExchangeRatesService();
const donationsService = new DonationsService(config, exchangeRatesService, messagesService);

// Register and bootstrap functions (manual DI)
// export let helloWorld = new TestFunction(donationsService).handler;
export let saveMessage = new SaveMessageFunction(messagesService).handler;
export let checkDonations = new CheckDonationsFunction(messagesService, donationsService).handler;