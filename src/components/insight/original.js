
window.steemit_user = ''
window.steemit_posts = []

class ControllPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: localStorage.getItem("my_steemit_id") || ''
        }
        this.reportEvent = this.reportEvent.bind(this);
    }

    reportEvent() {
        this.props.clickCallback($('#user_id').val());
    }

    render() {
        return (
        <div className="form-group">
            <h3>Steem Insight</h3>
            <div className="input-group input-group-lg" role="group">
                <span className="input-group-addon" id="sizing-addon1">@</span>
                <input type="input" className="form-control" id="user_id" placeholder="Steemit ID here" defaultValue={this.state.userId}/>
                <span className="input-group-btn">
                    <button className="btn btn-primary" onClick={this.reportEvent}>Go</button>
                </span> 
            </div>
        </div> 
        );
    }
}

class ActionPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <div id="action_items">
            <button className="btn btn-warning">Show Posting List</button>
            <button className="btn btn-success"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> JSON</button>
            <button className="btn btn-warning">Full Refresh</button>
        </div>
        )
    }
}

class PostingDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var p = this.props.post;
        var vote_list = p.active_votes.map(upvote => [upvote.voter, upvote.sbd]);
        vote_list.sort(function(a, b) { return b[1] - a[1]; });
        console.log(p);
        return (
            <div>
                { this.props.type == 'raw_content' &&
                    <div>
                        <h3>Title</h3>
                        { p.title }
                        <h3>Body</h3>
                        <pre>
                        { p.body }
                        </pre>
                        <h3>Tags</h3>
                        { JSON.parse(p.json_metadata).tags.join(' ') }
                    </div>
                }
                <div>
                    <h3>Voted By</h3>
                    {vote_list.length > 0 ?
                        vote_list.map((vote, index) =>
                            <span key={index} className="user_cell"><b>{vote[0]}</b> ${vote[1].toFixed(2)}</span>
                        ) : (<p>No Comment</p>)
                    }
                    <h3>Resteemed By</h3>
                    {p.reblogged_by.length > 0 ? 
                        p.reblogged_by.map((id, index) =>
                        <span key={index} className="user_cell"><b>{id}</b></span>
                        ) : (<p>No resteem</p>)
                    }
                </div>
            </div>
        )
    }
}

