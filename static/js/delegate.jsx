
class DelegationState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delegationState: [],
            delegateTo: '',
            delegateAmount: '',
            inProgress: false,
            accountDetail: null
        }
        this.getDelegationData = this.getDelegationData.bind(this);
        this.onDelegationData = this.onDelegationData.bind(this);
        this.onDelegationCompleted = this.onDelegationCompleted.bind(this);
        this.onAcountDetail = this.onAcountDetail.bind(this);
        
    }
    applyValues() {
        this.setState({
            activeKey: this.activeKey.value,
            delegateTo: this.delegateTo.value,
            delegateAmount: this.delegateAmount.value
        });
    }
    componentDidMount() {
        this.getDelegationData(this.props.userId);
    }
    componentWillReceiveProps(props) {
        this.getDelegationData(props.userId);
    }

    getDelegationData(userId) {
        this.setState({inProgress: true});
        steem.api.getVestingDelegations(userId, "", 30, this.onDelegationData);
        steem.api.getAccounts([userId], this.onAcountDetail);
    }

    onAcountDetail(error, result) {
        this.setState({accountDetail: result[0]})
    }

    onDelegationData(error, result) {
        this.setState({inProgress: false});
        if (!error) {
            this.setState({delegationState: result});
        }
    }

    delegate() {
        this.setState({inProgress: true});
        steem.broadcast.delegateVestingShares(
            this.activeKey.value,
            this.props.userId,
            this.delegateTo.value,
            this.spToVests(this.delegateAmount.value) + " VESTS", this.onDelegationCompleted);
    }

    onDelegationCompleted(error, result) {
        this.setState({inProgress: false});
        if (!error) {
            this.getDelegationData(this.props.userId);
        } else {
            console.log(error);
        }
    }

    vestsToSP(vesting_shares) {
        return (vesting_shares/2054.45).toFixed(2);
    }
    spToVests(SP) {
        return (SP * 2054.45).toFixed(6);
    }

    render() {
        var sp = 0;
        var delegated_sp = 0;
        var received_sp = 0;
        if (this.state.accountDetail) {
            sp = parseInt(this.vestsToSP(this.state.accountDetail.vesting_shares.split(' ')[0]));
            delegated_sp = parseInt(this.vestsToSP(this.state.accountDetail.delegated_vesting_shares.split(' ')[0]));
            received_sp = parseInt(this.vestsToSP(this.state.accountDetail.received_vesting_shares.split(' ')[0]));
        }
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                <b><span style={{fontSize: '20px'}}>@{this.props.userId}</span></b>
                {this.state.accountDetail &&
                <span style={{marginLeft: '5px'}}>
                    <span style={{marginLeft: '5px', fontWeight: '700'}}>{sp - delegated_sp + received_sp}SP</span>
                    <span style={{marginLeft: '5px'}}>({sp}</span>
                    <span style={{marginLeft: '5px', color: 'green'}}>+ {received_sp}</span>
                    <span style={{marginLeft: '5px', color: 'red'}}>- {delegated_sp})</span>
                </span>
                }
                </div>
                <div className="panel-body">
                <div className="input-group" style={{fontSize: '10px'}}>
                    <span className="input-group-addon">Active Key</span>
                    <input type="password"
                        className="form-control"
                        ref={(input) => { this.activeKey = input; }}
                        onBlur={this.applyValues.bind(this)}
                        placeholder="Active key"/>
                </div>
                <div className="input-group">
                    <span className="input-group-addon">Delegate To @</span>
                    <input type="text"
                        className="form-control"
                        ref={(input) => { this.delegateTo = input; }}
                        onBlur={this.applyValues.bind(this)}
                        placeholder="User ID"/>
                    <span className="input-group-addon">Amount</span>
                    <input type="text"
                        className="form-control"
                        ref={(input) => { this.delegateAmount = input; }}
                        onBlur={this.applyValues.bind(this)}
                        placeholder="STEEM POWER"/>
                    <span className="input-group-btn">
                        <button className="btn btn-success" type="button"
                        onClick={this.delegate.bind(this)}>Apply</button>
                    </span>
                </div>
                { !this.state.inProgress &&
                <table className="table table-sm" style={{fontSize: '13px'}}>
                    <thead>
                        <tr>
                            <th>Delegatee</th><th>VESTS</th><th>SP</th><th>Date</th>
                            <th>Days</th>
                        </tr>
                    </thead>
                    <tbody>
                    { this.state.delegationState.map( (item, idx) =>
                        <tr key={idx}>
                            <td>{item.delegatee}</td>
                            <td>{item.vesting_shares.split(".")[0]}</td>
                            <td>{this.vestsToSP(parseInt(item.vesting_shares.split(".")[0]))}</td>
                            <td>{item.min_delegation_time.split("T")[0]}</td>
                            <td>{((Date.now() - Date.parse(item.min_delegation_time.split("T")[0]))/1000/3600/24).toFixed(0)}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                }
                { this.state.inProgress &&
                <div style={{textAlign: "center"}}>
                    <img src="https://i.imgur.com/DMTnDDk.gif" style={{width:'30px'}}/>
                </div>
                }
                </div>
            </div>
        )
    }
}

class Delegate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                userId: ''
            };
    }
    applyValues() {
        this.setState({
            userId: this.userId.value
        });
    }
    render() {
        var ready = this.state.userId && this.state.activeKey;
        return (
            <div className="container" style={{maxWidth: '600px'}}>
                <h3>Manage STEEM POWER Delegation</h3>
                <div style={{maxWidth: '700px'}}>
                    <div class="form-horizontal">
                        <div className="input-group">
                            <span className="input-group-addon">@</span>
                            <input type="text"
                                className="form-control"
                                ref={(input) => { this.userId = input; }}
                                onBlur={this.applyValues.bind(this)}
                                placeholder="user name"/>
                        </div>
                    </div>
                    
                    { this.state.userId &&
                        <div>
                            {this.state.userId.split(" ").map((uid, idx) =>
                                <DelegationState key={idx} userId={uid}/>
                            )}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

/*
class Delegate extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
            </div>
        )
    }
}
*/

ReactDOM.render(
    <Delegate/>,
    document.getElementById('delegate_steem_power')
);