import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'


class ProductDescription extends Component {
    render() {
        if (this.props.location.state.product == null) {
            return <Redirect to='/' />
        }

        const product = this.props.location.state.product
        
        return (
            <div className="col-lg-12 border border-light row d-flex justify-content-center" style={{ height: '100vh' }}>
                <div className="col-lg-12 p-2">
                    <Link to="/"><button className="btn btn-info m-2" >Go Back</button></Link>
                    <div className="card card-body mb-3">
                        <div className="media d-block d-md-flex">
                            <div className="media-body text-center text-md-left ml-md-3 ml-0">
                                <p className="h4">{product.name}</p>
                                <div className="row">
                                    {product.imageSource !== ""
                                        ? <img src={`https://ipfs.infura.io/ipfs/${product.imageSource}`} style={{ width: '30%' }} />
                                        : 'No photo'}
                                    <div className="p-2 col-sm-6">
                                        {product.description}
                                    </div>
                                </div>
                                <p className="h6 text-md-right">Cena: {product.price} Eth</p>
                                <div className="col-md-2" style={{ float: 'right' }}>
                                    <button className="btn btn-success p-2" style={{ float: 'right', margin: '5px' }}
                                    name={product.id.toString()*1}
                                    value={window.web3.utils.toWei(product.price, 'Ether')}
                                        onClick={(event) => {
                                            this.props.BuyProduct(event.target.name, event.target.value)
                                        }}>Buy</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default ProductDescription;