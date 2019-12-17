import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {//from https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    //console.log(accounts)
    this.setState({ account: accounts[0] })//react component state
    //console.log(Marketplace.abi, Marketplace.networks[5777].address)
    const networkId = await web3.eth.net.getId()
    if(Marketplace.networks[networkId]){
    const marketplace = web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address)
    //console.log(market)
    this.setState({marketplace})//same as marketplace: marketplace
    const productCount = await marketplace.methods.productCounter().call()
    this.setState({productCount})
    for(var i =1; i<=productCount; ++i){
      const product = await marketplace.methods.products(i).call()
      this.setState({products: [...this.state.products, product]})
    }
    console.log(this.state.products)
    //console.log(productCount.toString())
    this.setState({loading: false})
    }else{window.alert('Marketplace not deployed to network')}//in case user is connected to wrong network
    
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
    this.CreateProduct = this.CreateProduct.bind(this)
    this.BuyProduct = this.BuyProduct.bind(this)
  }

  CreateProduct(name,description,price){
    this.setState({loading: true})
    this.state.marketplace.methods.CreateProduct(name,description,price)
    .send({from: this.state.account}).once('receipt', (receipt)=>{
      this.setState({loading: false})
    })
  }
  BuyProduct(id,price){
    this.setState({loading: true})
    this.state.marketplace.methods.BuyProduct(id)
    .send({from: this.state.account, value: price}).once('receipt', (receipt)=>{
      this.setState({loading: false})
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              {this.state.loading ? 
              <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
              : <Main 
                    CreateProduct={this.CreateProduct} 
                    BuyProduct={this.BuyProduct} 
                    products={this.state.products}
                    account={this.state.account}
                    />
              }
           </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
