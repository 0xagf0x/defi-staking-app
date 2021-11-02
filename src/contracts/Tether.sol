pragma solidity ^0.5.0;


contract Tether {
    address public owner;
    uint last_completed_migration;

   constructor() public {
        owner = msg.sender;
   }

   modifier onlyOwner() {
       if (msg.sender == owner) _;  // if the sender is the owner, then continue;
   }

}