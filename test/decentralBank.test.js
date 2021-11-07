// to run this test: truffle test

const { assert } = require('chai');
const DecentralBank = artifacts.require('DecentralBank');
const Reward = artifacts.require('Reward');
const Tether = artifacts.require('Tether');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, reward, decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    } 

    before(async () => {
        // load Contracts
        tether = await Tether.new();
        reward = await Reward.new();
        decentralBank = await DecentralBank.new(reward.address, tether.address);

        // check to see we transfer all Reward tokens to the DecentralBank (1 million)
        await reward.transfer(decentralBank.address, tokens('1000000'))

        // check for transfer of 100 tokens from Bank -> Investor 
        await tether.transfer(customer, tokens('100'), {from: owner})
    });
    
    describe('Mock Tether Deployment', async() => { //first test: run assertion to check we have successful name matching
        it('matches name successfully', async() => { // allows us to bring in a description 
            const name = await tether.name();
            assert.equal(name,'Mock Tether Token') // runs the logic for the test itself 
        })
    });

    describe('Reward Token', async() => { 
        it('matches name successfully', async() => { 
            const name = await reward.name();
            assert.equal(name,'Reward Token') 
        });

        it('matches symbol successfully', async() => { 
            const symbol = await reward.symbold();
            assert.equal(symbol,'RWD')
        });
    });


    describe('DecentralBank', async() => { 
        it('matches name successfully', async() => {
            const name = await decentralBank.name();
            assert.equal(name,'Decentral Bank') 
        });

        it('contract has tokens available', async() => {
           // check to see if Reward tokens are present 
           let balance = await reward.balanceOf(decentralBank.address);
           assert.equal(balance, tokens('1000000')) 
        });
    });



    describe('Yield Farming', async() => { 
        it('rewards tokens for staking', async() => {
            //check investor balance
            let result
            result = await tether.balanceOf(customer);
            // should equal "100" (the amount they were sent from deployment)
            assert.equal(result.toString(), tokens('100'), 'customer wallet balance before staking')

            // Check staking for customer
            // send out the approval (send to decentralBank, from the customer)
            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            // after ^ has been approved, we can deposit tokens to the decentralBank from our customer 
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            // Check updated balance of customer 
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'), 'customer wallet balance after staking 100 tokens')

            // Check updated balance of bank 
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('100'), 'decentral bank wallet balance after staking from customer')

            // isStaking balance
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'true', 'customer is staking status after staking')


            // Issue Tokens 
            await decentralBank.issueTokens({from: owner})

            // check that only the owner can issue tokens 
            await decentralBank.issueTokens({from: customer}).should.be.rejected;

            // Check that we can unstake tokens
            await decentralBank.untakeTokens({from: customer})

            //! after unstaking there should be 100 tokens retured to customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer wallet balance after unstaking 100 tokens')

            // Check updated balance of bank 
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('0'), 'decentral bank wallet balance after unstaking from customer')

            // isStaking should be false 
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'false', 'customer is NOT staking anymore')
        })
    });

   
})