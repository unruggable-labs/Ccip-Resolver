/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-solhint';
import '@typechain/hardhat';
import 'dotenv/config';
import { ethers } from 'ethers';
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import 'hardhat-storage-layout';
import 'hardhat-tracer';
import 'solidity-coverage';
import dotenv from 'dotenv'

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
dotenv.config()

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const OPTIMISTIC_ETHERSCAN_API_KEY = process.env.OPTIMISTIC_ETHERSCAN_API_KEY;

const MAINNET_URL = process.env.MAINNET_RPC_URL ?? '';
const GOERLI_URL = process.env.GOERLI_RPC_URL ?? '';
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? ethers.Wallet.createRandom().privateKey;

const hardhat =
    process.env.CI || process.env.npm_lifecycle_event !== 'test:e2e'
        ? {}
        : {
              forking: {
                  url: 'http://localhost:8545',
              },
          };


export const defaultResolverPath       = '../ENS-Bedrock-Resolver/deployments/'


module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat,
        mainnet: {
            url: MAINNET_URL,
            chainId: 1,
            accounts: [DEPLOYER_PRIVATE_KEY],
        },
        optimismGoerli: {
            url: 'https://goerli.optimism.io',
            chainId: 420,
            accounts: [DEPLOYER_PRIVATE_KEY],
        },
        goerli: {
            url: GOERLI_URL,
            chainId: 5,
            accounts: [DEPLOYER_PRIVATE_KEY],
        },
        localhost: {},
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
    },
    solidity: {
        compilers: [
            {
                version: '0.8.17',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        details: {
                            yulDetails: {
                                optimizerSteps: 'u',
                            },
                        },
                    },
                },
            },
        ],
    },
    mocha: {
        timeout: 100000,
    },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
    abiExporter: {
        path: './build/contracts',
        runOnCompile: true,
        clear: true,
        flat: true,
        except: [],
        spacing: 2,
        pretty: true,
    },
    external: {
      deployments: {
        localhost:         [defaultResolverPath + "/localhost"],
        goerli:            [defaultResolverPath + "/goerli"],
        "optimism-goerli": [defaultResolverPath + "/optimism-goerli"],
        mainnet:           [defaultResolverPath + "/mainnet"],
      },
    },
};
