import React, { Component } from "react";
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { Home, Insight, Post, Witness } from 'pages';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Container } from 'semantic-ui-react';
import _ from "lodash";
import Footer from 'components/Footer'

import './App.css';

const Content = () => (
    <div>
        <Route exact path="/" component={Home} />
        <Route path="/post/@:author/:permlink" component={Post} />
        <Route path="/witness/@:account" component={Witness} />
        <Route exact path="/witness" component={Witness} />
        <Route path="/insight/:id?" component={Insight} />
    </div>
);

const leftItems = [];
const rightItems = [];

const App = () => (
    <div>
      <div>
      <AppFrame rightItems={rightItems}>
          <Content />
          <Footer />
      </AppFrame>
    </div>
    </div>
);

class AppFrame extends Component {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children, rightItems } = this.props;
    const { visible } = this.state;

    return (
      <div>
          <NavBarMobile
            slideMenu={slideMenu}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}>
            <NavBarChildren>{children}</NavBarChildren>
          </NavBarMobile>
      </div>
    );
  }
};


const NavBarMobile = ({
    children,
    slideMenu,
    onPusherClick,
    onToggle,
    rightItems,
    visible
  }) => (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={visible}
        width="thin">
        { slideMenu.map( (item, key) => (
          <Link key={key} to={item.link} onClick={onToggle}>
            <Menu.Item name={item.name} >
              <Icon name={item.icon} />
              {item.name}
            </Menu.Item>
          </Link>
        ))}
        <Footer/>
      </Sidebar>
      <Sidebar.Pusher
        dimmed={visible}
        onClick={onPusherClick}
        style={{ minHeight: "100vh" }}>
        <Menu inverted fixed="top">
          <Menu secondary>
          <Menu.Item onClick={onToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Item>
            <h3>Steeme</h3>
          </Menu.Item>
          </Menu>
          <Menu.Menu position="right">
            {_.map(rightItems, item => <Menu.Item {...item} />)}
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
  
const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: "5em" }}>{children}</Container>
);

const slideMenu = [
  { name: 'Home', link: '/', icon: 'home' },
  { name: 'Witness Insight', link: '/witness', icon: 'eye' },
];

export default App;