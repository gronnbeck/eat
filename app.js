var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var app = express();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/eat');

var Dish = mongoose.model('Dish', {
  title: { type: String, index: { unique: true } }
});

app.use(bodyParser.json());

app.get('/', function(req,res) {
  Dish.find({})
    .sort({title: 'asc'})
    .exec(function(err, results) {
      if (err) {
        return res
          .status(500)
          .send({ success: false });
      }

      return res
        .send({ success: true, dishes: results });
    });
});

app.get('/random', function(req, res) {
  Dish.find({})
    .exec(function (err, dishes) {
      if (err) {
        return res
          .status(500)
          .send({ success: false })
      }

      var i = Math.floor(Math.random() * dishes.length);
      var dish = dishes[i];

      return res
        .send({ success: true, dish: dish })
    });
});

app.post('/', function(req, res) {

  var dish = new Dish(req.body);
  dish.save(function(err) {
    if (err) {
      return res
        .status(500)
        .send({success: false });
    }

    return res
      .send({success: true, dish: dish })
  })
});

var server = app.listen(process.env.PORT || 8000, function() {
  console.log('listening on port %d', server.address().port);
});
