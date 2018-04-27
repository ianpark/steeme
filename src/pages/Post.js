import React, {Component} from 'react';
import { Form, TextArea, Label, Dimmer, Loader } from 'semantic-ui-react'

var steem = require('steem');

function to_sbd(sbd) {
    return parseFloat(sbd.split(' ')[0]);
}

/*
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
*/


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {post: null};
    }
    componentDidMount() {
        const self = this;
        const {author, permlink} = this.props.match.params;
        console.log(author, permlink);
        steem.api.getContentAsync(author, permlink)
        .then( post => {
            console.log(post);

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
            steem.api.getRebloggedByAsync(author, permlink)
            .then( reblogger => {
                post.reblogged_by = reblogger.filter(id => post.author != id);
                self.setState({post: post});
            });
        })
        .catch((err) => {
            console.log(err);
        })
        .done();
    }

    render() {
        return (
            <div>
                <h2>Posting Detail</h2>
                {this.state.post
                    ? <PostView post={this.state.post} />
                    : <Dimmer active><Loader>Loading</Loader></Dimmer>}
            </div>
        )
    }
}

class PostView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var p = this.props.post;
        var vote_list = p.active_votes.map(upvote => [upvote.voter, upvote.sbd]);
        vote_list.sort(function(a, b) { return b[1] - a[1]; });
        console.log(vote_list);
        return (
            <div>
                <div>
                    <h3>{ p.title }</h3>
                    <Form>
                        <TextArea placeholder='Tell us more' style={{height: 400}} value={p.body} />
                    </Form>
                    <h3>Tags</h3>
                    { JSON.parse(p.json_metadata).tags.join(' ') }
                    <h3>Voted By</h3>
                    {vote_list.length > 0 ?
                        vote_list.map((vote, index) =>
                            <Label size='mini' key={index}>{vote[0]} ${vote[1].toFixed(2)}</Label>
                        ) : (<p>No Vote</p>)
                    }
                    <h3>Resteemed By</h3>
                    {p.reblogged_by.length > 0 ? 
                        p.reblogged_by.map((id, index) =>
                        <Label size='mini' key={index}>{id}</Label>
                        ) : (<p>No resteem</p>)
                    }
                </div>
            </div>
        )
    }
}


export default Post;