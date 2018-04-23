import React, {Component} from 'react';
import { Table, Button, Label, Icon } from 'semantic-ui-react';

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

class PostingInfo extends Component {
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
        /*
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
        */
    }

    textDownload() {
        /*
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
        */
    }

    detailPopup(index) {
        /*
        ReactDOM.render(
            <PostingDetail post={this.props.posts[index]} type='reward' />,
            document.getElementById('show_detail_area')
        );
        $('#show_detail').modal();
        */
    }
    
    rawPopup(index) {
        /*
        ReactDOM.render(
            <PostingDetail post={this.props.posts[index]} type='raw_content' />,
            document.getElementById('show_detail_area')
        );
        $('#show_detail').modal();
        */
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
            <Table compact collapsing="false">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Vote</Table.HeaderCell>
                        <Table.HeaderCell>Cmt</Table.HeaderCell>
                        <Table.HeaderCell>$</Table.HeaderCell>
                        <Table.HeaderCell>Rstm</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {posts.map((post ,index) =>
                    <Table.Row key={index}>
                        <Table.Cell>
                            <a href={"http://steemit.com/@" + post.author + "/" + post.permlink} target="blank">{post.title}</a>
                            {" "}<Icon name='zoom' onClick={() => this.rawPopup(index)} />
                        </Table.Cell>
                        <Table.Cell onClick={() => this.detailPopup(index)}>{post.net_votes}</Table.Cell>
                        <Table.Cell>{post.children}</Table.Cell>
                        <Table.Cell onClick={() => this.detailPopup(index)}>{post.payout.toFixed(2)}</Table.Cell>
                        <Table.Cell onClick={() => this.detailPopup(index)}>{post.reblogged_by.length}</Table.Cell>
                        <Table.Cell>{post.created.split('T')[0]}</Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table>
        </div>
        );
    }
}


export default PostingInfo;