import React, { Component } from 'react';
import Web3 from 'web3';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
class Sold extends Component {
  constructor(props) {
    super(props)
    this.state = {
      didSell: false,
      sold: []
    }
  }
  async componentWillMount() {
    await this.loadsold()
  }

  async loadsold() {
    var tmp = this.props.account
    console.log('address', tmp)
    const len = await this.props.shop.getSoldLen(tmp).call()
    console.log('len', len)
    if (len > 0) {
      this.setState({ didSell: true })
      for (var i = 0; i < len; ++i) {
        const sold = await this.props.shop.sold(tmp, i).call()
        sold["name"]= (await this.props.shop.products(sold.id).call()).name
        sold["price"] =  window.web3.utils.fromWei((await this.props.shop.products(sold.id).call()).price.toString(), 'Ether') + "Eth"
        console.log('sold', sold)
        this.setState({ sold: [...this.state.sold, sold] })
        
      }
      
      
    }
  }

  render() {

    return (
      /*struct Sold{
          address Owner;
          address orgOwner;
          uint id;
          string adr;
          bool reported;
      }*/
      <div>
        <h2>Sold</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Buyer</th>
              <th scope="col">Price</th>
              <th scope="col">Address</th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.state.sold.map((product, key) => {
              return (
                <tr key={key}>
                  <td>{product.name}</td>
                  <td>{product.Owner}</td>
                  <td>{product.price}</td>
                  <td>{product.adr}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );

  }
}
export default Sold;