// hooks up to Ganache GUI network with the Network ID and RPC Server #

// bring in Babel 
require('babel-register');
require('babel-polyfill');

// export modules 
module.exports = {
    network: {
        development: {
            host: '127.0.0.1:7545',
            port: '7545', // should match the last digits of the host 
            network_id: '*', // connect to any network
        },
    },
    contracts_dir: './src/contracts',
    contracts_build_dir: './src/truffle_abis',
    compilers: {
        solc: {
            version: '^0.5.0', // anything over 0.5.0
            optimizer: {
                enabled: true,
                runs: 200,
            }
        }
    }
}