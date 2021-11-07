const DecentralBank = artifacts.require('DecentralBank');
const Reward = artifacts.require('Reward');
const Tether = artifacts.require('Tether');

module.exports = async function(deployer, network, accounts){
    // deploy Tether Contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed(); // wait to make sure its deployed

    // deploy Reward Contract
    await deployer.deploy(Reward);
    const reward = await Reward.deployed(); // wait to make sure its deployed


    // deploy DecentralBank Contract
    await deployer.deploy(DecentralBank, reward.address, tether.address);
    const decentralBank = await DecentralBank.deployed();
    // transfer all Reward tokens to DecentralBank
    await reward.transfer(decentralBank.address,'1000000000000000000000000'); // 1,000,000

    // Distribute 100 Tether tokens to investor (2nd account in Ganache GUI)
    await tether.transfer(accounts[1], '100000000000000000000'); // 100 
};
