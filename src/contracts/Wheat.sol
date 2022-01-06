// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Wheat is ERC20, ERC20Burnable {
  // Farm
  address public minter = 0x6e5Fa679211d7F6b54e14E187D34bA547c5d3fe0;
  
  struct Planted {
      uint plantedAt;
      uint amount;
  }

  mapping(address => uint) plantedAt;
  mapping(address => uint) plantedAmount;

  event MinterChanged(address indexed from, address to);

  constructor() payable ERC20("Sunflower Farmers Wheat", "SFW") {}
  
  function burn(address account, uint256 amount) public {
    require(msg.sender == minter, "You are not the minter");
	  _burn(account, amount);
  }
  
    
    function stake(address account, uint amount) public {
        require(msg.sender == minter, "You are not the minter");

        // Harvest any available wheat
        if (plantedAmount[account] > 0) {
            // It is actually ERC721 but same principle
            uint scarecrow = ERC20(0x143Ba32499065b5F89c518d5B75a38F3529cE324).balanceOf(account);
            // 36 hours
            uint timeToWait = 60 * 60 * 36;

            if (scarecrow > 0) {
                // 12 hours
                timeToWait = 60 * 60 * 12;
            }

            require(plantedAt[account] + timeToWait < block.timestamp, "Wheat is not ready");

            _mint(account, plantedAmount[account]);
            plantedAmount[account] = 0;
            plantedAt[account] = 0;
        }

        // Plant if there are available fields
        if (amount > 0) {
            // Max 3 
            require(amount <= 3 * 10**18, "Only 3 seeds can be planted");

            plantedAmount[account] = amount;
            plantedAt[account] = block.timestamp;
        }
    }

    function getPlanted(address account) public view returns (Planted memory) {
        return Planted({
            plantedAt: plantedAt[account],
            amount: plantedAt[account]
        });
    }
}
