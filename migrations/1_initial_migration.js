const Migrations = artifacts.require('Migrations');

module.exports = function(deployer){
    // set the function to deploy 
    deployer.deploy(Migrations);
};
