import React, {Component} from 'react';
import testJson from './test.json';

class DataFetcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        console.log(this.props.userId);
        this.props.onData(testJson);
    }

    render() {
        return null;
    }
/*
    componentDidMount() {
        onUserAssigned('krguidedog');
    }

    onUserAssigned = (user) => {
        this.setState({posts: [], userId: user})
        this.get_post()
    }

    get_post = (last_post) => {
        steem.api.getDiscussionsByAuthorBeforeDate(
            this.state.userId,
            last_post?last_post.permlink: '',
            last_post?last_post.active: '2030-01-01T00:00:00',
            70, this.save_posts
        );
    }

    save_posts = (err, result) => {
        let posts = this.state.posts;
        if (err || !result || length.length == 0) {
            window.alert('Failed to load data');
            return;
        }
        // Sort each bundle
        var is_fresh = posts.length == 0 ? true : result[0].id != posts[0].id;
        if (result.length > 1 && is_fresh) {
            console.log('Posting received: ' + result.length);
            result.map(post => {
                if (posts.length == 0 ||
                    posts[window.steemit_posts.length-1].created != post.created) {
                    posts.push(post);
                }
            });
            this.get_post(result[result.length-1])
        } else {
            console.log('Posting is fully received. Start processing. ' + result.length)
            var in_progress = window.steemit_posts.length;
            window.steemit_posts.map(post => {
                function to_sbd(sbd) {
                    return parseFloat(sbd.split(' ')[0]);
                }
                if (to_sbd(post.pending_payout_value) > 0) {
                    post.payout = to_sbd(post.pending_payout_value);
                } else {
                    post.payout = to_sbd(post.total_payout_value) + to_sbd(post.curator_payout_value)
                }
                // Calculate votings
                var total_rshares = post.active_votes.reduce((sum, voter) => sum + parseInt(voter.rshares), 0);
                if (total_rshares) {
                    post.active_votes.map(upvote => {
                        upvote.sbd = (post.payout * upvote.rshares / total_rshares);
                    });
                }

                steem.api.getRebloggedByAsync(post.author, post.permlink).then(reblogger => {
                    post.reblogged_by = reblogger.filter(id => post.author != id);
                    --in_progress;
                    if (!in_progress) {
                        console.log('Fully loaded');
                        try {
                            this.savePosting(window.steemit_posts);
                            localStorage.setItem("my_steemit_id", window.steemit_user);
                            localStorage.setItem("steemme_version", steemme_version);
                        } catch (err){
                            console.log('Failed to load posting data.')
                        }
                        this.setState({
                            posts: window.steemit_posts,
                            userId: window.steemit_user
                        });
                        $('#pleaseWaitDialog').modal('hide');
                    }
                });
            })
        }
    }


    render() {
      return (
        <div className="container" style={{maxWidth: 1000}}>
            <div><h1></h1></div>
            <ControllPanel clickCallback={this.onUserAssigned}/>
            {this.state.posts.length > 0 &&
                <div>
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a data-toggle="tab" href="#summary">Summary</a>
                        </li>
                        <li>
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
                </div>
            }
        </div>
      );
    }
    */
}

export default DataFetcher;