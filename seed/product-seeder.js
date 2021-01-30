var Product = require('../models/product');

var mongoose = require('mongoose');
const { exists } = require('../models/product');
mongoose.connect('mongodb://localhost:27017/shopping',{useNewUrlParser: true,useUnifiedTopology: true});

var products = [
new Product({
    imagePath: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/07/260089-27-natural-and-organic-baby-products-1296x728-Header-1024x575.jpg?w=1155&h=1528",
    title: "Baby Products",
    description: "People who wish to purchase and use organic products for their baby may find the selection overwhelming. There are countless products on the market that claim to be natural or organic.",
    price: "500"
}),
new Product({
    imagePath: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/07/260089-27-natural-and-organic-baby-products-1296x728-Header-1024x575.jpg?w=1155&h=1528",
    title: "Baby Products",
    description: "People who wish to purchase and use organic products for their baby may find the selection overwhelming. There are countless products on the market that claim to be natural or organic.",
    price: "500"
}),
new Product({
    imagePath: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/07/260089-27-natural-and-organic-baby-products-1296x728-Header-1024x575.jpg?w=1155&h=1528",
    title: "Baby Products",
    description: "People who wish to purchase and use organic products for their baby may find the selection overwhelming. There are countless products on the market that claim to be natural or organic.",
    price: "500"
}),
new Product({
    imagePath: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/07/260089-27-natural-and-organic-baby-products-1296x728-Header-1024x575.jpg?w=1155&h=1528",
    title: "Baby Products",
    description: "People who wish to purchase and use organic products for their baby may find the selection overwhelming. There are countless products on the market that claim to be natural or organic.",
    price: "500"
})
];

var done=0;
for (var i = 0 ; i< products.length; i++){
    products[i].save(function(err,result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}

