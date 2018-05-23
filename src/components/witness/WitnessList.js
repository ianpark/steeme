import React, {Component} from 'react';
import {withRouter} from 'react-router';
import { Segment, Table, Popup, Icon, Loader, Dimmer } from 'semantic-ui-react'
import { Button, Header, Image, Modal, Container, Label } from 'semantic-ui-react'

import { Link } from "react-router-dom";

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
        return output.sort(function(a,b){return a.rank - b.rank;});
    }

    isDisabledForLong = (account) => {
        try {
            const witness = this.state.witnesses[this.state.witnessIndex[account]];
            return witness.disabled && witness.sleepingMins > 1440;
        } catch (error) {
            return false;
        }
    }

    

    manipulateData = (witness) => {
        return {
            rank: this.getRank(witness.owner),
            account: witness.owner,
            totalMissed: witness.total_missed,
            receivingMVests: witness.votes / 1000000000000,
            feedPrice: witness.sbd_exchange_rate.base.split(' ')[0],
            proxy: witness.proxy || '-',
            castedVote: witness.witness_votes.length,
            receivedVote: witness.receiving_votes.length,
            vestingShares: witness.vestingShares,
            proxiedVests: witness.proxiedVests,
            disabled: witness.disabled,
            voteFrom: this.filterVote(witness.receiving_votes),
            voteTo: this.filterVote(witness.witness_votes)
        };
    }

    onModalClose = () => {
        this.setState({account: null, showDetail: false});
        this.props.history.push('/witness');
    }

    detailView = (account) => {
        let selectedWitness = this.state.witnesses[this.state.witnessIndex[account]]
        this.setState({showDetail: true, selectedWitness: selectedWitness});
        this.props.history.push(`/witness/${account}`);

    }

    renderRow = (witness, key) => {
        let data = this.manipulateData(witness);
        let voteToWarn = false;
        data.voteTo.forEach(x => {
            if (this.isDisabledForLong(x.account)) voteToWarn = true;
        });

        return (
            <Table.Row key={key} style={data.disabled ? {background: '#ee6070', color: '#ffffff'} :{}}>
                <Table.Cell>{data.rank}</Table.Cell>
                <Table.Cell>{data.account} <Icon name="search" link color="blue" onClick={() => this.detailView(data.account)} style={{cursor: 'pointer'}}/></Table.Cell>
                <Table.Cell>{data.totalMissed}</Table.Cell>
                <Table.Cell>{data.receivingMVests.toFixed(0)}</Table.Cell>
                <Table.Cell>{(data.proxiedVests + data.vestingShares).toFixed(2)}</Table.Cell>
                <Table.Cell>${data.feedPrice}</Table.Cell>
                <Table.Cell>{data.proxy}</Table.Cell>
                <Table.Cell>
                    {data.castedVote}
                    {voteToWarn &&
                        <Popup wide trigger={<Icon name="warning sign" color="orange"/>}
                        content="Voting to one or more disabled witnesses"/>}
                </Table.Cell>
                <Table.Cell>{data.receivedVote}</Table.Cell>
            </Table.Row>
        );
    }

    render() {
        return (
            <Container>
                <DataFetcher onData={this.onData}/>
                <Table unstackable compact="very">
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
                                Vote Leverage<br/><sup>(MVests)</sup>
                                <Popup trigger={<Icon name='info circle'/>}
                                    content="The total MVests the votee will get by a vote from this witness"/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Feed</Table.HeaderCell>
                            <Table.HeaderCell>Proxy
                                <Popup trigger={<Icon name='info circle'/>}
                                            content="The account that this witness set as a proxy. If a proxy is set, voting stat of the witness will be orverridden by proxy's stat."/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>Votes Cast </Table.HeaderCell>
                            <Table.HeaderCell>Votes Received
                                <Popup trigger={<Icon name='info circle'/>}
                                    content="Votes received from the witnesses"/>  
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    
                    {this.state.witnesses ? <Table.Body>{this.state.witnesses.map((witness, key) => this.renderRow(witness, key))}</Table.Body>
                    : <Dimmer active><Loader>Loading</Loader></Dimmer>}
                    
                </Table>
                {this.state.showDetail &&
                <Modal open={this.state.showDetail} closeOnDimmerClick={true} onClose={this.onModalClose}>
                    <Modal.Header>Witness Report</Modal.Header>
                    <Modal.Content>
                        {this.state.selectedWitness ?
                            <WitnessDetail data={this.manipulateData(this.state.selectedWitness)}
                                            witnessIndex={this.state.witnessIndex}
                                            witnesses={this.state.witnesses} />
                        :
                        "@" + this.props.account + " is not in the top 100 witnesses."
                        }
                    </Modal.Content>
                </Modal>}
            </Container>
        )
    }
}

export default withRouter(WitnessList);