class Posting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_keyword: ''
        }
        this.download = this.download.bind(this);
        this.textDownload = this.textDownload.bind(this);
        this.detailPopup = this.detailPopup.bind(this);
        this.rawPopup = this.rawPopup.bind(this);
    }

    download() {
        var file_name = "data.json";
        var type = "data:attachment/text";
        var data = JSON.stringify(this.props.posts);

        if (data != null && navigator.msSaveBlob)
            return navigator.msSaveBlob(new Blob([data], { type: type }), file_name);
        var a = $("<a style='display: none;'/>");
        var url = window.URL.createObjectURL(new Blob([data], {type: type}));
        a.attr("href", url);
        a.attr("download", file_name);
        $("body").append(a);
        a[0].click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    textDownload() {
        var file_name = "data.txt";
        var type = "data:attachment/text";
        var data = this.props.posts.map( post => 
            "Title:\n" + post.title + "\n" +
            "Created:\n" + post.created + "\n" +
            "Body:\n" + post.body + "\n\n\n" )
            .reduce((fulltext, item) => fulltext + item, "");

        if (data != null && navigator.msSaveBlob)
            return navigator.msSaveBlob(new Blob([data], { type: type }), file_name);
        var a = $("<a style='display: none;'/>");
        var url = window.URL.createObjectURL(new Blob([data], {type: type}));
        a.attr("href", url);
        a.attr("download", file_name);
        $("body").append(a);
        a[0].click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    detailPopup(index) {
        ReactDOM.render(
            <PostingDetail post={this.props.posts[index]} type='reward' />,
            document.getElementById('show_detail_area')
        );
        $('#show_detail').modal();
    }
    
    rawPopup(index) {
        ReactDOM.render(
            <PostingDetail post={this.props.posts[index]} type='raw_content' />,
            document.getElementById('show_detail_area')
        );
        $('#show_detail').modal();
    }

    handleChange(e) {
        this.setState({ search_keyword: e.target.value });
    }
    render() {
        var posts = [];
        if (this.state.search_keyword.length > 0) {
            posts = this.props.posts.filter((post) => post.title.includes(this.state.search_keyword) || post.body.includes(this.state.search_keyword));
        } else {
            posts = this.props.posts;
        }
        return (
        <div className="container" style={{width: '100%'}}>
            <div>
                <h2>Posting history</h2>
                <button className="btn btn-success pull-right" onClick={this.download}>
                    <span className="glyphicon glyphicon-download-alt" aria-hidden="true"></span> JSON
                </button>
                <button className="btn btn-success pull-right" onClick={this.textDownload}>
                    <span className="glyphicon glyphicon-download-alt" aria-hidden="true"></span> Text
                </button>
                <div className="form-group pull-right">
                    <div className="input-group input-group" role="group">
                        <input type="input" onChange={ this.handleChange.bind(this) }  value={this.state.search_keyword} size="20" className="form-control" id="search_keyword" placeholder="search keyword"/>
                    </div>
                </div>
            </div>
            <table className='table table-hover table-sm' style={{fontSize: '9pt'}}>
            <thead  style={{fontWeight: 'bold'}}>
                <tr><td>Title</td><td className='right'>Vote</td><td className='right'>Cmt</td><td className='right'>SBD</td><td className='right'>Rstm</td><td className='right'>Created</td></tr>
            </thead>
            <tbody>
                {posts.map((post ,index) =>
                <tr key={index}>
                    <td>
                        <a href={"http://steemit.com/@" + post.author + "/" + post.permlink} target="blank">{post.title}</a>
                        <button className='btn btn-default btn-rawmodal' onClick={() => this.rawPopup(index)}>Raw</button>
                    </td>
                    <td className='right link' onClick={() => this.detailPopup(index)}>{post.net_votes}</td>
                    <td className='right'>{post.children}</td>
                    <td className='right link' onClick={() => this.detailPopup(index)}>{post.payout.toFixed(2)}</td>
                    <td className='right link' onClick={() => this.detailPopup(index)}>{post.reblogged_by.length}</td>
                    <td className="hardshell">{post.created.split('T')[0]}</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        );
    }
}


class BarChart extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        var ctx = document.getElementById(this.props.chart_id).getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',
            // The data for our dataset
            data: {
                labels: this.props.voters.map((voter) => voter[0]),
                datasets: [{
                    label: "Total vote",
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgb(255, 99, 132)",
                    data: this.props.voters.map((voter) => voter[1]),
                    borderWidth: 1
                },{
                    label: "Total SBD",
                    borderColor: "rgb(54, 162, 235)",
                    backgroundColor: "rgb(54, 162, 235)",
                    data: this.props.voters.map((voter) => voter[2].toFixed(2)),
                    borderWidth: 1
                }]
            },
        
            // Configuration options go here
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title:{
                    display: true,
                    text: this.props.title
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                        }
                    }],
                    xAxes: [{
                        display: true,
                    }]
                }
            }
        });
    }
    render() {
        return (
            <canvas id={this.props.chart_id} style={{maxHeight: 400}}></canvas>
        )
    }
}

class Voting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'frequent_voter': [],
            'strong_voter': []
        };
    }
    
    get_voting_stat() {
        var voters = this.props.posts
        .reduce((all, post) => {
            return all.concat(post.active_votes.map(upvote => {
                return [upvote.voter, upvote.sbd]
            }));
        }, [])
        .reduce((upvoteCounts, upvote) => {
            if (!upvoteCounts[upvote[0]]) {
                upvoteCounts[upvote[0]] = [1, upvote[1]]
            } else {
                upvoteCounts[upvote[0]][0]++;
                upvoteCounts[upvote[0]][1] += upvote[1];
            }
            return upvoteCounts;
            },{});
        var voter_list = [];
        for (var key in voters) {
            voter_list.push([key, voters[key][0], voters[key][1]]);
        }
        return voter_list;
    }
    componentDidMount() {
        var voter_list = this.get_voting_stat();

        voter_list.sort(function(a, b) { return b[1] - a[1]; });
        this.setState({'frequent_voter': voter_list.slice(0, 25)});
        voter_list.sort(function(a, b) { return b[2] - a[2]; });
        this.setState({'strong_voter': voter_list.slice(0, 25)});
    }
    render() {
        return (
            <div className="container" style={{width: '100%'}}>
                <div className="row">
                    <div className="col-sm-12" style={{width: '95%', maxWidth: 1000}}>
                    {this.state.frequent_voter.length > 0 &&
                            <BarChart chart_id="frequent_voter" title="Top 25 frequent voters" voters={this.state.frequent_voter}/>
                    }
                    {this.state.frequent_voter.length > 0 &&
                            <BarChart chart_id="strong_voter" title="Top 25 strong voters" voters={this.state.strong_voter}/>
                    }
                    </div>
                </div>
            </div>
        )
    }
}


class LineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var ctx = document.getElementById(this.props.chart_id).getContext('2d');
        ctx.height = 400;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: this.props.labels,
                datasets: [{
                    label: this.props.value_name,
                    borderColor: this.props.color,
                    data: this.props.records,
                    borderWidth: 1,
                    pointRadius: 0
                }]
            },
        
            // Configuration options go here
            options: {
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.props.value_name
                        }
                    }],
                    xAxes: [{
                        display: false,
                    }]
                }
            }
        });
    }
    
    render() {
        return (
            <canvas id={this.props.chart_id} style={{maxHeight: 400}}></canvas>
        )
    }
}

class Statistics extends React.Component {
    constructor(props) {
      super(props);
      var reversed = this.props.posts.slice().reverse();
      this.state = {
          labels: reversed.map((post) => post.created).map((created_date) => created_date.split('T')[0]),
          votes: reversed.map((post) => post.net_votes),
          comments: reversed.map((post) => post.children),
          sbd: reversed.map((post) => post.payout)
      };
    }

    render() {
      return (
        <div className="container" style={{width: '100%'}}>
            <h3>Voting per post</h3>
            <LineChart chart_id="vote_chart" color="rgb(255, 99, 132)" title="Voting per post" value_name="Voting" labels={this.state.labels} records={this.state.votes} />
            <h3>Comments per post</h3>
            <LineChart chart_id="comment_chart" color="rgb(54, 162, 235)" title="Comments per post" value_name="Comments" labels={this.state.labels} records={this.state.comments} />
            <h3>SBD per post</h3>
            <LineChart chart_id="reword_chart" color="rgb(75, 192, 192)" title="SBD per post" value_name="SBD" labels={this.state.labels} records={this.state.sbd} />
        </div>
      );
    }
}

class Resteem extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        var resteem_user = {};
        this.props.posts.map(post => {
            post.reblogged_by.map(user_id => {
                if (resteem_user[user_id]) {
                    resteem_user[user_id] += 1;
                } else {
                    resteem_user[user_id] = 1;
                }
            })
        })
        var resteem_list = [];
        for (var user in resteem_user) {
            resteem_list.push([user, resteem_user[user]]);
        }
        resteem_list.sort(function(a, b) { return b[1]-a[1];});

        var ctx = document.getElementById('resteem_rank_canvas').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',
            // The data for our dataset
            data: {
                labels: resteem_list.slice(0, 15).map((resteem) => resteem[0]),
                datasets: [{
                    label: "Total resteem",
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgb(255, 99, 132)",
                    data: resteem_list.slice(0, 15).map((resteem) => resteem[1]),
                    borderWidth: 1
                }]
            },
        
            // Configuration options go here
            options: {
                responsive: true,
                maintainAspectRatio: true,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                        }
                    }],
                    xAxes: [{
                        display: true,
                    }]
                }
            }
        });
    }
    render () {
        var post_set = this.props.posts.slice();
        post_set.sort(function(a, b) { return b.reblogged_by.length - a.reblogged_by.length});

        return (
            <div className="container" style={{width: '100%'}}>
                <h3>Best 15 Resteemers</h3>
                <div>
                    <canvas id='resteem_rank_canvas'></canvas>
                </div>
                <h3>Best 10 resteemed post</h3>
                <ul className="list-group">
                    {post_set.slice(0,10).map((post, idx) =>
                        <li key={idx} className="list-group-item">
                        <a href={"http://steemit.com/@" + post.author + "/" + post.permlink} target="blank">{post.title}</a>
                        <span className="badge">{post.reblogged_by.length}</span>
                        </li>)
                    }
                </ul>
            </div>
        )
    }
}

