import React, { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

class ShipmentDetails extends Component {
    AddToDatabase = (event) => {
        event.preventDefault()
        const name = this.productName.value
        const description = this.productDescription.value
        const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
        if (this.state.buffer) {
            console.log(this.state.hash)
            this.props.CreateProductImage(name, description, this.state.hash, price)
        } else { this.props.CreateProduct(name, description, price) }
    }
    
    render() {
        
        return (
            <div id="content">
        <h1>Enter your address</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const address = this.name.value
          + `####` + this.surname.value
          + `####` + this.country.value
          + `####` + this.streetname.value
          + `####` + this.bulildingnumber.value
          + `####` + this.zipcode.value
          + `####` + this.city.value
          const name= this.props.location.state.product.id
          const value=window.web3.utils.toWei(this.props.location.state.product.price, 'Ether')
          
          this.props.BuyProduct(name, value, address)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="name"
              type="text"
              ref={(input) => { this.name = input }}
              className="form-control"
              placeholder="Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="surname"
              type="text"
              ref={(input) => { this.surname = input }}
              className="form-control"
              placeholder="Surname"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="country"
              type="text"
              ref={(input) => { this.country = input }}
              className="form-control"
              placeholder="Country"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="streetname"
              type="text"
              ref={(input) => { this.streetname = input }}
              className="form-control"
              placeholder="Street Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="buildingnumber"
              type="text"
              ref={(input) => { this.bulildingnumber = input }}
              className="form-control"
              placeholder="Building Number Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="zipcode"
              type="text"
              ref={(input) => { this.zipcode = input }}
              className="form-control"
              placeholder="Zip Code"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="city"
              type="text"
              ref={(input) => { this.city = input }}
              className="form-control"
              placeholder="City"
              required />
          </div>
          
          <button type="submit" className="btn btn-primary">Buy Product</button>
        </form>
        </div>
        )
    }
} export default ShipmentDetails