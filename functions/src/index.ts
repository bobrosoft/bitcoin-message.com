import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {ProjectConfig} from './models/project-config.model';
import {BlockchainService} from './services/blockchain.service';
import {MessagesService} from './services/messages.service';
import {DonationsService} from './services/donations.service';
import {TestFunction} from './functions/test.function';
import {SaveMessageFunction} from './functions/save-message.function';

// Init Firebase Admin SDK
admin.initializeApp(functions.config().firebase);

// Create project's config
const config = functions.config() as ProjectConfig;

// Create services (manual DI)
const blockchainService = new BlockchainService(config);
const messagesService = new MessagesService();
const donationsService = new DonationsService(config);

// Register and bootstrap functions (manual DI)
export let helloWorld = new TestFunction(blockchainService).handler;
export let saveMessage = new SaveMessageFunction(messagesService).handler;