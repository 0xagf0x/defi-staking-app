pragma solidity ^0.5.0;


contract Tether {
    string public name = 'Tether';
    string public symbold = 'USDT';
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens 
    uint8 public decimals = 18;
    address public owner;
   

   constructor() public {
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
   }

   modifier onlyOwner() {
       if (msg.sender == owner) _;  // if the sender is the owner, then continue;
   }

   event Transfer(
       address indexed _from,
       address indexed _to,
       uint _value,
   ); 

   event Approve(
        address indexed _owner,
        address indexed _spender,
        uint _value,
   );

   mapping(address => uint) public balanceOf;


   function transfer(address _to, uint _value) public  returns(bool success)  {
       // require that the sender has enough money to send 
       require(balanceOf[msg.sender] >= _value)
       // remove value from sender
       balanceOf[msg.sender] -= _value;
       // add value to receiver 
       balanceOf[_to] += _value;
       // run the transfer and return it "true"
       emit Transfer(_from, _to, _value);
       return true;
   }
}