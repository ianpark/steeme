import React, {Component} from 'react';
import WitnessList from 'components/witness/WitnessList'; 

class Witness extends Component {
    constructor(props) {
        super(props);
    }

    onData(data) {
        console.log(JSON.stringify(data));
    }

    render() {
        return (
            <div>
                <h2>Witness Insight</h2>
                <WitnessList />
            </div>
        );
    }
}

export default Witness;