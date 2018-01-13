//BASE SETUP
//====================================================================================================
//first we call the packages needed
var express = require("express");  //calls express
var app = express(); //defines my app using express
var bodyParser = require("body-parser");   //calls body-parser
var mongoose = require('mongoose');
var mongo = require('mongodb');
var env = process.env.NODE_ENV || 'development'; //reading the configuration specific to our current Node environment, if none is found, default to development
var config = require('./_config');

mongoose.connect("mongodb://localhost:27017/mydb"); //grabs the mongoose package and connects to my database

mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

var Event = require('../app/models/event');


//configure app to use body parser
//this will enable me to get data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR THE API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//middleware for all request
//This specifies what should be done every time any kind of request is made
router.use(function(req, res, next){
	console.log("Goodbye boredom..."); 
	next(); //This makes sure that the app goes on to the next route and doesn't stop here.
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/)
router.get('/', function(req, res) {
    res.send({ message: 'You must be bored!' });   
});


router.route('/admin/add_event')
 // create a new event (accessed at POST http://localhost:8080/admin/add_event)
	.post(function(req, res){
		var event = new Event();
		//create an event with the following parameters
		event.eventName = req.body.name;
		event.eventDescription = req.body.description;
		event.eventLocation["longitude"] = req.body.longitude;
  		event.eventLocation["latitude"]= req.body.latitude;
  		event.eventDuration["from"] = req.body.from_Date;
  		event.eventDuration["to"] = req.body.to_Date;
  		event.freeOrPaid = req.body.freeOrPaid;
  		event.eventPrices["regular"] = req.body.regular;
  		event.eventPrices["vip"] = req.body.vip;
  		event.eventPrices["vvip"]= req.body.vvip;
  		event.eventOrganisers = req.body.organisers;

  		//save the event
		event.save(function(err) {
            if (err)
                res.send(err);

            // res.json({ message: 'Event created!' });
            res.json(event);
        });
	});

router.route('/admin/events')
//get all events, accessed at 'GET https://localhost:8080/admin/events'
	.get(function(req, res){
	    Event.find(function(err, events){
	        if(err){res.send(err)};
	        res.json(events);
	    });
});

router.route('/admin/event/:event_id')
//get the event with this id, accessed at 'GET https://localhost:8080/admin/event/event_id'
	.get(function(req, res){
        Event.findById(req.params.event_id, function(err, event){
            if(err)
                res.send(err);
            res.json(event);
        });
     })

	//update the event with this id, accessed at 'PUT https://localhost:8080/admin/event/event_id'
	.put(function(req, res){
        Event.findById(req.params.event_id, function(err, event){
            if(err)
                res.send(err);
            //update the event's info
            event.eventName = req.body.name;
			      event.eventDescription = req.body.description;
			      event.eventLocation["longitude"] = req.body.longitude;
	  		    event.eventLocation["latitude"] = req.body.latitude;
	  		    event.eventDuration["from"] = req.body.from_Date;
	  		    event.eventDuration["to"] = req.body.to_Date;
	  		    event.freeOrPaid = req.body.freeOrPaid;
	  		    event.eventPrices["regular"] = req.body.regular;
	  		    event.eventPrices["vip"] = req.body.vip;
	  		    event.eventPrices["vvip"] = req.body.vvip;
	  		    event.eventOrganisers = req.body.organisers;
 
            
            //save the event
            event.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: "Event updated!!"});
            });
        });
     })

	//DELETE the event with this id, accessed at 'DELETE https://localhost:8080/admin/event/:event_id'
     .delete(function(req, res){
        Event.remove({
            _id: req.params.event_id
        }, function(err, event){
           if(err)
               res.send(err);
            
            res.json({message: "Successfully deleted"});
        });
     });

//GET the event with this coordinates, accessed at 'DELETE https://localhost:8080/event/:lat/:long'
router.route('/event/:lat/:long')
	.get(function(req, res){
		Event.find({
			"eventLocation.latitude": req.params.lat,
			"eventLocation.longitude": req.params.long
		}, function(err, event){
			if(err) res.send(err);
			res.json(event);
		
			}
		);
	})



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /
app.use('/', router);

// START THE SERVER
// =============================================================================
if(!module.parent) {
   app.listen(port);
}

console.log('Magic happens on port ' + port);
module.exports = app;