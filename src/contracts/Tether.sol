pragma solidity ^0.5.0;


contract Tether {
    string public name = 'Mock Tether Token';
    string public symbold = 'mUSDT';
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens 
    uint8 public decimals = 18;
    address public owner;
   

    // set the balance 
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
       uint _value
   ); 

   event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
   );

   mapping(address => uint256) public balanceOf;
   mapping(address => mapping(address => uint256)) public allowance;


    // takes adderss and value and transfers value 
   function transfer(address _to, uint256 _value) public  returns(bool success)  {
       // require that the sender has enough money to send 
       require(balanceOf[msg.sender] >= _value);
       // remove value from sender
       balanceOf[msg.sender] -= _value;
       // add value to receiver 
       balanceOf[_to] += _value;
       // run the transfer and return it "true"
       emit Transfer(msg.sender, _to, _value);
       return true;
   }

   function approve(address _spender, uint256 _value) public returns (bool success) {
       allowance[msg.sender][_spender] = _value;
       emit Approval(msg.sender, _spender, _value);
       return true;
   }

   function transferFrom(address _from, address _to, uint256 _value)  public returns (bool success) {
       // make sure the value is less than available balance
       require(_value <= balanceOf[_from]);

       require(_value <= allowance[_from][msg.sender]);
       // add teh balance
       balanceOf[_to] += _value;
       // subtract balance
       balanceOf[_from] -= _value;
       // our allowance comes from msg.sender. 
       allowance[msg.sender][_from] -= _value;
       // emit Transfer
       emit Transfer(_from, _to, _value);
       return true;
   }
}