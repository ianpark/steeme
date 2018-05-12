import React, { Component } from 'react';
import { Label, Statistic, Segment } from 'semantic-ui-react';
import {Doughnut, Bar} from 'react-chartjs-2';


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
            return this.props.witnesses[this.props.witnessIndex[account]].disabled;
        } catch (error) {
            return false;
        }
    }

    getTopXCount = (items, x) => {
        let voteCount = items.filter(item => item.rank <= x).length;
        return {count: voteCount, ratio: voteCount ? (voteCount / items.length * 100) : 0}
    }

    renderVoteList = (vostList) => {
        return vostList.map(x => {
            let isDisabled = this.isDisabled(x.account);
            return <Label circular color={isDisabled ? 'red': (x.rank <= 20)? 'black': 'grey'} style={{marginBottom: '2px'}}>{x.account}</Label>
        });
    }

    renderVoteChart = (vostList) => {
        let buckets = new Array(10).fill(0);
        console.log(vostList);
        vostList.forEach(vote => buckets[parseInt((vote.rank-1)/10)] += 1)
        const data = {
            labels: ['1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
            datasets: [
              {
                label: 'Votes to witness',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: buckets
              }
            ]
          };
        const options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        beginAtZero: true
                    }
                }]
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
                backgroundColor: [ 'rgb(255, 99, 132)', 'rgb(54, 162, 235)' ],
                data: input
              }
            ]
          };
        const options = {
            maintainAspectRatio: false,
        }
        return <div style={{height: '250px', width: '250px', display: 'inline-block'}}><Doughnut
                data={data}
                options={options}
            /></div>
    }

    render() {
        const data = this.state.data;
        return (
            <div>
                <h3>Witness Votes Cast Trend</h3>
                {this.renderVotePie(['top 20', 'others'], [data.voteToTop20.count, data.castedVote - data.voteToTop20.count])}
                {this.renderVotePie(['top 30', 'others'], [data.voteToTop30.count, data.castedVote - data.voteToTop30.count])}
                <Statistic.Group color="grey">
                    <Statistic>
                        <Statistic.Value>{data.castedVote}</Statistic.Value>
                        <Statistic.Label>Votes Cast</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{data.voteToTop20.count}</Statistic.Value>
                        <Statistic.Label>Top 20</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{data.voteToTop20.ratio.toFixed(0)}%</Statistic.Value>
                        <Statistic.Label>Top 20</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{data.voteToTop30.count}</Statistic.Value>
                        <Statistic.Label>Top 30</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{data.voteToTop30.ratio.toFixed(0)}%</Statistic.Value>
                        <Statistic.Label>Top 30</Statistic.Label>
                    </Statistic>
                </Statistic.Group>

                <br/>
                <h3>Witness Votes Cast</h3>
                {this.renderVoteChart(data.voteTo)}
                <br/>
                {this.renderVoteList(data.voteTo)}
                <br/>
                <h3>Witness Votes Received (from witnesses)</h3>
                {this.renderVoteChart(data.voteFrom)}
                <br/>
                {this.renderVoteList(data.voteFrom)}

            </div>
        );
    }
}
/*
    renderRow = (witness) => {
        let data = this.manipulateData(witness);
        let voteToWarn = false;
        let voteTo = data.voteTo.map(x => {
            let isDisabled = this.isDisabled(x);
            if (isDisabled) voteToWarn = true;
            return <Label circular color={isDisabled ? 'red': 'white'} style={{marginBottom: '2px'}}>{x}</Label>
        });

        let voteFrom = data.voteFrom.map(x => {
            return <Label circular style={{marginBottom: '2px'}}>{x}</Label>
        });

        return (
            <Table.Row style={data.disabled ? {background: '#b05060', color: '#ffffff'} :{}}>
                <Table.Cell>{data.rank}</Table.Cell>
                <Table.Cell><a href="#" onClick={() => this.detailView(data.account)}>{data.account}</a></Table.Cell>
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
        */
export default WitnessDetail;