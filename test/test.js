process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
// var request = require("request");
var server = require('../app/server');
var Event = require('../app/models/event');
var mongoose = require('mongoose');

var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('Events', function() {
	this.timeout(10000);
	Event.collection.drop();

	  beforeEach(function(done){
	    var newEvent = new Event({
	      eventName: "Shuttle takeoff",
    	  eventDescription: "we are going to space baby!",

    	  eventLocation: {
    	  longitude: 10000,
    	  latitude: 12000
   	 	},

    	eventDuration: {
    		from: "2018-02-25T3:00:00Z",
    		to: "2022-03-25T3:00:00Z",
    	},

    	freeOrPaid: false,

    	eventPrices:{
    		regular: 10000000,
    		vip: 100000000,
    		vvip: 250000000
    	},

    	eventOrganisers: "aliens and NASA"
	    });

	    newEvent.save(function(err) {
	      done();
	    });
	  });

	  afterEach(function(done){
	    Event.collection.drop();
	    done();
	  });



  it('should list ALL events on /admin/events GET', function(done){
	chai.request('http://localhost:8080')
		.get('/admin/events')
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			//the event model properties
			res.body[0].should.have.property('_id');
		    res.body[0].should.have.property('eventName');
		    res.body[0].should.have.property('eventLocation');
		    res.body[0].should.have.property('eventDescription');
		    res.body[0].should.have.property('eventDuration');
		    res.body[0].should.have.property('freeOrPaid');
		    res.body[0].should.have.property('eventPrices');
		    res.body[0].should.have.property('eventOrganisers');
		    // tests for objects as properties
		    res.body[0].eventLocation.should.have.property('longitude');
		    res.body[0].eventLocation.should.have.property('latitude');
		    res.body[0].eventDuration.should.have.property('from');
		    res.body[0].eventDuration.should.have.property('to');
		    res.body[0].eventPrices.should.have.property('regular');
		    res.body[0].eventPrices.should.have.property('vip');
		    res.body[0].eventPrices.should.have.property('vvip');
		    // checks the values of all the properties
		    res.body[0].eventLocation.longitude.should.equal(10000);
		    res.body[0].eventLocation.latitude.should.equal(12000);
		    res.body[0].eventDuration.from.should.equal("2018-02-25T3:00:00Z");
		    res.body[0].eventDuration.to.should.equal("2022-02-25T3:00:00Z");
		    res.body[0].eventName.should.equal("Shuttle takeoff");
		    res.body[0].eventDescription.should.equal("we are going to space baby!");
		    res.body[0].freeOrPaid.should.equal(false);
		    res.body[0].eventOrganisers.should.have.property("aliens and NASA");
			done();
		});
	});
		
  it('should list a SINGLE event on /admin/event/:event_id GET', function(done) {
	    var newEvent = new Event({
	      eventName: "Shuttle landing",
    	  eventDescription: "we are going to back to earth",

    	  eventLocation: {
    	  longitude: 1000,
    	  latitude: 1200
   	 	},

    	eventDuration: {
    		from: "2022-02-25T3:15:00Z",
    		to: "2022-03-25T3:30:00Z",
    	},

    	freeOrPaid: false,

    	eventPrices:{
    		regular: 10000000,
    		vip: 100000000,
    		vvip: 250000000
    	},

    	eventOrganisers: "lame earthlings"
	    });

	    newEvent.save(function(err, data) {
	      chai.request('http://localhost:8080')
	        .get('/admin/event/'+ data._id)
	        .end(function(err, res){
	          console.log(data._id);
	          res.should.have.status(200);
	          res.should.be.json;
	          res.body.should.be.a('object');
	          res.body.should.have.property('_id');
		      res.body.should.have.property('eventName');
		      res.body.should.have.property('eventLocation');
		      res.body.should.have.property('eventDescription');
		      res.body.should.have.property('eventDuration');
		      res.body.should.have.property('freeOrPaid');
		      res.body.should.have.property('eventPrices');
		      res.body.should.have.property('eventOrganisers');
		    // tests for objects as properties
		      res.body.eventLocation.should.have.property('longitude');
		      res.body.eventLocation.should.have.property('latitude');
		      res.body.eventDuration.should.have.property('from');
		      res.body.eventDuration.should.have.property('to');
		      res.body.eventPrices.should.have.property('regular');
		      res.body.eventPrices.should.have.property('vip');
		      res.body.eventPrices.should.have.property('vvip');
		    // checks the values of all the properties
		      res.body.eventLocation.longitude.should.equal(1000);
		      res.body.eventLocation.latitude.should.equal(1200);
		      res.body.eventDuration.from.should.equal("2022-02-25T3:15:00Z");
		      res.body.eventDuration.to.should.equal("2022-02-25T3:30:00Z");
		      res.body.eventName.should.equal("Shuttle landing");
		      res.body.eventDescription.should.equal("we are going back to earth");
		      res.body.freeOrPaid.should.equal(false);
		      res.body.eventOrganisers.should.have.property("lame earthlings");
	          done();
	        });
    	});
    });

  it('should add a SINGLE event on /admin/add_event POST', function(done){
	chai.request('http://localhost:8080')
		.post('/admin/add_event')
		.send({"name" : "we are young", "latitude" : 500, "longitude" : 1000, "organisers" : "we don't give a fuck"})
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.have.property('eventLocation');
			res.body.should.have.property('_id');
			res.body.should.have.property('eventName');
			res.body.should.have.property('eventOrganisers');
			res.body.eventLocation.should.have.property('longitude');
			res.body.eventLocation.should.have.property('latitude');
		    res.body.eventName.should.equal('we are young');
			done();
		});
	});

  it('should update a SINGLE event on /admin/event/:event_id PUT', function(done) {
	  chai.request('http://localhost:8080')
	    .get('/admin/events')
	    .end(function(err, res){
	      chai.request('http://localhost:8080')
	        .put('/admin/event/'+res.body[0]._id)
	        .send({'eventName': 'Space shuttle takeoff'})
	        .end(function(error, response){
	          response.should.have.status(200);
	          response.should.be.json;
	          response.body.should.be.a('object');
	          response.body.should.have.property('message');
	          response.body.message.should.equal("Event updated!!");
	          done();
	      });
	    });
	});

  it('should delete a SINGLE event on /admin/event/:event_id DELETE', function(done) {
	  chai.request('http://localhost:8080')
	    .get('/admin/events')
	    .end(function(err, res){
	      chai.request('http://localhost:8080')
	        .delete('/admin/event/'+res.body[0]._id)
	        .end(function(error, response){
	          response.should.have.status(200);
	          response.should.be.json;
	          response.body.should.be.a('object');
	          response.body.should.have.property('message');
	          response.body.message.should.equal("Successfully deleted");
	          done();
	      });
	   });
	});
});
















// describe("Status and content", function(){
// 	describe("Test page", function(){
// 		it("Status", function(done){
// 			request("http://localhost:8080", function(error, response, body){
// 				expect(response.statusCode).to.equal(200);
// 				done();
// 			});
// 		});

// 		it("Content", function(done){
// 			request("http://localhost:8080", function(error, response, body){
// 				expect(body).to.equal('{"message":"You must be bored!"}');
// 				done();
// 			});
// 		});
// 	});


// 	describe("Test 404", function(){
// 		it("About page", function(done){
// 			request("http://localhost:8080/about", function(error, response, body){
// 				expect(response.statusCode).to.equal(404);
// 				done();
// 			});
// 		 });
// 	});

// 	// describe("Add event", function(){
// 	// 	it("Status", function(done){
// 	// 		request("http://localhost:8080/admin/add_event", function(error, response, body){
// 	// 			expect(response.statusCode).to.equal(200);
// 	// 			done();
// 	// 		});
// 	// 	});
// 	// });

// });


