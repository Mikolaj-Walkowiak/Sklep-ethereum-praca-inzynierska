pragma solidity ^0.5.0;

contract Marketplace{
    string public name;
    uint public productCounter = 0;
    mapping (uint =>Product) public products; // conects ids with whole struct

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
        name = "Inzynierka_exe Marketplace";
    }

    //functions
    function CreateProduct(string memory Name,string memory Description, uint Price) public{
        require(bytes(Name).length > 0,'Invalid name');
        require(Price > 0,'Invalid price');
        productCounter++;
        products[productCounter] = Product(productCounter,Name,Description,Price,"",msg.sender,false);
        emit CreatedProduct(productCounter,Name,Description,Price,msg.sender,false);
    }
    //with picture
    function CreateProductImage(string memory Name,string memory Description,string memory image, uint Price) public{
        require(bytes(Name).length > 0,'Invalid name');
        require(Price > 0,'Invalid price');
        productCounter++;
        products[productCounter] = Product(productCounter,Name,Description,Price,image,msg.sender,false);
        emit CreatedProductImage(productCounter,Name,Description,image,Price,msg.sender,false);
    }

    function BuyProduct(uint Id) public payable{
        Product memory product = products[Id];
        address payable seller = product.owner;
        require(product.price == msg.value, 'What are you trying to pay here OwO');
        require(Id>0 && Id <= productCounter,'Product ID out of bounds');
        require(!product.purchased,'You`re too late');
        require(seller != msg.sender, 'Its already yours');
        //change ownership
        product.owner = msg.sender;
        product.purchased = true;
        products[Id] = product;
        //pay the man
        address(seller).transfer(msg.value);
        emit ProductBought(productCounter,product.name,product.price,msg.sender,true);
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

