import React, {Component} from 'react';
import { Segment, Table, Popup, Icon, Loader, Dimmer } from 'semantic-ui-react'

import DataFetcher from './DataFetcher';

class WitnessList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            witnessIndex: null,
            witnesses: null,
            ready: false,
        }
    }

    onData = ({witnesses, witnessIndex}) => {
        console.log(witnesses);
        console.log(witnessIndex);
        this.setState({witnesses: witnesses, witnessIndex: witnessIndex});
    }

    render() {
        return (
            <div>
                <DataFetcher onData={this.onData}/>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Witness</Table.HeaderCell>
                            <Table.HeaderCell>Missed Blocks</Table.HeaderCell>
                            <Table.HeaderCell>Receiving Votes<br/><sup>(MVests)</sup></Table.HeaderCell>
                            <Table.HeaderCell>Feed</Table.HeaderCell>
                            <Table.HeaderCell>Proxy</Table.HeaderCell>
                            <Table.HeaderCell>Witness Vote</Table.HeaderCell>
                            <Table.HeaderCell>Voting to top 20 {" "}
                                <Popup trigger={<Icon name='info circle'/>}
                                    content="Number of the witness votes casted to the top 20 witnesses"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Voting from top 20 {" "}
                                <Popup trigger={<Icon name='info circle'/>}
                                    content="Number of the witness votes received from the top 20 witnesses"/>  
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.witnesses ? this.state.witnesses.map((witness, key) =>
                    <WitnessDetail key={key} witness={witness} witnessIndex={this.state.witnessIndex}/>)
                    : <Dimmer active><Loader>Loading</Loader></Dimmer>}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}

class WitnessDetail extends React.Component {
    constructor(props) {
        super(props);
        this.getRank = this.getRank.bind(this);
        this.state = {
            account: this.props.witness.owner,
            rank: this.getRank(this.props.witness.owner),
            chartId: "chart_" + this.props.witness.owner,
            voteFrom: this.filterVote(this.props.witness.receiving_votes),
            voteTo: this.filterVote(this.props.witness.witness_votes)
        };
    }

    getRank(account) {
        try {
            return this.props.witnessIndex[account] + 1;
        } catch (error) {
            return null;
        }
    }

    filterVote(voteList) {
        let output = [];
        voteList.map((user) => {
            let rank = this.getRank(user);
            if (rank) {
                output.push({account: user, rank: rank})
            }
        });
        return output.sort(function(a,b){return a.rank >b.rank;});
    }

    getTopXCount = (items, x) => {
        let voteCount = items.filter(item => item.rank <= x).length;
        return {count: voteCount, ratio: voteCount ? (voteCount / items.length * 100) : 0}
    }
    

    render() {
        const {chartId, account, rank} = this.state;
        let voteToTop20 = this.getTopXCount(this.state.voteTo, 20);
        let voteFromTop20 = this.getTopXCount(this.state.voteFrom, 20);
        return (
            <Table.Row>
                <Table.Cell>{rank}</Table.Cell>
                <Table.Cell>{account}</Table.Cell>
                <Table.Cell>{this.props.witness.total_missed}</Table.Cell>
                <Table.Cell>{(this.props.witness.votes / 1000000000000).toFixed()}</Table.Cell>
                <Table.Cell>${this.props.witness.sbd_exchange_rate.base.split(' ')[0]}</Table.Cell>
                <Table.Cell>{this.props.witness.proxy || '-' }</Table.Cell>
                <Table.Cell>{this.props.witness.witness_votes.length}</Table.Cell>
                <Table.Cell>{voteToTop20.count} ({voteToTop20.ratio.toFixed(0)}%)</Table.Cell>
                <Table.Cell>{voteFromTop20.count} ({voteFromTop20.ratio.toFixed(0)}%)</Table.Cell>
            </Table.Row>);
    }
}

export default WitnessList;