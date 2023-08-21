import hre, { ethers } from 'hardhat';
import json from '../exported-contracts.json' assert {type: 'json'};

const NAME = 'SignatureCcipVerifier';
const GraphQlUrl = 'http://localhost:8081/graphql';
async function main() {

    const chainId = hre.network.config.chainId;
    const networkName = hre.network.name;
    const contracts = json[chainId][networkName]["contracts"];
    const erc3668ResolverAddress = contracts["ERC3668Resolver"]["address"];

    const [signer] = await ethers.getSigners();

    const SignatureVerifier = await ethers.getContractFactory('SignatureCcipVerifier');
    const deployTx = await SignatureVerifier.deploy(signer.address, GraphQlUrl, NAME, erc3668ResolverAddress, [
        signer.address,
    ]);
    await deployTx.deployed();

    console.log(`SignatureCcipVerifier deployed at  ${deployTx.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
module.exports.default = main;
