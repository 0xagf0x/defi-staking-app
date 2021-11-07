pragma solidity ^0.5.0;

import './Reward.sol';
import './Tether.sol';


contract DecentralBank {
    address public owner;
    string public name = "Decentral Bank";
    Tether public tether;
    Reward public reward;
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(Reward _reward, Tether _tether) public {
        reward = _reward;
        tether = _tether;
        owner = msg.sender;
    }


    // function for depositing the Staking 
    function depositTokens(uint _amount) public {
        // require the staking amount to be great than 0
        require(_amount > 0, 'amount cannot be 0');

        // transfer Tether tokens to this contract address for staking 
        tether.transferFrom(msg.sender, address(this), _amount); // to, from, value

        //update stakingbalance
        stakingBalance[msg.sender] += _amount;

        // if not staked, add their address to the Stakers list/array
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //Update staking balance 
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // issue rewards
    function issueTokens() public {
        // only owner can call 
        require(msg.sender == owner, 'the caller must be the owner');

        // loop through stakers array
        for (uint i =0; i < stakers.length; i ++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9;  // divide by 9 to create perfectage incentive for Staker

            // if balance is greater than 0
            if (balance > 0) {
                //transfer tokens
                reward.transfer(recipient, balance);
            }
        }        
    }


    // handles withdrawing from Staking  
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        // require the amount to be greater than zero
        require(balance > 0, 'staking balance cannot be less than zero');

        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update Staking Status
        isStaking[msg.sender] = false;
    }

}