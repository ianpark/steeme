import React from 'react';
import { Grid, Segment } from 'semantic-ui-react'
import InsightForm from 'components/insight/InsightForm';
import PostForm from 'components/PostForm';

const Home = () => {
    return (
        <div>
        <h1>Posting Tools</h1>
        <Grid>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment><InsightForm/></Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment><PostForm/></Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment>Who Love Me</Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment>Trend</Segment>
        </Grid.Column>
        </Grid>
        <h1>Finance Tools</h1>
        <Grid>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment>Steem Transfer</Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment>Steem Power Delegation</Segment>
        </Grid.Column>
        </Grid>
        <h1>Big External Projects</h1>
        <Grid>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment>Steem Pay</Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={8}><Segment>Steemian Health Check</Segment>
        </Grid.Column>
        </Grid>
        </div>
    )
};

export default Home;