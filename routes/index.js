var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product= require('../models/product');
var Order = require('../models/order');
const user = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];

  var products=Product.find(function(err,docs){
    var productChunks = [];
    var chunkSize = 4;

    for (var i = 0; i < docs.length; i+=chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    
    res.render('shop/index', { title: 'Shopping cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  }).lean();
});

router.get('/add_to_cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  Product.findById(productId, function(err, product){
    if(err){
      res.redirect('/');
    }
    cart.add(product, product.id); 
    req.session.cart = cart;
    
    //console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  cart.reduceByOne(productId);
  req.session.cart= cart;
  return res.redirect('/shopping_cart');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  cart.removeItem(productId);
  req.session.cart= cart;
  return res.redirect('/shopping_cart');
});

router.get('/shopping_cart', function(req, res, next){
  if(!req.session.cart){
      return res.render('shop/shopping_cart', {products: null});
  }
  var errMsg = req.flash('error')[0];
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping_cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.get('/checkout', isLoggedIn, function(req, res, next){
  if(!req.session.cart){
    return res.redirect('shop/shopping_cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, async function(req, res, next) {
  if (!req.session.cart) {
      return res.redirect('/shopping_cart');
  }
  var cart = new Cart(req.session.cart);
  
  var stripe = require("stripe")("sk_test_51IDNKtIVaTKuotVnMzNDsgAmwEJRO8KI6JQiCaqWbi4l9HHLU8RrLVDvLjG5ECrT3TYXy1Xkfpna2Gi4TNPdWDKh00swsBrMqC");

  //await stripe.paymentIntents.create
  stripe.charges.create({
      amount: cart.totalPrice*100,
      currency: "inr",
      //payment_method_types: ["card"],
      source:  req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge"
      //payment_method: "pm_card_visa" ,
      //confirm: true
  },function(err, charge) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id,
      });
      order.save(function(err, result){
        if(err){
          req.flash('error', err.message);
          return res.redirect('shop/shopping-cart');
        }
        req.flash('success', 'Successfully bought product!!!');
        req.session.cart = null;
        res.redirect('/');
      });
  }); 
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}