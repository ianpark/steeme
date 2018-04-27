import React, {Component} from 'react';
import { Input, Icon, Button } from 'semantic-ui-react';
import { Redirect, withRouter } from 'react-router-dom';

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {userId: null};
    }

    keyPress = (e) => {
        if (e.keyCode == 13) {
            this.setState({userId: e.target.value});
        }
    }

    render() {
        return (
            <div>
                { this.state.userId ?
                <Redirect push to={"/post/" + this.state.userId} />
                :
                <div>
                    <h2>Raw Post</h2>
                    <Input size='large' icon='search'  placeholder='@account/symlink' onKeyDown={this.keyPress} />
                </div>
                }
            </div>
        );
    }
};

export default withRouter(PostForm);