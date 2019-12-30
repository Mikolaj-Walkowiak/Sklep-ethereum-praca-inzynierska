import React, { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'
import Dropdown from 'react-dropdown'
class BuyProduct extends Component {
    itemStatus(product) {
        return !product.purchased && product.owner != this.props.account
                      ? '#f5f5f5'//white
                      : !product.purchased && product.owner == this.props.account? '#dbf2d8'://green
                      product.purchased && product.owner == this.props.account? '#d9f8ff' ://aqua
                      '#ffa3a8'//red
    }

    render() {
        return (
            <div className="col-lg-12">
                <h2>Buy Product</h2>
               
                <div className="row">
                {this.props.products.map((product, key) => {
                    return (
                        <div key={key}>
                        <Link style={{ textDecoration: 'none', color: 'black' }} to={{pathname: "/ProductDescription", state:{product: product}}} >
                        <div className="p-2" style={{width: '300px', cursor: 'pointer'}} >
                            <div className="card card-body mb-3" style={{background: this.itemStatus(product)}}>
                                <div className="media d-block d-md-flex">
                                    <div className="media-body text-center text-md-left ml-md-3 ml-0">
                                        <p className="h4">{product.name}</p>
                                        <div style={{height: '250px'}}>
                                            {product.imageSource !== ""
                                                ? <img src={`https://ipfs.infura.io/ipfs/${product.imageSource}`} style={{width: '100%'}} />
                                                : 'No photo'}

                                        </div>
                                        <p className="h6 text-md-right">{product.price} Eth</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </Link>
                        </div>
                    );
                }  
        )}
        </div>
        </div>
        )

    }
}

export default BuyProduct;
