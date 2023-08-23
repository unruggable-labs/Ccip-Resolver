import { ethers }                    from 'hardhat'
import { DeployFunction }            from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const graphQlUrl = "http://localhost:8081";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { getNamedAccounts, deployments } = hre
    const { deploy, get }                   = deployments
    const { deployer }                      = await getNamedAccounts()

    const bedrockProofVerifier = await get("BedrockProofVerifier");
    const erc3668Resolver = await get("ERC3668Resolver");

    let deployArguments = [
        deployer,
        graphQlUrl,
        bedrockProofVerifier.address,
        erc3668Resolver.address
    ];

    const deployTx = await deploy('BedrockCcipVerifier', {
        from: deployer,
        args: deployArguments,
        log:  true,
        waitConfirmations: 5 //before we verify on etherscan
    })

    if (deployTx.newlyDeployed) {

        console.log(`BedrockCcipVerifier deployed at  ${deployTx.address}`);

        console.log("Verifying on Etherscan..");

        await hre.run("verify:verify", {
          address: deployTx.address,
          constructorArguments: deployArguments,
        });
    }
}

func.tags         = ['bedrock-ccip-verifier', 'l1']
func.dependencies = ["bedrock-proof-verifier", "erc-3668-resolver"]

export default func
