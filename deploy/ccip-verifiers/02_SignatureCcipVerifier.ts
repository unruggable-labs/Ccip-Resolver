import { ethers }                    from 'hardhat'
import { DeployFunction }            from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const NAME = 'SignatureCcipVerifier';
const GraphQlUrl = 'http://localhost:8081/graphql';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { getNamedAccounts, deployments } = hre
    const { deploy, get }                   = deployments
    const { deployer }                      = await getNamedAccounts()

    const erc3668Resolver = await get("ERC3668Resolver");

    let deployArguments = [
        deployer,
        GraphQlUrl,
        NAME,
        erc3668Resolver.address,
        [deployer]
    ];

    const deployTx = await deploy('SignatureCcipVerifier', {
        from: deployer,
        args: deployArguments,
        log:  true,
        waitConfirmations: 5 //before we verify on etherscan
    })

    if (deployTx.newlyDeployed) {

        console.log(`SignatureCcipVerifier deployed at  ${deployTx.address}`);

        console.log("Verifying on Etherscan..");

        await hre.run("verify:verify", {
          address: deployTx.address,
          constructorArguments: deployArguments,
        });
    }
}

func.tags         = ["signature-ccip-verifier", 'l1']
func.dependencies = ["erc-3668-resolver"]

export default func
