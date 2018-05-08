import React, { Component } from "react";
import DataFetcher from "./DataFetcher";
import { Loader, Dimmer, Tab } from 'semantic-ui-react';

import PostingInfo from './PostingInfo';

class InsightMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    onDataReady = (data) => {
        console.log(data);
        this.setState({data: data});
    }
    
    getPanes = () => {
        return [
            { menuItem: 'Posting', render: () => <Tab.Pane attached={false}><PostingInfo posts={this.state.data}/></Tab.Pane> },
            { menuItem: 'Trend', render: () => <Tab.Pane attached={false}>Trend</Tab.Pane> },
            { menuItem: 'Vote', render: () => <Tab.Pane attached={false}>Vote</Tab.Pane> },
        ];
    }

    showResult = () => {
        return (
            <div className="container" style={{width: '100%'}}>
                <div>
                    <Tab menu={{ secondary: true, pointing: true }} panes={this.getPanes()} />
                </div>
            </div>
        );
        /*

                <ul className="nav nav-tabs">
                    <li className="active">
                        <a data-toggle="tab" href="#menu_list">Posts</a>
                    </li>
                    <li>
                        <a data-toggle="tab" href="#menu_stat">Trends</a>
                    </li>
                    <li>
                        <a data-toggle="tab" href="#menu_voting">Votes</a>
                    </li>
                    <li>
                        <a data-toggle="tab" href="#menu_resteem">Resteem</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div id="summary" className="tab-pane fade in active">
                        <Summary posts={this.state.posts} userId={this.state.userId}/>
                    </div>
                    <div id="menu_list" className="tab-pane fade">
                        <Posting posts={this.state.posts} userId={this.state.userId}/>
                    </div>
                    <div id="menu_stat" className="tab-pane fade">
                        <Statistics posts={this.state.posts}/>
                    </div>
                    <div id="menu_voting" className="tab-pane fade">
                        <Voting posts={this.state.posts}/>
                    </div>
                    <div id="menu_resteem" className="tab-pane fade">
                        <Resteem posts={this.state.posts}/>
                    </div>
                </div>
        */
    }

    showLoading = () => {
        return (
            <div>
                <Dimmer active>
                    <Loader>Loading</Loader>
                </Dimmer>
                <DataFetcher userId={this.props.userId} onData={this.onDataReady} />
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.state.data ? this.showResult() : this.showLoading()}
            </div>
        );
    }
}

export default InsightMain;