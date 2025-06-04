// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract MGIStaking {
    IERC20 public mgiToken;
    address public owner;

    struct Stake {
        uint256 amount;
        uint256 since;
    }

    mapping(address => Stake) public stakes;
    mapping(address => address) public referrer;
    mapping(address => uint256) public referralRewards;

    uint256 public rewardRate = 10; // 10% anual
    uint256 public referralBonus = 2; // 2% extra al referidor

    constructor(address _tokenAddress) {
        mgiToken = IERC20(_tokenAddress);
        owner = msg.sender;
    }

    function stake(uint256 _amount, address _referrer) external {
        require(_amount > 0, "Amount must be > 0");
        require(stakes[msg.sender].amount == 0, "Already staking");

        if (_referrer != address(0) && _referrer != msg.sender && referrer[msg.sender] == address(0)) {
            referrer[msg.sender] = _referrer;
        }

        require(mgiToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        stakes[msg.sender] = Stake(_amount, block.timestamp);
    }

    function claim() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No active stake");

        uint256 reward = (userStake.amount * rewardRate * (block.timestamp - userStake.since)) / (365 days * 100);
        userStake.since = block.timestamp;

        require(mgiToken.transfer(msg.sender, reward), "Transfer failed");

        if (referrer[msg.sender] != address(0)) {
            uint256 refReward = (reward * referralBonus) / 100;
            referralRewards[referrer[msg.sender]] += refReward;
        }
    }

    function withdraw() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "Nothing to withdraw");

        uint256 amount = userStake.amount;
        userStake.amount = 0;

        require(mgiToken.transfer(msg.sender, amount), "Transfer failed");
    }

    function claimReferralReward() external {
        uint256 reward = referralRewards[msg.sender];
        referralRewards[msg.sender] = 0;
        require(mgiToken.transfer(msg.sender, reward), "Transfer failed");
    }

    function updateRates(uint256 _rewardRate, uint256 _refBonus) external {
        require(msg.sender == owner, "Not owner");
        rewardRate = _rewardRate;
        referralBonus = _refBonus;
    }
}
