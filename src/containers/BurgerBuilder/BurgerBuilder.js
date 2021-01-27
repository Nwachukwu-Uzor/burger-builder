import React, { Component } from 'react';
import { connect } from "react-redux";

import Auxillary from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import  * as actions from '../../store/actions/index';
import axios from 'axios';

export class BurgerBuilder extends Component {
    state={
        purchasing: false,
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchasableState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el
            }, 0);
        return sum > 0
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true})
        } else {
            this.props.onSetAuthRedirectPath("/checkout")
            this.props.history.push("/auth")
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContineHandler = () => {
        this.props.onPurchaseInit()
        this.props.history.push('/checkout')
    }


    render () {
        const disabledInfo = {...this.props.ings}

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
        
        if (this.props.ings) {
            burger = (
                <Auxillary>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabledInfo={disabledInfo}
                        purchasable={this.updatePurchasableState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price={this.props.price}
                    />
                </Auxillary>
            );

            orderSummary =  <OrderSummary 
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContineHandler}
                price={this.props.price}
            />
        }

        return (
            <Auxillary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
                {burger}
            </Auxillary>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice.toFixed(2),
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredients(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onPurchaseInit: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));