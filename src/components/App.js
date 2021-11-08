// to run: npm run start

import React, {Component} from 'react';
import Navabr from './Navbar';
import Main from './Main';
import './App.css';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import Reward from '../truffle_abis/Reward.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import ParticleSettings from './ParticleSettings';


class App extends Component {

    async UNSAFE_componentWillMount() { // runs when app mounts in browser
        await this.loadWeb3();  // run the loadWeb3 function + connect to metamask
        await this.loadBlockchainData(); // load blockchain data 
    }

    // load in web3 and connect metamask when the app loads 
    async loadWeb3() { 
        if(window.ethererum) { // if the browser window detects Ethereum
            window.web3 = new Web3(window.ethererum)  // emable new instance
            await window.ethereum.enable();  // wait for it to enable
        } else if (window.web3) { // or if we detect web3 in the browser
            window.web3 = new Web3(window.web3.currentProvider) // enable current provider 
            await window.web3.currentProvider.enable();  // wait for it to enable
        } else {
            window.alert('No ethereum browser detected. Metamask ');
        }
    }

    // load in blockchain data 
    async loadBlockchainData() {
        const web3 = await window.web3;
        const account = await web3.eth.getAccounts(); // get the account from our blockchain data 

        this.setState({ account: account[0] });
        console.log(account); // 0x6021e2c50B7Ff151EDb143e60DDf52358a33689B

        // set up network ID that we can connect to Tether contract
        const networkID = await web3.eth.net.getId();
        console.log(networkID) // 5777

        // load Tether Contract
        const tetherData = Tether.networks[networkID];
        if (tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)  // ABI + Address 
            this.setState({ tether });
            // load Tether balance
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({ tetherBalance: tetherBalance.toString() });  // set to the state of tether.balance{}
            console.log({balance: tetherBalance}, 'tether balance')
        } else { // if we dont load tether data
            alert('Error! Tether contract data not available. Consider changing to the Ganache network.')
        }
        
        
        // load Reward token Contract
        const rewardData = Reward.networks[networkID];
        if (rewardData) {
            const reward = new web3.eth.Contract(Reward.abi, rewardData.address)  // ABI + Address 
            this.setState({ reward });
            // load Tether balance
            let rewardBalance = await reward.methods.balanceOf(this.state.account).call();
            this.setState({ rewardBalance: rewardBalance.toString() }); 
            console.log({balance: rewardBalance})
        } else { 
            alert('Error! Reward contract data not available. Consider changing to the Ganache network.')
        }

        // load Decentral Bank Contract
        const decentralBankData = DecentralBank.networks[networkID];
        if (decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)  
            this.setState({ decentralBank });
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({ stakingBalance: stakingBalance.toString() });  
            console.log({balance: stakingBalance})
        } else { 
            alert('Error! Decentral Bank contract data not available. Consider changing to the Ganache network.')
        }

        this.setState({loading: false });
    }

    // two functions - one that stakes and one that Unstakes
    // use the DecentralBank contract - deposit tokens and unstaking 
    // ALL of this is for the staking: 
    // depositTones transferFrom ....
    // funciton approve transaction hash 
    // Staking Function ?? >> decentralBank.depositTokens(send transactionHash => )

    // staking function 
    stakeTokens = (amount) => {
        let ethAmount = Web3.utils.fromWei(amount, 'ether');
        this.setState({loading: true});
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            // grab decentralBank and then grab depositTokens()....send from the state of Account....
            this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
                this.setState({loading: false});
            })
        })
    }

    unstakeTokens = () => {
        this.setState({loading: true })
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
          this.setState({loading:false})
        }) 
    }

    
    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            reward: {},
            decentralBank: {},
            tetherBalance: '0',
            rewardBalance: '0',
            stakingBalance: '0',
            loading: true,
        }
    }

    // our React code 
    render () {
        let content;
        {this.state.loading ? 
            content = <p id="loader" className="text-center" style={{margin: '30px'}}>Loading...</p> 
            :content = <Main 
                tetherBalance = {this.state.tetherBalance}
                rewardBalance = {this.state.rewardBalance}
                stakingBalance = {this.state.stakingBalance}
                stakeTokens = {this.stakeTokens}
                unstakeTokens={this.unstakeTokens}
            />}
            

            return (
            <div className="App" style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    <ParticleSettings />
                </div>
                <Navabr account={this.state.account} />
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px', minHeight: '100vm'}}>
                            <div>
                               {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}


export default App