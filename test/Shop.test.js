const Shop = artifacts.require('./Shop.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Shop', ([deployer, seller, buyer]) => {
    let shop

    before(async() => {
        shop = await Shop.deployed()
    })

    describe('deployment', async() => {
        it('deployed successfully', async() =>{
            const address = await Shop.address
            assert.notEqual(address, undefined)
            assert.notEqual(address, null)
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
        })
    })

    describe('product_no_img', async() => {
        let result, productTotal
        before(async() => {
            result = await shop.CreateProduct('Product_1','desc_1', web3.utils.toWei('0.5', 'Ether'),{from: seller})
            productTotal = await shop.productTotal()
        })
        it('created product', async() =>{
            assert.equal(productTotal, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productTotal, 'id ok')
            assert.equal(event.name,'Product_1' , 'name ok')
            assert.equal(event.description,'desc_1' , 'description ok')
            assert.equal(event.price,'500000000000000000' , 'price ok')
            assert.equal(event.owner, seller, 'owner ok')
            assert.equal(event.purchased, false, 'purchased ok')
            await shop.CreateProduct('', web3.utils.toWei('0.5', 'Ether'),{from: seller}).should.be.rejected;
            await shop.CreateProduct('Product_2', '',{from: seller}).should.be.rejected;
        })

        it('read product', async() =>{
            const product = await shop.products(productTotal)
            assert.equal(product.id.toNumber(), productTotal, 'id ok')
            assert.equal(product.name,'Product_1' , 'name ok')
            assert.equal(product.price,'500000000000000000' , 'price ok')
            assert.equal(product.imageSource,'' , 'imageSource ok')
            assert.equal(product.owner, seller, 'owner ok')
        })

        it('buy product', async() =>{
            let OldSellerBalance
            OldSellerBalance = await web3.eth.getBalance(seller)
            OldSellerBalance = new web3.utils.BN(OldSellerBalance)
            result = await shop.BuyProduct(productTotal, "",{from: buyer, value: web3.utils.toWei('0.5', 'Ether')})
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productTotal, 'id is correct')
            assert.equal(event.name,'Product_1' , 'name is correct')
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
            await shop.BuyProduct(productTotal+1, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            await shop.BuyProduct(productTotal+1, {from: buyer, value: web3.utils.toWei('0.3', 'Ether')}).should.be.rejected;
            await shop.BuyProduct(productTotal+1, {from: deployer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            await shop.BuyProduct(productTotal+1, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;


        })
    })


    describe('product_img', async() => {
        let result, productTotal
        before(async() => {
            result = await shop.CreateProductImage('Product_2','desc_2','test_url', web3.utils.toWei('0.5', 'Ether'),{from: seller})
            productTotal = await shop.productTotal()
        })
        it('created product', async() =>{
            assert.equal(productTotal, 2)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productTotal, 'id ok')
            assert.equal(event.name,'Product_2' , 'name ok')
            assert.equal(event.description,'desc_2' , 'description ok')
            assert.notEqual(event.imageSource, '', 'imageSource ok')
            assert.equal(event.price,'500000000000000000' , 'price ok')
            assert.equal(event.owner, seller, 'owner ok')
            assert.equal(event.purchased, false, 'purchased ok')
            await shop.CreateProduct('', web3.utils.toWei('0.5', 'Ether'),{from: seller}).should.be.rejected;
            await shop.CreateProduct('Product_2', '',{from: seller}).should.be.rejected;
        })


       
    })
})

