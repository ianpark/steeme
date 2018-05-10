import React, {Component} from 'react';
import { Segment, Table, Popup, Icon, Loader, Dimmer } from 'semantic-ui-react'
import { Button, Header, Image, Modal, Container, Label } from 'semantic-ui-react'

import DataFetcher from './DataFetcher';
import WitnessDetail from './WitnessDetail';


class WitnessList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            witnessIndex: null,
            witnesses: null,
            ready: false,
            showDetail: false,
            selectedWitness: null
        }
    }

    onData = ({witnesses, witnessIndex}) => {
        this.setState({witnesses: witnesses, witnessIndex: witnessIndex},
            () => {
                let selectedWitness = witnesses[witnessIndex[this.props.account]]
                this.setState({showDetail: this.props.account ? true : false,
                selectedWitness: selectedWitness});
            });
    }

    getRank(account) {
        try {
            return this.state.witnessIndex[account] + 1;
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
        return output.sort(function(a,b){return a.rank > b.rank;});
    }

    getTopXCount = (items, x) => {
        let voteCount = items.filter(item => item.rank <= x).length;
        return {count: voteCount, ratio: voteCount ? (voteCount / items.length * 100) : 0}
    }

    isDisabled = (account) => {
        try {
            return this.state.witnesses[this.state.witnessIndex[account]].disabled;
        } catch (error) {
            return false;
        }
    }

    manipulateData = (witness) => {
        let voteFrom = this.filterVote(witness.receiving_votes);
        let voteTo = this.filterVote(witness.witness_votes);

        return {
            rank: this.getRank(witness.owner),
            account: witness.owner,
            totalMissed: witness.total_missed,
            receivingMVests: witness.votes / 1000000000000,
            feedPrice: witness.sbd_exchange_rate.base.split(' ')[0],
            proxy: witness.proxy || '-',
            castedVote: witness.witness_votes.length,
            voteToTop20: this.getTopXCount(voteTo, 20),
            voteFromTop20: this.getTopXCount(voteFrom, 20),
            vestingShares: witness.vestingShares,
            proxiedVests: witness.proxiedVests,
            disabled: witness.disabled,
            voteFrom: witness.receiving_votes,
            voteTo: witness.witness_votes
        };
    }

    onModalClose = () => {
        this.setState({account: null, showDetail: false});
    }

    renderRow = (witness) => {
        let data = this.manipulateData(witness);
        let voteToWarn = false;
        let voteTo = data.voteTo.map(x => {
            let isDisabled = this.isDisabled(x);
            if (isDisabled) voteToWarn = true;
            return <Label color={isDisabled ? 'red': 'white'} style={{marginBottom: '2px'}}>{x}</Label>
        });

        let voteFrom = data.voteFrom.map(x => {
            return <Label style={{marginBottom: '2px'}}>{x}</Label>
        });

        return (
            <Table.Row style={data.disabled ? {background: '#b05060', color: '#ffffff'} :{}}>
                <Table.Cell>{data.rank}</Table.Cell>
                <Table.Cell>{data.account}</Table.Cell>
                <Table.Cell>{data.totalMissed}</Table.Cell>
                <Table.Cell>{data.receivingMVests.toFixed(0)}</Table.Cell>
                <Table.Cell>{(data.proxiedVests + data.vestingShares).toFixed(2)}</Table.Cell>
                <Table.Cell>${data.feedPrice}</Table.Cell>
                <Table.Cell>{data.proxy}</Table.Cell>
                <Table.Cell style={voteToWarn ? {background: 'orange', color: '#ffffff'}:{}}>
                    <Popup wide trigger={<span>{data.castedVote} / {data.voteToTop20.count} ({data.voteToTop20.ratio.toFixed(0)}%)</span>}
                            content={voteTo}/>
                </Table.Cell>
                <Table.Cell>
                    <Popup wide trigger={<span>{data.voteFrom.length} / {data.voteFromTop20.count} ({data.voteFromTop20.ratio.toFixed(0)}%)</span>}
                                        content={voteFrom}/>
                </Table.Cell>
            </Table.Row>
        );
    }

    render() {
        return (
            <Container>
                <DataFetcher onData={this.onData}/>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Witness</Table.HeaderCell>
                            <Table.HeaderCell>Missed<br/>Blocks</Table.HeaderCell>
                            <Table.HeaderCell>Receiving<br/>Votes<br/><sup>(MVests)</sup>
                                <Popup trigger={<Icon name='info circle'/>}
                                        content="The total MVests that this witness is receiving"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Worth of a Vote<br/><sup>(MVests)</sup>
                                <Popup trigger={<Icon name='info circle'/>}
                                    content="The total MVests the votee will get by a vote from this witness"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Feed</Table.HeaderCell>
                            <Table.HeaderCell>Proxy
                                <Popup trigger={<Icon name='info circle'/>}
                                            content="The account that this witness set as a proxy. If a proxy is set, voting stat of the witness will be orverridden by proxy's stat."/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Vote to Witness<br/>/ To top 20
                                <Popup trigger={<Icon name='info circle'/>}
                                    content="Number of the witness votes casted to the top 20 witnesses"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Vote from Witness<br/>/ From top 20
                                <Popup trigger={<Icon name='info circle'/>}
                                    content="Number of the witness votes received from the top 20 witnesses"/>  
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {this.state.witnesses ? this.state.witnesses.map((witness) => this.renderRow(witness))
                    : <Dimmer active><Loader>Loading</Loader></Dimmer>}
                    </Table.Body>
                </Table>
                {this.state.showDetail &&
                <Modal open={this.state.showDetail} closeOnDimmerClick={true} onClose={this.onModalClose}>
                    <Modal.Header>Detail</Modal.Header>
                    <Modal.Content>
                        {this.state.selectedWitness ?
                            <WitnessDetail data={this.manipulateData(this.state.selectedWitness)} />
                        :
                        "@" + this.props.account + " is not in the top 100 witnesses."
                        }
                    </Modal.Content>
                </Modal>}
            </Container>
        )
    }
}

export default WitnessList;