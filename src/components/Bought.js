import React, { Component } from 'react';
import Web3 from 'web3';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
class Bought extends Component {
  constructor(props) {
    super(props)
    this.state = {
      didBuy: false,
      bought: []
    }
  }
  async componentWillMount() {
    await this.loadbought()
  }
  async lowerScore(adr, ind){
    console.log(this.props.account)
    await this.props.shop.Badmerchant(adr,ind).send({from:this.props.account})
  }
  async loadbought() {
    var tmp = this.props.account
    console.log('address', tmp)
    const len = await this.props.shop.getBoughtLen(tmp).call()
    console.log('len', len)
    if (len > 0) {
      this.setState({ didBuy: true })
      for (var i = 0; i < len; ++i) {
        const bought = await this.props.shop.bought(tmp, i).call()
        bought["name"]= (await this.props.shop.products(bought.id).call()).name
        bought["price"] =  window.web3.utils.fromWei((await this.props.shop.products(bought.id).call()).price.toString(), 'Ether') + "Eth"
        console.log('bought', bought)
        var score = await this.props.shop.okmerchant(bought.orgOwner).call()
        console.log("score",score)
        this.setState({ bought: [...this.state.bought, bought] })
        
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
        <h2>Bought</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Seller</th>
              <th scope="col">Price</th>
              <th scope="col">Report</th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.state.bought.map((product, key) => {
              return (
                <tr key={key}>
                  <td>{product.name}</td>
                  <td>{product.orgOwner}</td>
                  <td>{product.price}</td>
                  <td>
                    {<button
                      name={product.id}
                      onClick={(event) => {
                        console.log(product.name)
                        this.lowerScore(product.orgOwner,product.id)
                      }}
                    >
                      Did not recieve
                        </button>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );

  }
}
export default Bought;