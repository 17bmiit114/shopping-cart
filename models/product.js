var mongoose = require('mongoose');
var Myschema = mongoose.Schema;

var newSchema = new Myschema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true}
});

module.exports = mongoose.model('Product', newSchema);