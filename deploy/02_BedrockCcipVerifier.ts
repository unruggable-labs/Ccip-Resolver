import hre, { ethers } from 'hardhat';
import json from '../exported-contracts.json' assert {type: 'json'};

async function main() {

    const chainId = hre.network.config.chainId;
    const networkName = hre.network.name;
    const contracts = json[chainId][networkName]["contracts"];

    const [owner] = await ethers.getSigners();
    const graphQlUrl = 'http://localhost:8081/graphql';
    const bedrockProofVerifierAddress = contracts["BedrockProofVerifier"]["address"];
    const erc3668ResolverAddress = contracts["ERC3668Resolver"]["address"];

    const BedrockCcipVerifierFactory = await ethers.getContractFactory('BedrockCcipVerifier');
    const deployTx = await BedrockProofVerifierFactory.deploy(
        owner.address,
        graphQlUrl,
        bedrockProofVerifierAddress,
        erc3668ResolverAddress,
    );
    await deployTx.deployed();

    console.log(`BedrockCcipVerifier deployed at  ${deployTx.address}`);
    console.log(
        `Verify the contract using  npx hardhat verify --network ${hre.network.name} ${deployTx.address} ${owner.address} ${graphQlUrl} ${bedrockProofVerifierAddress} ${l2ResolverAddress} `,
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
module.exports.default = main;
