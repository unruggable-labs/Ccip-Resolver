import { ethers }                    from 'hardhat'
import { DeployFunction }            from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const DEFAULT_VERIFIER_ADDRESS = "0x183C1F81D0159794973c157694627a689DEB9F72"
const DEFAULT_VERIFIER_URL = "https://unruggablegateway.com"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { getNamedAccounts, deployments } = hre
    const { deploy, get }                   = deployments
    const { deployer }                      = await getNamedAccounts()

    const nameWrapper     = await get("NameWrapper");
    const ensRegistry     = await get("ENSRegistry");
    const defaultVerifier = await get("L2PublicResolverVerifier");

    let deployArguments = [
        ensRegistry.address,
        nameWrapper.address,
        defaultVerifier.address,
        [DEFAULT_VERIFIER_URL]
    ];

    const deployTx = await deploy('ERC3668Resolver', {
        from: deployer,
        args: deployArguments,
        log:  true,
        waitConfirmations: 5 //before we verify on etherscan
    })

    if (deployTx.newlyDeployed) {

        console.log(`ERC3668Resolver deployed at  ${deployTx.address}`);

        console.log("Verifying on Etherscan..");

        await hre.run("verify:verify", {
          address: deployTx.address,
          constructorArguments: deployArguments,
        });
    }
}

func.tags         = ["erc-3668-resolver", 'l1']
func.dependencies = []

export default func
