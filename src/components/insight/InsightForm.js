import React, {Component} from 'react';
import { Input, Icon, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';


class InsightForm extends Component {
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
                <Redirect push to={"./@" + this.state.userId} />
                :
                <div>
                    Select User
                    <Input size='large' icon='search'  placeholder='Steemit account' onKeyDown={this.keyPress} />
                </div>
                }
            </div>
        );
    }
};

export default InsightForm;