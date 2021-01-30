var mongoose = require('mongoose');
var Myschema = mongoose.Schema;

var newSchema = new Myschema({
    user: {type: Myschema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', newSchema);