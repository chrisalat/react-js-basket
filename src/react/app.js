var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
import axios from 'axios';
import Basket from './partials/basket';

var $detail =  document.getElementById('js-basket');
if (typeof($detail) != 'undefined' && $detail != null) {
    ReactDOM.render(<Basket />, document.getElementById('js-basket'));
}
