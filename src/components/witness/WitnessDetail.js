import React, { Component } from 'react';
import { Label, Statistic, Message, Divider, Icon, Table, Img, Segment } from 'semantic-ui-react';
import {Doughnut, Bar } from 'react-chartjs-2';
import { Grid, Image } from 'semantic-ui-react';
import paragraph from'./paragraph.png';

let steem = require('steem');

const Colors = {
    top20: '#00ace6',
    rest: '#bfbfbf',
    disabled: '#ff8080'
}

let oneMonthEarlier = () => {
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toJSON().substring(0,19);
}

class WitnessDetail extends Component {
    constructor(props) {
        super(props);
        let data = this.props.witness.manipulateData(this.props.account);
        this.state = {
            data: {
                ...data, 
                voteToTop20: this.getTopXCount(data.voteTo, 20),
                voteFromTop20: this.getTopXCount(data.voteFrom, 20),
                voteToTop30: this.getTopXCount(data.voteTo, 30),
                voteFromTop30: this.getTopXCount(data.voteFrom, 30)
            },
            articles: null
        };

        this.witnessUpdates = [];
        this.witnessCategory = [];
        this.lastItem = null;
    }

    componentDidMount() {
        this.collectWitnessUpdate();
    }

    getRealAccount = () => {

    }

    collectWitnessUpdate = () => {
        const READSIZE = 15;
        let permLink = this.lastItem ? this.lastItem.permlink : '';
        let timeStamp = '2030-01-01T00:00:00';
        steem.api.getDiscussionsByAuthorBeforeDateAsync(this.props.account, permLink, timeStamp, READSIZE)
        .then(result => {
            for (let i = this.lastItem ? 1 : 0 ; i < result.length ; ++i) {
                let item = result[i];
                if (item.created < oneMonthEarlier()) break;

                let title = item.root_title.toLowerCase();
                if (title.includes('witness') && (title.includes('update') || title.includes('log'))) {
                    this.witnessUpdates.push(item);
                } else {
                    // collect witness-category articles except for witness upates
                    let json_metadata = JSON.parse(item.json_metadata);
                    if (json_metadata.tags.includes('witness-category')) {
                        this.witnessCategory.push(item);
                    }
                }
            };
            this.lastItem = result[result.length-1];
            if (result.length < READSIZE || this.lastItem.created < oneMonthEarlier()) {
                // Collected all
                this.setState(
                    {articles: {witnessUpdate: this.witnessUpdates, witnessCategory: this.witnessCategory}});
            } else {
                this.collectWitnessUpdate();
            }
        });
    }

    getTopXCount = (items, x) => {
        let voteCount = items.filter(item => item.rank <= x).length;
        return {count: voteCount, ratio: voteCount ? (voteCount / items.length * 100) : 0}
    }


    renderSteemitLink = (permlink, title) => {
        return <a href={`https://steemit.com/@${this.props.account}/${permlink}`} target="_blank">{title}</a>
    }

    renderVoteList = (vostList) => {
        return vostList.map(x => {
            let isDisabled = this.props.witness.isDisabled(x.account);
            return <Label style={{
                    marginBottom: '2px',
                    color: 'white',
                    background: isDisabled ? Colors.disabled: (x.rank <= 20)? Colors.top20: Colors.rest}
            }>{x.account}</Label>
        });
    }

    renderVoteChart = (vostList) => {
        let count = this.props.witness.getCount();
        let inputData = new Array(count).fill(0);
        vostList.forEach(vote => inputData[vote.rank-1] = 1)
        const data = {
            labels: [...Array(count).keys()].map(k => k+1),
            datasets: [
              {
                label: 'Votes to witness',
                backgroundColor: inputData.map((value, key) =>
                    this.props.witness.isDisabledByIndex(key) ? Colors.disabled : (key < 20) ? Colors.top20 : Colors.rest),
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
                        let owner = this.props.witness.getAccountByIndex(i.index);
                        return `${owner} (rank:${i.index+1})`;
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
        const accountData = this.props.witness.getByAccount(account);
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
        const accountData = this.props.witness.getByAccount(account);
        const witnessStatus = [
            {name: 'Last Block', content: accountData.last_confirmed_block_num},
            {name: 'Running Version', content: accountData.running_version},
            {name: 'Signing Key', content: accountData.signing_key},
            {name: 'Total Missed', content: accountData.total_missed},
            {name: 'Price Feed', content: `$${accountData.priceFeed.toFixed(3)} derived from ${JSON.stringify(accountData.sbd_exchange_rate)}`},
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

    renderWitnessUpdate = () => {
        if (!this.state.articles) {
            return <Segment loading><Image src={paragraph} /></Segment>
        }

        let witnessUpdate = this.state.articles.witnessUpdate;
        let witnessCategory = this.state.articles.witnessCategory;
        return <Segment.Group>
                <Segment><h3>Witness updates for the last one month</h3></Segment>
                <Segment.Group>
                    { witnessUpdate.length > 0 ? witnessUpdate.map(item =>
                    <Segment>
                        <Label>{item.created.split('T')[0]}</Label> {" "}
                        {this.renderSteemitLink(item.permlink, item.title)}
                    </Segment>)
                    :
                    <Message negative>
                        <Message.Header>No witness update</Message.Header>
                        <p>Witnesses are expected to regularly update their witness status.</p>
                    </Message>}
                </Segment.Group>
                <Segment><h3>Other articles in the witness-category tag for the last one month</h3></Segment>
                <Segment.Group>
                    { witnessCategory.length > 0 ? witnessCategory.map(item =>
                    <Segment>
                        <Label>{item.created.split('T')[0]}</Label> {" "}
                        {this.renderSteemitLink(item.permlink, item.title)}
                    </Segment>)
                    :
                    <Message warning>
                        <Message.Header>No article</Message.Header>
                    </Message>}
                </Segment.Group>
            </Segment.Group>
    }

    render() {
        const data = this.state.data;
        const voteFromWitnesses = data.totalVoteFromWitnesses;
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
                    <h2>Witness Updates / Articles</h2>
                    <Grid.Row columns={1}>
                        <Grid.Column>{this.renderWitnessUpdate()}</Grid.Column>
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