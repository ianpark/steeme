var WitnessModel = {
    semiSecureVersion: '0.19.2',
    secureVersion: '0.19.3',
    maxInactiveDay: 5,
    witness: {},
    witnessIndex: {},
    buildInitialData: (witness, witnessIndex) => {
        let self = WitnessModel;
        self.witness = witness;
        self.witnessIndex = witnessIndex;
        // Generate Data
        self.witness.forEach(one => {
            one.voteFrom = self.filterVote(one.receiving_votes);
            one.voteTo = self.filterVote(one.witness_votes);
            one.disabledForLong = self.isDisabledForLong(one.owner);
            one.votingToInactive = one.voteTo.filter(x => self.isDisabledForLong(x.account)).map(x => x.account);
            one.votingToBiasedFeed = one.voteTo.filter(x => self.isBiasedFeed(x.account)).map(x => x.account);
            one.votingToInsecureVer = one.voteTo.filter(x => self.isInsecureVer(x.account)).map(x => x.account);


            // totalVoteFromWitnesses
            one.totalVoteFromWitnesses = 0;
            one.voteFrom.forEach(voter => {
                one.totalVoteFromWitnesses += self.witness[voter.rank-1].proxiedVests + self.witness[voter.rank-1].vestingShares;
            });
            one.jsonMetadata = one.accountInfo.json_metadata ? JSON.parse(one.accountInfo.json_metadata) : {}
        });

    },
    getByAccount: (account) => {
        let self = WitnessModel;
        return self.witness[self.witnessIndex[account]];
    },
    getJsonMetadata: (account) => {
        let self = WitnessModel;
        let jsonMetadata = self.getByAccount(account).accountInfo.json_metadata;
        return jsonMetadata ? JSON.parse(jsonMetadata) : {}
    },
    getCount: () => {
        return WitnessModel.witness.length;
    },
    getAccountByIndex: (idx) => {
        return WitnessModel.witness[idx].owner;
    },
    getRankByAccount: (account) => {
        let self = WitnessModel;
        try {
            return self.witnessIndex[account] + 1;
        } catch (error) {
            return null;
        }
    },
    isBiasedFeed: (account) => {
        let self = WitnessModel;
        return Math.abs(self.getByAccount(account).feedBias) > 100;
    },
    isInsecureVer: (account) => {
        let self = WitnessModel;
        return self.getByAccount(account).running_version < self.semiSecureVersion;
    },
    isDisabledForLong: (account) => {
        let self = WitnessModel;
        try {
            const witness = self.getByAccount(account);
            return witness.disabled && witness.sleepingMins > 1440 * self.maxInactiveDay;
        } catch (error) {
            return false;
        }
    },
    isDisabledByIndex: (index) => {
        let self = WitnessModel;
        return self.witness[index].disabled;
    },
    isDisabled: (account) => {
        let self = WitnessModel;
        try {
            return self.isDisabledByIndex(self.witnessIndex[account])
        } catch (error) {
            return false;
        }
    },
    filterVote: (voteList) => {
        let self = WitnessModel;
        let output = [];
        voteList.map((user) => {
            let rank = self.getRankByAccount(user);
            if (rank) {
                output.push({account: user, rank: rank})
            }
        });
        return output.sort(function(a,b){return a.rank - b.rank;});
    },
    manipulateData: (account) => {
        let self = WitnessModel;
        let witness = self.getByAccount(account);
        let summary = {
            rank: self.getRankByAccount(witness.owner),
            account: witness.owner,
            totalMissed: witness.total_missed,
            receivingMVests: witness.votes / 1000000000000,
            feedPrice: witness.priceFeed.toFixed(3),
            feedBias: witness.feedBias,
            proxy: witness.proxy || '-',
            castedVote: witness.witness_votes.length,
            receivedVote: witness.receiving_votes.length,
            vestingShares: witness.vestingShares,
            proxiedVests: witness.proxiedVests,
            disabled: witness.disabled,
            disabledForLong: witness.disabledForLong,
            sleepingMins: witness.sleepingMins,
            voteFrom: witness.voteFrom,
            voteTo: witness.voteTo,
            votingToInactive: witness.votingToInactive,
            votingToBiasedFeed: witness.votingToBiasedFeed,
            votingToInsecureVer: witness.votingToInsecureVer,
            totalVoteFromWitnesses: witness.totalVoteFromWitnesses,
            version: witness.running_version,
            jsonMetadata: witness.jsonMetadata
        };

        return summary; 
    }
};

module.exports = WitnessModel;