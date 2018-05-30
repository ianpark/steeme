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
            ready: false,
            showDetail: false,
            selectedWitness: null,
            witness: null
        }
    }

    onData = (model) => {
        this.setState({witness: model},
            () => {
                let selectedWitness = model.getByAccount(this.props.account);
                this.setState({showDetail: this.props.account ? true : false,
                selectedWitness: selectedWitness});
            });
    }

    onModalClose = () => {
        this.setState({account: null, showDetail: false});
        this.props.history.push('/witness');
    }

    detailView = (account) => {
        let selectedWitness = this.state.witness.getByAccount(account);
        this.setState({showDetail: true, selectedWitness: selectedWitness});
        this.props.history.push(`/witness/${account}`);

    }

    renderRow = (witness, key) => {
        let data = this.state.witness.manipulateData(witness.owner);
        let state = data.disabled ? (data.disabledForLong ? 'negative' : 'warning') : '';
        return (
            <Table.Row key={key} className={state}>
                <Table.Cell>{data.rank}</Table.Cell>
                <Table.Cell><a href={`https://steemdb.com/@${data.account}/witness`} target="_blank">{data.account}</a>              <Icon name="search" link color="blue" onClick={() => this.detailView(data.account)} style={{cursor: 'pointer'}}/>
                {data.disabled &&
                        <Popup wide trigger={<Icon name="warning sign" color={state == 'warning' ? 'orange' : 'red'}/>}
                        content={`Inactive for ${(data.sleepingMins / 60).toFixed(1)} hours`}/>}
                </Table.Cell>
                <Table.Cell>{data.version}
                {data.version < this.state.witness.secureVersion &&
                    <Popup wide trigger={<Icon name="warning sign" color="yellow"/>}
                    content={`A version lower than ${this.state.witness.secureVersion} might have a security hole. Note that ${this.state.witness.semiSecureVersion} with full security patch is equivalant to 0.19.3, but there is no way to tell from the public if patches are applied or not.`}/>}
                </Table.Cell>
                <Table.Cell>{data.totalMissed}</Table.Cell>
                <Table.Cell>{data.receivingMVests.toFixed(0)}</Table.Cell>
                <Table.Cell>{(data.proxiedVests + data.vestingShares).toFixed(2)}</Table.Cell>
                <Table.Cell>${data.feedPrice}
                    {Math.abs(data.feedBias) > 100 &&
                        <Popup wide trigger={<Icon name="warning sign" color="yellow"/>}
                                content={`Feed is biased ${data.feedBias.toFixed(0)}%`}/>}
                </Table.Cell>
                <Table.Cell>{data.proxy}</Table.Cell>
                <Table.Cell>
                    {data.castedVote}
                    {data.votingToInactive.length > 0 &&
                        <Popup wide trigger={<Icon name="heartbeat" color="orange"/>}
                        content={`Voting to witnesses who have been inactive for more than ${this.state.witness.maxInactiveDay} days: ${data.votingToInactive.join(', ')} `}/>}
                    {data.votingToBiasedFeed.length > 0 &&
                        <Popup wide trigger={<Icon name="low vision" color="yellow"/>}
                        content={`Voting to witnesses whose feed is biased over 100%: ${data.votingToBiasedFeed.join(', ')} `}/>}
                    {data.votingToInsecureVer.length > 0 &&
                        <Popup wide trigger={<Icon name="warning sign" color="red"/>}
                        content={`Voting to witnesses whose version is lower than ${this.state.witness.semiSecureVersion} : ${data.votingToInsecureVer.join(', ')} `}/>}
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
                            <Table.HeaderCell>Version</Table.HeaderCell>
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
                    
                    {this.state.witness ? <Table.Body>{this.state.witness.witness.map((witness, key) => this.renderRow(witness, key))}</Table.Body>
                    : <Dimmer active><Loader>Loading</Loader></Dimmer>}
                    
                </Table>
                {this.state.showDetail &&
                <Modal open={this.state.showDetail} closeOnDimmerClick={true} onClose={this.onModalClose}>
                    <Modal.Header>Witness Report</Modal.Header>
                    <Modal.Content>
                        {this.state.selectedWitness ?
                            <WitnessDetail account={this.state.selectedWitness.owner}
                                            witness={this.state.witness} />
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