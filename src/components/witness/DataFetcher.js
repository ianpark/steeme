import witnessSample from 'resources/witness_sample.json';
import witnessIndex from 'resources/witness_index_sample.json';
import React, {Component} from 'react';
var steem = require('steem');

class DataFetcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            witnessIndex: null,
            witnesses: null,
            ready: false,
        }

        this.witness = null;
        this.witnessIndex = {};
        this.proxyMap = {};
    }

    componentDidMount() {
        //this.props.onData({witnesses: witnessSample, witnessIndex: witnessIndex});
        this.fetchWitnessData();
    }

    updateInformation = (account, idx) => {
        this.witness[idx].proxiedVests = account.proxied_vsf_votes.reduce((a, b) => parseInt(a) + parseInt(b)) / 1000000000000;
        this.witness[idx].vestingShares = account.vesting_shares.split(' ')[0] / 1000000;
        this.witness[idx].witness_votes = account.witness_votes;
        account.witness_votes.forEach((voteTo, idx) => {
            try {
                this.witness[this.witnessIndex[voteTo]].receiving_votes.push(account.name);
            } catch(err) {
                //console.log(err);
            }
        });
    }

    fetchWitnessData = () => {
        steem.api.getWitnessesByVoteAsync("", 100)
        .then((witnesses) => {
            this.witness = witnesses;
            this.witness.forEach((item, idx) => {
                this.witnessIndex[item.owner] = idx;
                item.receiving_votes = [];
                item.witness_votes = [];
                item.disabled = item.signing_key === "STM1111111111111111111111111111111114T1Anm"
            });
            return steem.api.getAccountsAsync(witnesses.map(a => a.owner))
        })
        .then((accounts) => {
            accounts.forEach((account, idx) => {
                this.witness[idx].accountInfo = account;
                if (account.proxy) {
                    this.witness[idx].proxy = account.proxy;
                    if (!this.proxyMap[account.proxy]) {
                        this.proxyMap[account.proxy] = []
                    }
                    this.proxyMap[account.proxy].push(account.name);
                } else {
                    this.updateInformation(account, idx);
                }
            });
            let proxies = Object.keys(this.proxyMap);
            return steem.api.getAccountsAsync(proxies);
        })
        .then((proxies) => {
            proxies.forEach((proxy) => {
                if (proxy.proxy) {
                    console.log("proxy again? sigh..");
                    
                } else {
                    this.proxyMap[proxy.name].forEach(origin => {
                        this.updateInformation(proxy, this.witnessIndex[origin]);
                    });
                }
            });
        })
        .catch((err) => {
            console.log("Failed to fetch witness data");
            console.log(err);
        })
        .done(() => {
            this.props.onData({witnesses: this.witness, witnessIndex: this.witnessIndex});
        });
    }

    render() {
        return null;
    }
}

export default DataFetcher;