import React from 'react'
import NumericInput from 'react-numeric-input'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })


class AddProduct extends React.Component {
  constructor(props){
    super(props)
  
    this.state={
      buffer: null,
      hash: null,
      disabled: false
    };
  }
  handleClick() {
    this.setState( {disabled: !this.state.disabled} )
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
  
  
  Submit = (event) => {
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error)
        return
      }
      this.setState({ hash: result[0].hash })
      console.log(this.state.hash)
      this.handleClick()
      
    })
  
  }
  
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
      <div>
        <h1>Add Product</h1>
        <form onSubmit={this.Submit, this.AddToDatabase}>
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
               />
          </div>
          <div className="form-group mr-sm-2">
            <input 
              id="productPrice"
              ref={(input) => {this.productPrice = input }}
              className="form-control"  
              placeholder="Product Price"
              required
              input type="text" pattern="[0-9]+([\.,][0-9]+)?" />
          </div>
          <div>
            <input type='file' onChange={e => { this.handleClick(); this.captureFile(e) }} /> 
            <input type='button' value="Confirm" onClick={this.Submit} />
          </div>
          <button type="submit"
           className="btn btn-primary"
           disabled = {(this.state.disabled)? "disabled" : ""}
           >Add Product</button>
        </form>
      </div>
    )
  }
} export default AddProduct