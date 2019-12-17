const Marketplace = artifacts.require('./Marketplace.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async() => {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async() => {
        it('deployed successfully', async() =>{
            const address = await Marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, undefined)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
        })
    })

    describe('products', async() => {
        let result, productCounter
        before(async() => {
            result = await marketplace.CreateProduct('Hlep','smaczne', web3.utils.toWei('0.5', 'Ether'),{from: seller})
            productCounter = await marketplace.productCounter()
        })
        it('created product', async() =>{
            assert.equal(productCounter, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCounter, 'id is correct')
            assert.equal(event.name,'Hlep' , 'name is correct')
            assert.equal(event.description,'smaczne' , 'description is correct')
            assert.equal(event.price,'500000000000000000' , 'price is correct')
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchased, false, 'purchased is correct')
            //Failures
            await marketplace.CreateProduct('', web3.utils.toWei('0.5', 'Ether'),{from: seller}).should.be.rejected;
            await marketplace.CreateProduct('Hlep', '',{from: seller}).should.be.rejected;
        })

        it('read product', async() =>{
            const product = await marketplace.products(productCounter)
            assert.equal(product.id.toNumber(), productCounter, 'id is correct')
            assert.equal(product.name,'Hlep' , 'name is correct')
            assert.equal(product.price,'500000000000000000' , 'price is correct')
            assert.equal(product.owner, seller, 'owner is correct')
            //failures
            await marketplace.CreateProduct('', web3.utils.toWei('0.5', 'Ether'),{from: seller}).should.be.rejected;
            await marketplace.CreateProduct('Hlep', '',{from: seller}).should.be.rejected;
        })

        it('buy product', async() =>{
            let OldSellerBalance
            OldSellerBalance = await web3.eth.getBalance(seller)
            OldSellerBalance = new web3.utils.BN(OldSellerBalance)
            result = await marketplace.BuyProduct(productCounter, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')})
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCounter, 'id is correct')
            assert.equal(event.name,'Hlep' , 'name is correct')
            assert.equal(event.price,'500000000000000000' , 'price is correct')
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchased, true, 'purchased is correct')
            //check if paid

            let NewSellerBalance
            NewSellerBalance = await web3.eth.getBalance(seller)
            NewSellerBalance = new web3.utils.BN(NewSellerBalance)
            let price
            price = web3.utils.toWei('0.5', 'Ether')
            price = new web3.utils.BN(price)
            const expected = OldSellerBalance.add(price)
            assert.equal(expected.toString(), NewSellerBalance.toString()) //doesnt pass otherwise 
            //failures
            await marketplace.BuyProduct(productCounter+1, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            await marketplace.BuyProduct(productCounter+1, {from: buyer, value: web3.utils.toWei('0.3', 'Ether')}).should.be.rejected;
            await marketplace.BuyProduct(productCounter+1, {from: deployer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            await marketplace.BuyProduct(productCounter+1, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;


        })
    })
})

