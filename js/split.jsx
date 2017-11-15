class UserBlock extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var user = this.props.user;
        var profile_image = "https://i.imgur.com/SLKkDYf.png";
        if (this.props.user.json_metadata) {
            profile_image = JSON.parse(this.props.user.json_metadata).profile.profile_image;
        }
        return (
            <div className="user-console">
                <div><img className="round-64" src={"https://steemitimages.com/120x120/" + profile_image}/></div>
                <div><span className="receiver-id">{user.name}</span> <span className="reputation">{steem.formatter.reputation(user.reputation)}</span></div>
                <div><span className="receiver-sbd">${user.stake.toFixed(3)}</span></div>
            </div>
        )
    }
}

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sender: this.props.sender,
            message: this.props.message.replace("{name}",this.props.receiver),
            receiver: this.props.receiver,
            amount: this.props.amount,
            activeKey: this.props.activeKey,
            completed: false,
            error: null
        }
        this.onComplete = this.onComplete.bind(this);
        this.startTransaction = this.startTransaction.bind(this);
    }
    componentDidMount() {
        this.startTransaction();
    }
    startTransaction() {
        this.setState({error: null});
        steem.broadcast.transfer(
            this.state.activeKey, 
            this.state.sender, 
            this.state.receiver, 
            this.state.amount, 
            this.state.message, 
            this.onComplete);
    }
    onComplete(error, result) {
        if (error) {
            console.log(error);
            this.setState({error: error.message});

        } else {
            this.setState({completed: true});
        }
    }
    render() {
        return (
            <div>      
                {this.state.completed ? (
                    <div className="alert alert-success" role="alert">
                    Successfully sent ${this.state.amount} to {this.state.receiver}!
                    </div>
                ) : (
                    <div>
                        {this.state.error ? (
                            <div className="alert alert-danger" role="alert">
                                                                <button
                                    onClick={this.startTransaction}
                                    className="btn btn-default pull-right">Retry!</button>
                                Failed to send ${this.state.amount} to {this.state.receiver}<br/>
                                Error: {this.state.error}
                            </div>
                        ) : (
                            <div className="alert alert-warning" role="alert">
                                Sending ${this.state.amount} to {this.state.receiver} ...
                                <img src="https://i.imgur.com/DMTnDDk.gif" style={{width:'20px'}}/>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }
}

class Pay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sender: '',
            receivers: [],
            message: '',
            sbd: 0,
            activeKey: '',
            completed: [],
            inprogress: false
        }
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onUserData = this.onUserData.bind(this);
        this.onSBDChange = this.onSBDChange.bind(this);
        this.recalculate = this.recalculate.bind(this);
        this.applyValues = this.applyValues.bind(this);
        this.sendMoney = this.sendMoney.bind(this);
    }
    applyValues() {
        this.setState({
            sender: this.sender.value,
            sbd: this.sbd.value,
            message: this.message.value,
            activeKey: this.activeKey.value
        });
    }
    recalculate() {
        this.state.receivers.map(user => {
            user.stake = parseFloat(this.sbd.value) / this.state.receivers.length;
        });
        this.setState({receivers: this.state.receivers});
    }

    onSBDChange() {
        if (this.state.receivers.length > 0) {
            this.recalculate();
        }
    }

    handleKeyPress(event) {
        if (!event.charCode || event.charCode == 13 || event.charCode == 32) {
            console.log('User search');
            this.state.receivers = this.receiver.value.split(' ');
            steem.api.getAccounts(this.state.receivers, this.onUserData);
        }
    }
    onUserData(error, result) {
        if (error) {
            console.log(error);
            return;
        }
        var users = {}
        var user_list = []
        result.map(user => { users[user.name] = user; });
        for (var key in users) {
            users[key].stake = 0;
            user_list.push(users[key]);
        }
        this.receiver.value = user_list.reduce((valid_user, user) => {
            valid_user.push(user.name);
            return valid_user;
        }, []).join(' ') + ' ';
        this.state.receivers = user_list;
        this.recalculate();
    }
    sendMoney() {
        this.setState({inprogress: true});
    }
    render() {
        var ready = this.state.sender && this.state.receivers && this.state.message && this.state.activeKey;
        return (
            <div className="container" style={{maxWidth: '600px'}}>
                <h3>Send your SBD to multiple users!</h3>
                { !this.state.inprogress &&
                <div class="form-horizontal">
                <div className="input-group">
                    <span className="input-group-addon">Sender @</span>
                    <input type="text"
                        className="form-control"
                        ref={(input) => { this.sender = input; }}
                        onBlur={this.applyValues.bind(this)}
                        placeholder="sending user"/>
                </div>
                <div className="input-group">
                    <span className="input-group-addon">Receivers @</span>
                    <input type="text"
                        className="form-control"
                        ref={(input) => { this.receiver = input; }}
                        onBlur={this.handleKeyPress}
                        onKeyPress={this.handleKeyPress}
                        placeholder="receiving users separated by space"/>
                </div>
                <div className="input-group">
                    <span className="input-group-addon">Total SBD</span>
                    <input type="text"
                        className="form-control"
                        defaultValue="0"
                        ref={(input) => { this.sbd = input; }}
                        onChange={this.onSBDChange.bind(this)}
                        onBlur={this.applyValues.bind(this)}
                        placeholder="Total SBD"/>
                </div>
                <div className="input-group">
                    <span className="input-group-addon">Active Key</span>
                    <input type="password"
                        className="form-control"
                        ref={(input) => { this.activeKey = input; }}
                        onBlur={this.applyValues.bind(this)}
                        placeholder="Active key"/>
                </div>

                <div className="input-group">
                    <span className="input-group-addon">Memo</span>
                    <input type="text"
                        className="form-control"
                        ref={(input) => { this.message = input; }}
                        onBlur={this.applyValues.bind(this)}
                        placeholder="Put a message. {user} will be replaced by the receiver ID."/>
                </div>
                
                <div className="input-group">
                    { this.state.receivers.length > 0 && this.state.receivers.map((user, id) =>
                        <UserBlock user={user} key={id}/>
                    )}
                </div>
                </div>
                }
                { ready &&
                    <div>
                        <pre>
                            Total SBD: ${this.state.sbd}<br/>
                            Sender: {this.state.sender}<br/>
                            Receivers: {this.state.receivers.map(user => user.name).join(' ')}<br/>
                            Message: {this.state.message}<br/>
                            { !this.state.inprogress &&
                                <button
                                    type="button" 
                                    onClick={this.sendMoney}
                                    className="btn btn-default pull-right">Submit!</button>
                            }
                        </pre>
                    </div>
                }
                { this.state.inprogress &&
                    <div>
                        {this.state.receivers.map((user, id) =>
                            <Transaction 
                                activeKey={this.state.activeKey} 
                                sender={this.state.sender}
                                receiver={user.name}
                                amount={user.stake.toFixed(3) + ' SBD'}
                                message={this.state.message}
                                key={id}/>
                        )}
                    </div>
                }
                <div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Pay/>,
    document.getElementById('transfer_money_panel')
);