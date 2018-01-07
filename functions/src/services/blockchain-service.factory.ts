import {ProjectConfig} from '../models/project-config.model';
import {BlockchainService} from '../models/blockchain-service.model';
import {BlockchainNetwork} from '../models/shared/blockchain-network.model';
import {BitcoinBlockchainService} from './bitcoin-blockchain.service';
import {BitcoinCashBlockchainService} from './bitcoin-cash-blockchain.service';
import {ApiError} from '../models/api-error.model';

export class BlockchainServiceFactory {
  
  /**
   * Creates proper BlockchainService depending on passed config values
   * @param {ProjectConfig} config
   * @returns {BlockchainService}
   */
  static create(config: ProjectConfig): BlockchainService {
    switch (config.blockchain.network) {
      case BlockchainNetwork.btc:
      case BlockchainNetwork.tbtc:
        return new BitcoinBlockchainService(config);

      case BlockchainNetwork.bch:
      case BlockchainNetwork.tbch:
        return new BitcoinCashBlockchainService(config);
        
      default:
        throw new ApiError('Wrong blockchain network passed: ' + config.blockchain.network);
    }
  }
}