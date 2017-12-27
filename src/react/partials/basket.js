var React = require('react');
var axios = require('axios');

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme({
    palette: {
        accent1Color: '#f08700',
        secondary2color: '#f08700'
    }
});

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CounterInput from 'react-bootstrap-counter';
import update from 'react-addons-update';

class Basket extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.calculator = this.calculator.bind(this);
        this.totalPrice = this.totalPrice.bind(this);
        this.state = {
            totalPrice: "",
            differencialPrice: "",
            finished: false,
            taxValue: 5,
            checkTax: false,
            categorie: [],
            productList: [],
            finalProductList: [],
            addedProducts: [],
            minOrder: "",
            driveTax: "",
            otherTax: "",
            description: "",
            taxOne: "",
            taxTwo: "",
            taxThree: "",
            taxFour: ""
        };
        console.log(this.state.finalProductList);
    }

    componentDidMount() {
        let _this = this;
        this.serverRequest = axios
            .get("http://localhost:4000/assets/json/results.json")
            .then(function(result) {
                let driveTaxSum = Math.round(parseFloat(result.data.driveTax) * 100) / 100;
                let minOrderSum = Math.round(parseFloat(result.data.minOrder) * 100) / 100;
                let totalPriceFirstSum = driveTaxSum + minOrderSum;
                var convertedTotalPrice = new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2
                });
                _this.setState({
                    categorie: result.data.categorie,
                    minOrder: result.data.minOrder,
                    driveTax: result.data.driveTax,
                    totalPrice: convertedTotalPrice.format(totalPriceFirstSum),
                    otherTax: result.data.otherTax,
                    description: result.data.description,
                    productList: result.data.productList,
                    finalProductList: result.data.productList,
                    taxOne: result.data.taxOne,
                    taxTwo: result.data.taxTwo,
                    taxThree: result.data.taxThree,
                    taxFour: result.data.taxFour
                });
            });            

    }

    componentWillUnmount() {
        this.serverRequest.abort();
        console.log(this.state.finalProductList);
    }

    toggleCheckbox() {
        if(this.state.checkTax == false) {
            this.setState({
                checkTax: true
            }, this.totalPrice);
        } else {
            this.setState({
                checkTax: false
            }, this.totalPrice);
        }
    }

    addProduct(item) {

        let arrayAddedProducts = this.state.addedProducts;
        if(arrayAddedProducts.map(function(x) {return x.id; }).indexOf(item.id) == -1) {
            //let updateArrayAddedMeals = arrayAddedProducts.slice();
            arrayAddedProducts.push(item);
            this.setState({
                addedProducts: arrayAddedProducts
            }, this.totalPrice);
        }
    }

    removeProduct(item) {

        this.setState({
            addedProducts: this.state.addedProducts.filter(function (e, i) {
                return i !== item;
            })
        }, this.totalPrice);

    }

    calculator (value, i, basketId) {

        let number = value; // 1
        let id = basketId - 1;
        let productPrice = this.state.finalProductList[id].productPrice; // 12,45
        let convertedProductPrice = Number(productPrice);
        let endProductPrice = number * convertedProductPrice; // 12,45 * 3
        let stringEndProductPrice = endProductPrice.toString(); // 40

        this.setState({
            addedProducts: update(this.state.addedProducts, {
                [i]: {
                    productPrice: {$set: stringEndProductPrice},
                    number: {$set: value}
                }
            })
        }, this.totalPrice);
    }

    handleChange (event, index, taxValue) {
        this.setState({
            taxValue: taxValue
        }, this.totalPrice);

        let productList = this.state.productList;
        let addedProducts = this.state.addedProducts;

        if(taxValue == 1) {

            var productTax = this.state.taxOne;

        } if (taxValue == 2) {

            var productTax = this.state.taxTwo;

        } if (taxValue == 3) {

            var productTax = this.state.taxThree;

        } if (taxValue == 4) {

            var productTax = this.state.taxFour;

        }

        if (taxValue == 5) {

            var oldProductListState = this.state.productList;

            var oldProductList = productList.map((product) => {
                let newObj = {id:product.id,mainTitle:product.mainTitle, subTitle:product.subTitle, productPrice: product.productPrice};
                return newObj;
            });

            var oldAddedProduct = addedProducts.map((product) => {
                var numberOfProductPlusProductPrice = parseFloat(productList[product.id - 1].productPrice) * product.number;
                var finalnumberOfProductPlusProductPrice = Math.round(numberOfProductPlusProductPrice * 100) / 100;
                let newObj = {id:oldProductListState[product.id - 1].id ,mainTitle:oldProductListState[product.id - 1].mainTitle, subTitle:oldProductListState[product.id - 1].subTitle, productPrice: finalnumberOfProductPlusProductPrice, number: product.number};
                return newObj;
            });

            this.setState({
                finalProductList: oldProductList,
                addedProducts: oldAddedProduct
            }, this.totalPrice);

        } else {

            var updatedFinalTaxProductList = productList.map((product) => {

                let updatedValue = parseFloat(product.productPrice);
                let updatedProcentValue = updatedValue * productTax / 100;
                let ValuePlusTax =  updatedValue + updatedProcentValue;
                let finalProcentValue = Math.round(ValuePlusTax * 100) / 100;

                let newObj = {id:product.id,mainTitle:product.mainTitle, subTitle:product.subTitle, productPrice: finalProcentValue, number: product.number};
                return newObj;
            });

            var updatedFinalTaxAddedProducts = addedProducts.map((product) => {
                let getIDofAddedProduct = product.id - 1;

                let getProductPriceWithListID = productList[getIDofAddedProduct].productPrice;
                let updatedValue = parseFloat(getProductPriceWithListID);
                let updatedProcentValue = updatedValue * productTax / 100;
                let ValuePlusTax =  updatedValue + updatedProcentValue;

                let updatedProductPriceWithProductNumber = ValuePlusTax * product.number;
                let finalProcentValue = Math.round(updatedProductPriceWithProductNumber * 100) / 100;


                let newObj = {id:product.id,mainTitle:product.mainTitle, subTitle:product.subTitle, productPrice: finalProcentValue, number: product.number};
                return newObj;

            });

            this.setState({
                finalProductList: updatedFinalTaxProductList,
                addedProducts: updatedFinalTaxAddedProducts
            }, this.totalPrice);

        }
    }

    totalPrice () {

        var sum = 0;
        var differencialSum = 0;

        if(this.state.checkTax == true) {

            for (let i = 0; i < this.state.addedProducts.length; i++) {
                let productPrice = parseFloat(this.state.addedProducts[i].productPrice);
                let finalProductPrice = Math.round(productPrice * 100) / 100;
                differencialSum = differencialSum + finalProductPrice;

                if(differencialSum > Math.round(parseFloat(this.state.minOrder) * 100) / 100) {
                    sum = differencialSum + Math.round(parseFloat(this.state.driveTax) * 100) / 100;
                } else {
                    sum = Math.round(parseFloat(this.state.driveTax) * 100) / 100 + Math.round(parseFloat(this.state.minOrder) * 100) / 100;
                }
            }

            sum = sum + Math.round(parseFloat(this.state.otherTax) * 100) / 100;

        } else {

            for (let i = 0; i < this.state.addedProducts.length; i++) {
                let productPrice = parseFloat(this.state.addedProducts[i].productPrice);
                let finalProductPrice = Math.round(productPrice * 100) / 100;
                differencialSum = differencialSum + finalProductPrice;

                if(differencialSum > Math.round(parseFloat(this.state.minOrder) * 100) / 100) {
                    sum = differencialSum + Math.round(parseFloat(this.state.driveTax) * 100) / 100;
                } else {
                    sum = Math.round(parseFloat(this.state.driveTax) * 100) / 100 + Math.round(parseFloat(this.state.minOrder) * 100) / 100;
                }
            }

            if(typeof this.state.addedProducts !== 'undefined' && this.state.addedProducts.length > 0 || sum == 0) {

            } else {
                sum = sum - Math.round(parseFloat(this.state.otherTax) * 100) / 100;
            }
        }

        differencialSum = Math.round(parseFloat(this.state.minOrder) * 100) / 100 - differencialSum;

        var convertedProductPrice = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        });

        this.setState({
            totalPrice: convertedProductPrice.format(sum),
            differencialPrice: differencialSum
        });
    }

    render() {
        var convertedProductPrice = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        });
        var ifTax;
        if (this.state.checkTax) {
            ifTax = (
                <div className="basket-other-tax">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <span>Aufpreis</span>
                        </div>
                        <div className="col-md-4 col-xs-12">
                            <span>{convertedProductPrice.format(this.state.otherTax)}</span>
                        </div>
                    </div>
                </div>
            )
        }
        var ifDifferencialSum;
        if( Math.round(parseFloat(this.state.differencialPrice) * 100) / 100 >= 0) {
            ifDifferencialSum = (
                <div className="basket-minorder-tax">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <span>Differenzbetrag (zu {convertedProductPrice.format(this.state.minOrder)} Mindestbestellwert)</span>
                        </div>
                        <div className="col-md-4 col-xs-12">
                            <span>{convertedProductPrice.format(this.state.differencialPrice)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="basket">
                    <div className="row flex-wrapper">
                        <div className="col-md-3 col-xs-12 border-right">
                            <div className="basket-description-wrapper">
                                <div className="basket-description-headline">
                                    <h2>Details</h2>
                                </div>
                                <div className="basket-categories">
                                    <i className="fa fa-cutlery"></i>
                                    {this.state.categorie.map((categories) => {
                                        return (
                                            <div className="basket-categorie">
                                                {categories},
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="basket-min-order">
                                    <i className="fa fa-shopping-cart"></i> Mindestbestellwert {convertedProductPrice.format(this.state.minOrder)}
                                </div>
                                <div className="basket-drive-tax">
                                    <i className="fa fa-car"></i> Anfahrtsgebühr {convertedProductPrice.format(this.state.driveTax)}
                                </div>
                                <div className="basket-description">
                                    {this.state.description}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 col-xs-12 border-right">
                            <div className="basket-product-list-wrapper">
                                <div className="basket-product-list-headline">
                                    <h2>Produkte</h2>
                                </div>
                                <div className="product-list">
                                    {this.state.finalProductList.map((meal, key) => {
                                        return (
                                            <div key={key} id={meal.id} value={key} className="row">
                                                <div className="col-md-9 col-xs-12">
                                                    <div className="product-title">
                                                        {meal.mainTitle}
                                                    </div>
                                                    <div className="product-subtitle">
                                                        {meal.subTitle}
                                                    </div>
                                                </div>
                                                <div className="col-md-2 col-xs-12">
                                                    <div className="basket-product-price">
                                                        {convertedProductPrice.format(meal.productPrice)}
                                                    </div>
                                                </div>
                                                <div className="col-md-1 col-xs-12">
                                                    <div className="addProduct" onClick={this.addProduct.bind(this, meal)}>
                                                        <i className="fa fa-shopping-cart fa-2x"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-xs-12">
                            <div className="basket-wrapper">
                                <form>
                                    <div className="basket-extra-tax">
                                        <label><i className="fa fa-users"></i> Extra prozentuale Gebühr?</label>
                                        <SelectField
                                            value={this.state.taxValue}
                                            floatingLabelStyle={{color: '#4d4d4d', fontFamily:'Roboto', fontSize:'19px', top:'25px'}}
                                            underlineStyle={{ borderColor: '#f08700', bottom:'0' }}
                                            labelStyle={{ color: '#4d4d4d' }}
                                            onChange={this.handleChange}>
                                            <MenuItem value={1} primaryText="1" />
                                            <MenuItem value={2} primaryText="2" />
                                            <MenuItem value={3} primaryText="3" />
                                            <MenuItem value={4} primaryText="4" />
                                            <MenuItem value={5} primaryText="ab 5" />
                                        </SelectField>
                                    </div>
                                    <div className="basket-extra-product-tax">
                                        <input id="otherTax" type="checkbox" name="extra-tax"/>
                                        <label htmlFor="otherTax" onClick={this.toggleCheckbox}>Soll das Deluxe-Paket gebcht werden?</label>
                                    </div>
                                    <div className="basket-products">
                                        <h2>Warenkorb</h2>
                                        <div id="basket-products">
                                            {this.state.addedProducts.map((basketProducts, i) => {
                                                return (
                                                    <div key={i} id={basketProducts.id} value={i} className="row">
                                                        <div className="col-md-8 col-xs-12">
                                                            {basketProducts.mainTitle}
                                                            <div onClick={this.removeProduct.bind(this, i)}>Entfernen</div>
                                                        </div>
                                                        <div className="col-md-4 col-xs-12">
                                                            <CounterInput
                                                                value={1}
                                                                min={1}
                                                                max={1000}
                                                                onChange={ (value) => {this.calculator(value, i, basketProducts.id) } } />
                                                            <span className="product-final-price">{convertedProductPrice.format(basketProducts.productPrice)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {ifDifferencialSum}
                                        <div className="basket-drive-tax">
                                            <div className="row">
                                                <div className="col-md-8 col-xs-12">
                                                    <span>Aufschlag</span>
                                                </div>
                                                <div className="col-md-4 col-xs-12">
                                                    <span>{convertedProductPrice.format(this.state.driveTax)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {ifTax}
                                    </div>
                                    <div className="basket-final-price">
                                        <div className="row">
                                            <div className="col-md-6 col-xs-12">
                                                <h3 className="final-price-description">Gesamtpreis</h3>
                                            </div>
                                            <div className="col-md-6 col-xs-12">
                                                <span className="final-price">{this.state.totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Basket;