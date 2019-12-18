import React, { Component } from 'react';
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class Main extends Component {
  constructor(props){
    super(props)

    this.state={
      buffer: null,
      hash: null
    };
  }


  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      //console.log('buffer', this.state.buffer)
    }
  }


  Submit = (event) =>{
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
         this.setState({ hash: result[0].hash })
         console.log(this.state.hash)
    })

  }
  
  AddToDatabase = (event) => {
    event.preventDefault()
      const name = this.productName.value
      const description = this.productDescription.value
      const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
      if(this.state.buffer){
        console.log(this.state.hash)        
        this.props.CreateProductImage(name, description,this.state.hash, price)
      }else{this.props.CreateProduct(name, description, price)}
  }
    
    //, this.AddToDatabase
  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={this.AddToDatabase}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productDescription"
              type="text"
              ref={(input) => { this.productDescription = input }}
              className="form-control"
              placeholder="Product Description"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <div>
                  <input type='file' onChange={this.captureFile} />
                  <input type='button' value="Confirm"  onClick={this.Submit}/>
                </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>

        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
          { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>{product.imageSource !== "" 
                  ?<img src={`https://ipfs.infura.io/ipfs/${product.imageSource}`}/>
                  :'No photo'}</td>
                  <td>
                    { !product.purchased && product.owner != this.props.account
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.BuyProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : !product.purchased && product.owner == this.props.account? 'Selling':
                      product.purchased && product.owner == this.props.account? 'Bought' :
                      'Sold'
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

export default Main;
