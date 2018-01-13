process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var request = require("request");
var server = require('../app/server');
var Event = require('../app/models/event');
var mongoose = require('mongoose');

var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('Events', function() {
	this.timeout(10000);
	// Event.collection.drop();

	Event.remove({}, function(err, row){
		if(err){
			console.log("Collection could not be removed " + err);
			return;
		}
		console.log("Collection removed");
	});

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
	    Event.remove({}, function(err, row){
		if(err){
			console.log("Collection could not be removed " + err);
			return;
		}
		console.log("Collection removed");
	});
	    done();
	  });



  it('should list ALL events on /admin/events GET', function(done){
	chai.request(server)
		.get('/admin/events')
		.end(function(err, res){
			expect(res).should.have.status(200);
			expect(res).should.be.json;
			expect(res).should.be.a('array');
			//the event model properties
			expect(res.body[0]).should.have.property('_id');
		    expect(res.body[0]).should.have.property('eventName');
		    expect(res.body[0]).should.have.property('eventLocation');
		    expect(res.body[0]).should.have.property('eventDescription');
		    expect(res.body[0]).should.have.property('eventDuration');
		    expect(res.body[0]).should.have.property('freeOrPaid');
		    expect(res.body[0]).should.have.property('eventPrices');
		    expect(res.body[0]).should.have.property('eventOrganisers');
		    // tests for objects as properties
		    expect(res.body[0]).eventLocation.should.have.property('longitude');
		    expect(res.body[0]).eventLocation.should.have.property('latitude');
		    expect(res.body[0]).eventDuration.should.have.property('from');
		    expect(res.body[0]).eventDuration.should.have.property('to');
		    expect(res.body[0]).eventPrices.should.have.property('regular');
		    expect(res.body[0]).eventPrices.should.have.property('vip');
		    expect(res.body[0]).eventPrices.should.have.property('vvip');
		    // checks the values of all the properties
		    expect(res.body[0]).eventLocation.longitude.should.equal(10000);
		    expect(res.body[0]).eventLocation.latitude.should.equal(12000);
		    expect(res.body[0]).eventDuration.from.should.equal("2018-02-25T3:00:00Z");
		    expect(res.body[0]).eventDuration.to.should.equal("2022-02-25T3:00:00Z");
		    expect(res.body[0]).eventName.should.equal("Shuttle takeoff");
		    expect(res.body[0]).eventDescription.should.equal("we are going to space baby!");
		    expect(res.body[0]).freeOrPaid.should.equal(false);
		    expect(res.body[0]).eventOrganisers.should.have.property("aliens and NASA");
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
	      chai.request(server)
	        .get('/admin/event/'+ data._id)
	        .end(function(err, res){
	          console.log(data._id);
	          expect(res).should.have.status(200);
	          expect(res).should.be.json;
	          expect(res).should.be.a('object');
	          expect(res.body).should.have.property('_id');
		      expect(res.body).should.have.property('eventName');
		      expect(res.body).should.have.property('eventLocation');
		      expect(res.body).should.have.property('eventDescription');
		      expect(res.body).should.have.property('eventDuration');
		      expect(res.body).should.have.property('freeOrPaid');
		      expect(res.body).should.have.property('eventPrices');
		      expect(res.body).should.have.property('eventOrganisers');
		    // tests for objects as properties
		      expect(res.body).eventLocation.should.have.property('longitude');
		      expect(res.body).eventLocation.should.have.property('latitude');
		      expect(res.body).eventDuration.should.have.property('from');
		      expect(res.body).eventDuration.should.have.property('to');
		      expect(res.body).eventPrices.should.have.property('regular');
		      expect(res.body).eventPrices.should.have.property('vip');
		      expect(res.body).eventPrices.should.have.property('vvip');
		    // checks the values of all the properties
		      expect(res.body).eventLocation.longitude.should.equal(1000);
		      expect(res.body).eventLocation.latitude.should.equal(1200);
		      expect(res.body).eventDuration.from.should.equal("2022-02-25T3:15:00Z");
		      expect(res.body).eventDuration.to.should.equal("2022-02-25T3:30:00Z");
		      expect(res.body).eventName.should.equal("Shuttle landing");
		      expect(res.body).eventDescription.should.equal("we are going back to earth");
		      expect(res.body).freeOrPaid.should.equal(false);
		      expect(res.body).eventOrganisers.should.have.property("lame earthlings");
	          done();
	        });
    	});
    });

  it('should add a SINGLE event on /admin/add_event POST', function(done){
	chai.request(server)
		.post('/admin/add_event')
		.send({"name" : "we are young", "latitude" : 500, "longitude" : 1000, "organisers" : "we don't give a fuck"})
		.end(function(err, res){
			expect(res).should.have.status(200);
			expect(res).should.be.json;
			expect(res).should.be.a('object');
			expect(res.body).should.have.property('eventLocation');
			expect(res.body).should.have.property('_id');
			expect(res.body).should.have.property('eventName');
			expect(res.body).should.have.property('eventOrganisers');
			expect(res.body).eventLocation.should.have.property('longitude');
			expect(res.body).eventLocation.should.have.property('latitude');
		    expect(res.body).eventName.should.equal('we are young');
			done();
		});
	});

  it('should update a SINGLE event on /admin/event/:event_id PUT', function(done) {
	  chai.request(server)
	    .get('/admin/events')
	    .end(function(err, res){
	      chai.request('http://localhost:8080')
	        .put('/admin/event/'+ res.body[0]._id)
	        .send({'eventName': 'Space shuttle takeoff'})
	        .end(function(error, response){
	          expect(response).should.have.status(200);
	          expect(response).should.be.json;
	          expect(response).should.be.a('object');
	          expect(response.body).should.have.property('message');
	          expect(response.body).message.should.equal("Event updated!!");
	          done();
	      });
	    });
	});

  it('should delete a SINGLE event on /admin/event/:event_id DELETE', function(done) {
	  chai.request(server)
	    .get('/admin/events')
	    .end(function(err, res){
	      chai.request('http://localhost:8080')
	        .delete('/admin/event/'+ res.body[0]._id)
	        .end(function(error, response){
	          expect(response.body).should.have.status(200);
	          expect(response.body).should.be.json;
	          expect(response.body).should.be.a('object');
	          expect(response.body).should.have.property('message');
	          expect(response.body).message.should.equal("Successfully deleted");
	          done();
	      });
	   });
	});
});




