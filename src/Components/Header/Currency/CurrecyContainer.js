import React from "react";
import {client} from "../../../apolloClient";
import {GET_ALL_CATEGORY} from "../../../Queries/Category";
import {GET_CURRENCIES} from "../../../Queries/Currencies";
import {connect} from "react-redux";
import {getCurrencies, getCurrentCurrency} from "../../../Redux/Selectors/currencySelectors";
import {setCurrencies, setCurrentCurrency} from "../../../Redux/currencyReducer";
import Currency from "./Currency";


class CurrecyContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        if (this.props.currencies.length === 0) {
            this.getInitialData()
        }
    }

    componentWillUnmount() {
        this.subobj.unsubscribe()
    }

    async getInitialData() {
        const currencyQuery = client.watchQuery({
            query: GET_CURRENCIES,
        })

        this.subobj = currencyQuery.subscribe(({data, loading}) => {
            this.setState({
                loading: loading
            })

            if (!loading) {
                this.props.setCurrencies(data.currencies)
            }
        })
    }

    render() {
        if (this.state.loading) return <div>$</div>
        return <Currency currencies={this.props.currencies} currentCurrency={this.props.currentCurrency}
                         setCurrentCurrency={this.props.setCurrentCurrency}/>
    }
}

let mapStateToProps = (state) => ({
    currencies: getCurrencies(state),
    currentCurrency: getCurrentCurrency(state)
})

export default connect(mapStateToProps, {setCurrencies, setCurrentCurrency})(CurrecyContainer)