import { ethers }                    from 'hardhat'
import { DeployFunction }            from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { getNamedAccounts, deployments } = hre
    const { deploy, get }                   = deployments
    const { deployer }                      = await getNamedAccounts()

    // https://community.optimism.io/docs/useful-tools/networks/
    const l2OutputOracle = await get("L2OutputOracle");

    let deployArguments = [
        l2OutputOracle.address
    ];

    const deployTx = await deploy('BedrockProofVerifier', {
        from: deployer,
        args: deployArguments,
        log:  true,
        waitConfirmations: 5 //before we verify on etherscan
    })

    if (deployTx.newlyDeployed) {

        console.log(`BedrockProofVerifier deployed at  ${deployTx.address}`);

        console.log("Verifying on Etherscan..");

        await hre.run("verify:verify", {
          address: deployTx.address,
          constructorArguments: deployArguments,
        });
    }
}

func.tags         = ['bedrock-proof-verifier', 'l1']
func.dependencies = []

export default func
