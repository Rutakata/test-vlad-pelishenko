import React from "react";
import ProductInfo from "./ProductInfo";
import {getAttributesReady, getChosenAttributes, getProductInfo} from "../../Redux/Selectors/productPageSelectors";
import {setProductInfo, handleAttributeChange, countActiveAttributes} from "../../Redux/productReducer";
import {addProductToCart} from "../../Redux/cartReducer";
import {connect} from "react-redux";
import {client} from "../../apolloClient";
import {compose} from "redux";
import {withRouter} from "../../HOC/withRouter";
import {getProductData} from "../../Queries/Product";
import {getCurrentCurrency} from "../../Redux/Selectors/currencySelectors";


class ProductInfoContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            currentImage: props.product?.gallery[0],
            productId: props.productId,
            loading: true,
        })

        this.setCurrentImage = this.setCurrentImage.bind(this)
        this.checkAttributesReady = this.checkAttributesReady.bind(this)
    }

    componentDidMount() {
        if (!this.props.product) {
            this.getInitialData(this.state.productId)
        }else {
            this.setState({
                    loading: false,
                }
            )
        }

        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }

    checkAttributesReady(product) {
        let counter = 0

        product.attributes.forEach((attribute) => {
            let isActive = attribute.items.some(item => item.isActive)
            console.log(attribute.name, isActive)
            if (isActive) counter++
        })

        return counter
    }

    async getInitialData(productId) {
        const watchQuery = client.watchQuery({
            query: getProductData(),
            variables: {
                productId: productId
            }
        })
        this.subobj = watchQuery.subscribe(({data, loading}) => {
            if (!loading) {
                this.props.setProductInfo(data.product)
                this.setState({
                    currentImage: `${data.product.gallery[0]}`,
                    loading: loading
                })
                this.subobj.unsubscribe()
            }
        })
    }

    setCurrentImage(src) {
        this.setState({
            currentImage: `${src}`
        })
    }

    render() {
        if (this.state.loading) return <div>Loading...</div>

        return <ProductInfo product={this.props.product} currentImage={this.state.currentImage}
                            setCurrentImage={this.setCurrentImage} addProductToCart={this.props.addProductToCart}
                            handleAttributeChange={this.props.handleAttributeChange}
                            chosenAttributes={this.props.chosenAttributes} currentCurrency={this.props.currentCurrency}
                            checkAttributesReady={this.checkAttributesReady} />
    }
}

let mapStateToProps = (state) => ({
    product: getProductInfo(state),
    chosenAttributes: getChosenAttributes(state),
    currentCurrency: getCurrentCurrency(state)
})

export default compose(withRouter, connect(mapStateToProps, {addProductToCart,
                                                                            setProductInfo,
                                                                            handleAttributeChange}))(ProductInfoContainer)