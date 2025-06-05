// MGI staking contract written in Tact for the TON blockchain
// Provides staking with referral bonuses similar to the Solidity version

// The contract expects MGI Jetton transfers with a payload starting with the op code "STAK"
// followed by the optional referrer address.
// The jetton root address is stored in mgiRoot to validate incoming tokens.

struct Stake {
    coins amount;
    int since;
}

contract MGIStaking {
    // Jetton root of the MGI token
    address static mgiRoot;

    // admin address allowed to update rates
    address owner;

    // mapping of user stakes
    map<address, Stake> stakes;

    // mapping of user to referrer
    map<address, address> referrers;

    // accumulated referral rewards per user
    map<address, coins> referralRewards;

    // percentage rewards (per year) and referral bonus
    int rewardRate;
    int referralBonus;

    // initialize contract with owner and jetton root
    init(address owner_, address mgiRoot_) {
        owner = owner_;
        mgiRoot = mgiRoot_;
        rewardRate = 10;      // 10% annual
        referralBonus = 2;    // 2% extra to referrer
    }

    // handler for jetton transfers used for staking
    receive("transfer") {
        // ensure the message comes from the token root
        require(msg.sender == mgiRoot, "invalid sender");

        // decode payload: first 32 bits are operation id
        int op = msg.body.loadUint(32);
        // only process if op == 'STAK'
        if (op == 0x5354414b) {
            address user = msg.body.loadAddress();
            address ref = msg.body.loadMaybeAddress().getOrElse(address(0));
            internalStake(user, msg.amount, ref);
        }
    }

    // internal staking logic
    func internalStake(address user, coins amount, address ref) {
        require(amount > 0, "amount zero");
        let st = stakes.get(user);
        require(st == null || st.amount == 0, "already staking");
        if (ref != address(0) && ref != user && !referrers.contains(user)) {
            referrers[user] = ref;
        }
        stakes[user] = Stake(amount, now());
    }

    // claim staking reward
    external func claim() {
        let user = msg.pubkey().addr();
        let st = stakes.get(user).expect("no stake");
        let elapsed = now() - st.since;
        let reward = st.amount * rewardRate * elapsed / (365 * 24 * 3600) / 100;
        st.since = now();
        stakes[user] = st;
        sendJetton(user, reward);
        if (referrers.contains(user)) {
            let ref = referrers[user];
            let refReward = reward * referralBonus / 100;
            referralRewards[ref] = referralRewards.get(ref, 0) + refReward;
        }
    }

    // withdraw original stake
    external func withdraw() {
        let user = msg.pubkey().addr();
        let st = stakes.get(user).expect("no stake");
        let amount = st.amount;
        require(amount > 0, "empty");
        stakes[user] = Stake(0, st.since);
        sendJetton(user, amount);
    }

    // claim accumulated referral reward
    external func claimReferralReward() {
        let user = msg.pubkey().addr();
        let reward = referralRewards.get(user, 0);
        referralRewards[user] = 0;
        sendJetton(user, reward);
    }

    // admin function to update rates
    external func updateRates(int newRate, int newBonus) {
        require(msg.pubkey().addr() == owner, "not owner");
        rewardRate = newRate;
        referralBonus = newBonus;
    }

    // helper to send jettons from this contract
    func sendJetton(address to, coins amount) {
        if (amount > 0) {
            send(mgiRoot, amount, to);
        }
    }
}

