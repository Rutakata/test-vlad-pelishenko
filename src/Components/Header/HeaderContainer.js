import React from "react";
import {client} from "../../apolloClient";
import {GET_CATEGORIES} from "../../Queries/Categories";
import {setCategories} from "../../Redux/headerReducer";
import {setCurrentCategory} from "../../Redux/categoryReducer";
import {connect} from "react-redux";
import Header from "./Header";
import {getCategories} from "../../Redux/Selectors/headerSelectors";
import {compose} from "redux";
import {withRouter} from "../../HOC/withRouter";
import {getCartLength} from "../../Redux/Selectors/cartPageSelectors";

class HeaderContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCart: "none"
        }

        this.handleShowCart = this.handleShowCart.bind(this)
    }

    handleShowCart() {
        this.setState({
            showCart: this.state.showCart === "none" ? "block" : "none"
        })
    }

    componentDidMount() {
        this.getInitialData()
    }

    componentWillUnmount() {
        this.subobj.unsubscribe()
    }

    async getInitialData() {
        const watchQuery = client.watchQuery({
            query: GET_CATEGORIES,
        });
        this.subobj = watchQuery.subscribe(({data, loading}) => {
            if (!loading) {
                this.props.setCategories(data.categories)
            }
        });
    }

    render() {
        return <Header categories={this.props.categories} changeCurrentCategory={this.props.setCurrentCategory}
                       showCart={this.state.showCart} handleShowCart={this.handleShowCart}
                       cartLength={this.props.cartLength}/>
    }
}

let mapStateToProps = (state) => ({
    categories: getCategories(state),
    cartLength: getCartLength(state),
})

export default connect(mapStateToProps, {setCategories, setCurrentCategory})(HeaderContainer)