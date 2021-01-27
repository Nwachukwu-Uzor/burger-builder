import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auxillary from '../Auxillary/Auxillary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false,
    }

    SideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false})
    }

    SideDrawerToggleHandler = () => {
        this.setState(prevState => {
            return { showSideDrawer: !prevState.showSideDrawer }
        })
    }

    render () {
        return (
            <Auxillary>
                <Toolbar 
                    drawerToggleClicked={this.SideDrawerToggleHandler}
                    isAuth={this.props.isAuth}
                />
                <SideDrawer 
                    open={this.state.showSideDrawer} 
                    closed={this.SideDrawerClosedHandler}
                    isAuth={this.props.isAuth}
                />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxillary>
        );
    }
} 

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);