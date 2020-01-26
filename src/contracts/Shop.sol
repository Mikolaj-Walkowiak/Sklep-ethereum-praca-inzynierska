pragma solidity ^0.5.0;

contract Shop{
    string public name;
    uint public productTotal = 0;
    mapping (uint =>Product) public products; // conects ids with whole struct
    mapping (address =>Sold[]) public sold;
    mapping (address =>Sold[]) public bought;
    mapping (address =>merchantScore) public okmerchant;
    mapping (uint => bool) isFaulty;

    struct merchantScore{
        uint[] list;
        uint sold;
        uint okmerchant;
    }
    struct Sold{
        address Owner;
        address orgOwner;
        uint id;
        string adr;//homeadresss
    }
    struct Product{
        uint id;
        string name;
        string description;
        uint price;
        string imageSource;
        address payable owner; //whomst owns the product, changable
        bool purchased;
    }

     constructor() public{
        name = "AllegroDestroyer";
    }
    //functions
    function CreateProduct(string memory Name,string memory Description, uint Price) public{
        require(bytes(Name).length > 0,'Invalid name');
        require(Price > 0,'Invalid price');
        productTotal++;
        products[productTotal] = Product(productTotal,Name,Description,Price,"",msg.sender,false);
        emit CreatedProduct(productTotal,Name,Description,Price,msg.sender,false);
    }
    //with picture
    function CreateProductImage(string memory Name,string memory Description,string memory image, uint Price) public{
        require(bytes(Name).length > 0,'Invalid name');
        require(Price > 0,'Invalid price');
        productTotal++;
        products[productTotal] = Product(productTotal,Name,Description,Price,image,msg.sender,false);
        emit CreatedProductImage(productTotal,Name,Description,image,Price,msg.sender,false);
    }

    function Badmerchant(address naughtymerchant, uint id) public {
        if(!isFaulty[id]){
        okmerchant[naughtymerchant].okmerchant -= 1;
        isFaulty[id] = true;
        }
    }

    function BuyProduct(uint Id, string memory _address) public payable{

        Product memory product = products[Id];
        address payable seller = product.owner;
        require(product.price == msg.value, 'What are you trying to pay here');
        require(Id>0 && Id <= productTotal,'Product ID out of bounds');
        require(!product.purchased,'You`re too late');
        require(seller != msg.sender, 'Its already yours');
        Sold memory tmp = Sold(msg.sender,product.owner,product.id,_address);
        sold[product.owner].push(tmp);
        bought[msg.sender].push(tmp);
        merchantScore memory merchant = okmerchant[product.owner];
        merchant.sold += 1;
        merchant.okmerchant += 1;
        okmerchant[product.owner] = merchant;
        //change ownership
        product.owner = msg.sender;
        product.purchased = true;
        products[Id] = product;
        //pay the man
        address(seller).transfer(msg.value);
        emit ProductBought(productTotal,product.name,product.price,msg.sender,true);
    }

    function getBoughtLen(address index) public view returns(uint) {
        return (bought[index].length);
    }
    function getSoldLen(address index) public view returns(uint) {
        return (sold[index].length);
    }

    //events
    event CreatedProduct(
        uint id,
        string name,
        string description,
        uint price,
        address payable owner,
        bool purchased
    );

    event CreatedProductImage(
        uint id,
        string name,
        string description,
        string imageSource,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductBought(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

}

