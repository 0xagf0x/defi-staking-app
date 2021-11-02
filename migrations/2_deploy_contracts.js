const Tether = artifacts.require('Tether');

module.exports = async function(deployer){
    // set the function to deploy 
    await deployer.deploy(Tether);
};
