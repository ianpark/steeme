import React from 'react';
import InsightMain from 'components/insight/InsightMain';
import InsightForm from 'components/insight/InsightForm';

const Insight = ({match}) => {
    return (
        <div>
            {match.params.id ? <InsightMain userId={match.params.id} /> : <InsightForm />}
        </div>
    )
};

export default Insight;