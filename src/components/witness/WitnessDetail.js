import React, { Component } from 'react';
import { Label, Statistic, Message, Divider, Icon, Table } from 'semantic-ui-react';
import {Doughnut, Bar } from 'react-chartjs-2';
import { Grid, Image } from 'semantic-ui-react';

const Colors = {
    top20: '#00ace6',
    rest: '#bfbfbf',
    disabled: '#ff8080'
}

class WitnessDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ...this.props.data, 
                voteToTop20: this.getTopXCount(this.props.data.voteTo, 20),
                voteFromTop20: this.getTopXCount(this.props.data.voteFrom, 20),
                voteToTop30: this.getTopXCount(this.props.data.voteTo, 30),
                voteFromTop30: this.getTopXCount(this.props.data.voteFrom, 30)
            }
        };
    }

    isDisabled = (account) => {
        try {
            return this.isDisabledByIndex(this.props.witnessIndex[account])
        } catch (error) {
            return false;
        }
    }

    isDisabledByIndex = (index) => {
        return this.props.witnesses[index].disabled;
    }

    getTopXCount = (items, x) => {
        let voteCount = items.filter(item => item.rank <= x).length;
        return {count: voteCount, ratio: voteCount ? (voteCount / items.length * 100) : 0}
    }


    witnessVoteWeight = () => {
        let total = 0;
        this.state.data.voteFrom.forEach(voter => {
            total += this.props.witnesses[voter.rank-1].proxiedVests + this.props.witnesses[voter.rank-1].vestingShares;
        });
        return total;
    }

    renderVoteList = (vostList) => {
        return vostList.map(x => {
            let isDisabled = this.isDisabled(x.account);
            return <Label style={{
                    marginBottom: '2px',
                    color: 'white',
                    background: isDisabled ? Colors.disabled: (x.rank <= 20)? Colors.top20: Colors.rest}
            }>{x.account}</Label>
        });
    }

    renderVoteChart = (vostList) => {
        let count = this.props.witnesses.length;
        let inputData = new Array(count).fill(0);
        vostList.forEach(vote => inputData[vote.rank-1] = 1)
        const data = {
            labels: [...Array(count).keys()].map(k => k+1),
            datasets: [
              {
                label: 'Votes to witness',
                backgroundColor: inputData.map((value, key) =>
                    this.isDisabledByIndex(key) ? Colors.disabled : (key < 20) ? Colors.top20 : Colors.rest),
                borderWidth: 0,
                data: inputData
              }
            ]
          };
        const options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    display: false,
                }],
                xAxes: [{
                    gridLines: {
                        display:false
                    }
                }],
            },
            tooltips: {
                callbacks: {
                    title: (arr, data) => {
                        return "";
                    },
                    label: (i, data) => {
                        let witness = this.props.witnesses[i.index];
                        return `${witness.owner} (rank:${i.index+1})`;
                    }
                }
            },
            legend: {
                display: false
            }
        }
        return <div style={{height: '200px'}}><Bar
                data={data}
                width={100}
                options={options}
            /></div>
    }

    renderVotePie = (labels, input) => {
        const data = {
            labels: labels,
            datasets: [
              {
                backgroundColor: [ '#00ace6', '#bfbfbf' ],
                data: input.map(v => v.toFixed(0))
              }
            ]
          };
        const options = {
            maintainAspectRatio: false,
        }
        return <div style={{height: '250px', width: '200px', display: 'inline-block'}}><Doughnut
                data={data}
                options={options}
            /></div>
    }

    renderProfile = () => {
        const data = this.state.data;
        const account = data.account;
        const accountData = this.props.witnesses[this.props.witnessIndex[account]];
        const accountInfo = accountData.accountInfo
        const profile = accountInfo.json_metadata ? JSON.parse(accountInfo.json_metadata).profile : null;

        return profile ?
            <Grid>
                <Grid.Column width={4}>
                    <Image rounded src={`https://steemitimages.com/0x0/${profile.profile_image}`} verticalAlign='top' />
                </Grid.Column>
                <Grid.Column width={9}>
                    <h1>{profile.name} (@{account})</h1>
                    <h4>{profile.about}</h4>
                    <p><Icon name='home'/> {profile.location}</p>
                    <p><Icon name='linkify'/>{profile.website}</p>
                </Grid.Column>
            </Grid>
            :
            <Message warning header={`@${account} has no account profile.`}
                    content='It is not a mandatory thing for a witness to set up their profile, however self-explanatory account profile is a definitely very good way to respect the Steemians.'/>
    }

    renderWitnessStatus = () => {
        const data = this.state.data;
        const account = data.account;
        const accountData = this.props.witnesses[this.props.witnessIndex[account]];
        const witnessStatus = [
            {name: 'Last Block', content: accountData.last_confirmed_block_num},
            {name: 'Running Version', content: accountData.running_version},
            {name: 'Signing Key', content: accountData.signing_key},
            {name: 'Total Missed', content: accountData.total_missed},
            {name: 'Price Feed', content: accountData.sbd_exchange_rate.base},
            {name: 'Link', content: accountData.url}
        ]
        return (
            <Table celled striped collapsing>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='2'>Witness Status</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                    {witnessStatus.map((item, key) =>
                    <Table.Row key={key}>
                        <Table.Cell><h4>{item.name}</h4></Table.Cell><Table.Cell>{item.content}</Table.Cell>
                    </Table.Row>
                    )}
                </Table.Body>
            </Table>
        )
    }

    render() {
        const data = this.state.data;
        const voteFromWitnesses = this.witnessVoteWeight();
        return (
            <div>
                {this.renderProfile()}
                <Divider hidden/>
                <Grid divided='vertically'>
                    <Grid.Row columns={1}>
                        <Grid.Column textAlign="center">
                            {this.renderWitnessStatus()}
                        </Grid.Column>
                    </Grid.Row>
                    <h2>Witness Update</h2>
                    <Grid.Row columns={1}>
                        <Grid.Column>To be implemented
                        </Grid.Column>
                    </Grid.Row>
                    <h2>Projects / Activities</h2>
                    <Grid.Row columns={1}>
                        <Grid.Column>To be implemented
                        </Grid.Column>
                    </Grid.Row>
                    <h2>Inter-Witness Voting Trend</h2>
                    <Grid.Row columns={3}>
                        <Grid.Column textAlign="center">
                            {this.renderVotePie(['To top 20 witnesses', 'other witnesses'], [data.voteToTop20.count, data.castedVote - data.voteToTop20.count])}<br/>
                            <Statistic size='tiny' color="grey">
                                <Statistic.Value>{`${data.voteToTop20.count} / ${data.castedVote}`}</Statistic.Value>
                                <Statistic.Label>To Top 20 / Total</Statistic.Label>
                            </Statistic>
                            <Statistic size='tiny' color="grey">
                                <Statistic.Value>{data.voteToTop20.ratio.toFixed(0)}%</Statistic.Value>
                                <Statistic.Label>Percentage</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderVotePie(['From top 20 witnesses', 'others witnesses'], [data.voteFromTop20.count, data.voteFrom.length - data.voteFromTop20.count])}<br/>
                            <Statistic size='tiny' color="grey">
                                <Statistic.Value>{`${data.voteFromTop20.count} / ${data.voteFrom.length}`}</Statistic.Value>
                                <Statistic.Label>From Top 20 / Total</Statistic.Label>
                            </Statistic>
                            <Statistic size='tiny' color="grey">
                                <Statistic.Value>{data.voteFromTop20.ratio.toFixed(0)}%</Statistic.Value>
                                <Statistic.Label>Percentage</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            {this.renderVotePie(['From witnesses', 'From non-witness'], [voteFromWitnesses, data.receivingMVests - voteFromWitnesses])}<br/>
                            <Statistic  size='mini' color="grey">
                                <Statistic.Value>{`${voteFromWitnesses.toFixed(0)} / ${data.receivingMVests.toFixed(0)} MVests`}</Statistic.Value>
                                <Statistic.Label>From Witness / Total </Statistic.Label>
                            </Statistic>
                            <Statistic  size='mini' color="grey">
                                <Statistic.Value>{(voteFromWitnesses/data.receivingMVests*100).toFixed(0)}%</Statistic.Value>
                                <Statistic.Label>Percentage</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                    </Grid.Row>
                    <h2>Witness Votes Cast</h2>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                        {this.renderVoteChart(data.voteTo)}
                        {this.renderVoteList(data.voteTo)}
                        </Grid.Column>
                    </Grid.Row>
                    <h2>Received Witness Vote from Witnesses</h2>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                        {this.renderVoteChart(data.voteFrom)}
                        {this.renderVoteList(data.voteFrom)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default WitnessDetail;