class Summary extends React.Component {
    constructor(props) {
        super(props);
        var p = props.posts;
        var total_post = p.length;
        var total_sbd = p.reduce((sum, post) => sum + post.payout, 0);
        var total_vote = p.reduce((sum, post) => sum + post.active_votes.length, 0);
        var total_comments = p.reduce((sum, post) => sum + post.children, 0);
        var stat = {
            total_post: total_post,
            total_sbd: total_sbd,
            total_vote: total_vote,
            total_comments: total_comments,
            average_sbd: (total_sbd/total_post).toFixed(2),
            average_vote: (total_vote/total_post).toFixed(2),
            average_comments: (total_comments/total_post).toFixed(2),
            total_resteem: p.reduce((sum, post) => sum + post.reblogged_by.length, 0),
            seven_day_stat: []
        }

        stat.seven_day_stat = [
            ['Rewards', stat.total_sbd,
            stat.average_sbd,
            (p.slice(0, 7).reduce((sum, post) => sum + post.payout, 0) / 7).toFixed(2)],
            ['Votes', stat.total_vote,
            stat.average_vote,
            (p.slice(0, 7).reduce((sum, post) => sum + post.active_votes.length, 0) / 7).toFixed(2)],
            ['Comments', stat.total_comments,
            stat.average_comments,
            (p.slice(0, 7).reduce((sum, post) => sum + post.children, 0) / 7).toFixed(2)]
        ];

        this.state = stat;
    }
    render() {
        var p = this.props.posts;
        return (
            <div className="container" style={{width: '100%'}}>
                <h3>About @{this.props.userId}</h3>
                <div className="alert alert-success" role="alert">
                    <p>Total Posts: {this.state.total_post}</p>
                    <p>Total Votes: {this.state.total_vote}</p>
                    <p>Total Reward: {this.state.total_sbd.toFixed(2)} SBD</p>
                    <p>Total Comments: {this.state.total_comments}</p>
                    <p>Average Votes: {this.state.average_vote}</p>
                    <p>Average Reward: {this.state.average_sbd} SBD</p>
                    <p>Average Comments: {this.state.average_comments}</p>
                    <p>Resteemed: {this.state.total_resteem}</p>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">Vote / Comment / Reward</div>
                    <table className="table" style={{textAlign: 'right'}}>
                        <thead>
                        <tr>
                            <td></td><td>Total</td><td>Average</td><td>Avg. of last 7 posts</td>
                        </tr>
                        </thead>
                        <tbody>
                            { this.state.seven_day_stat.map((item, idx) =>
                                <tr key={idx}>
                                    <td  style={{textAlign: 'left'}}><b>{item[0]}</b></td>
                                    <td>{item[1].toFixed(2)}</td>
                                    <td>{item[2]}</td>
                                    <td>{item[3]}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        )
    }
}

var steemme_version = "0.4";
class PostingAnalyser extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          posts: this.getSavedPosting(),
          userId: localStorage.getItem("my_steemit_id") || ''
      }
      window.posts = this.state.posts;
      this.onUserAssigned = this.onUserAssigned.bind(this);
      this.get_post = this.get_post.bind(this);
      this.save_posts = this.save_posts.bind(this);
      this.getSavedPosting = this.getSavedPosting.bind(this);
    }

    getSavedPosting() {
        try {
            if (localStorage.getItem("steemme_version") != steemme_version) {
                throw "Old data found.";
            }
            var saved_posting = localStorage.getItem("my_steemit_post");
            if (saved_posting && saved_posting.length > 0) {
                return JSON.parse(LZString.decompressFromUTF16(saved_posting))
            }
        } catch (err) {
            // cleanup
            localStorage.removeItem("my_steemit_post");
        }
        return [];
    }

    savePosting() {
        localStorage.setItem(
            "my_steemit_post",
            LZString.compressToUTF16(JSON.stringify(window.steemit_posts)));
    }

    onUserAssigned(user) {
        $('#pleaseWaitDialog').modal();
        this.setState({posts: [], userId: user})
        window.steemit_posts = [];
        window.steemit_user = user;
        this.get_post()
    }

    save_posts(err, result) {
        if (err || !result || length.length == 0) {
            window.alert('Failed to load data');
            return;
        }
        // Sort each bundle
        var is_fresh = window.steemit_posts.length == 0 ? true : result[0].id != window.steemit_posts[0].id;
        if (result.length > 1 && is_fresh) {
            console.log('Posting received: ' + result.length);
            result.map(post => {
                if (window.steemit_posts.length == 0 ||
                    window.steemit_posts[window.steemit_posts.length-1].created != post.created) {
                    window.steemit_posts.push(post);
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

    get_post(last_post) {
        steem.api.getDiscussionsByAuthorBeforeDate(
            window.steemit_user ,
            last_post?last_post.permlink: '',
            last_post?last_post.active: '2030-01-01T00:00:00',
            70, this.save_posts
        );
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
            <h1> </h1>
            <pre>
                Steem Me v{steemme_version}, created by <a href="http://steemit.com/@asbear">@asbear</a>
            </pre>
        </div>
      );
    }
}


// var my_steemit_post = JSON.parse(localStorage.getItem("my_steemit_post")) || [];

ReactDOM.render(
    <PostingAnalyser/>,
    document.getElementById('steem_insight')
);
