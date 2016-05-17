var mongoose = require('./libs/mongodb');

var schema = mongoose.Schema({
    name: String
});

schema.methods.meow = function () {
    console.log(this.get('name') + ' meow');
};

var Cat = mongoose.model('Cat', schema);
var kitty = new Cat({name: 'Slider'});
kitty.save(function (err, kitty, affected) {
    kitty.meow();
});