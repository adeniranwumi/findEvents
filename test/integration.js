var chai  = require('chai');
var expect  = require('chai').expect;
var chaiHttp = require('chai-http');

var app = require('../app/server');
chai.use(chaiHttp);
//data to test with
var id;
var data = {
             eventName: "party",
    		 eventDescription: "it's just a party",

    		 eventLocation: {
    	    	 longitude: 12,
    	     	latitude: 34
   			 },

   			 eventDuration: {
    			from: "Sun Jan 14 2018 16:17:17 GMT+0100 (WAT)",
    			to: "Mon Jan 15 2018 16:17:17 GMT+0100 (WAT)",
    		},

   		    freeOrPaid: false,

    		eventPrices:{
		    	regular: 1000,
		    	vip: 2500,
		    	vvip: 5000
    		},

    		eventOrganisers: "some random people"
         }




it('Post a new event ', function(done) {
  
 chai.request(app)
        .post('/admin/add_event')
        .send(data)
        .end(function(err, res) {
          id = res.body._id;
          expect(res.body).to.have.own.property('_id');
          done();
        });
});

it('should return the object searched for by its id and the id recieved should equal id we sent for', function(done) {
  
 chai.request(app)
        .get('/admin/event/'+id)
        .end(function(err, res) {
          expect(res.body._id).to.equal(id);
          done();
        });
});

it('should update an event', function(done) {
  data.eventOrganisers = "new eventOrganiser";
 chai.request(app)
        .put('/admin/event/'+id)
        .send(data)
        .end(function(err, res) {
          //console.log(res);
          expect(res.body.message).to.equal("Event updated!!");
          done();
        });
});

it('should return an array of one Event', function(done) {
 chai.request(app)
        .get('/admin/events')
        .end(function(err, res) {
          expect(res.body).to.be.an('array').that.has.lengthOf(1);
          done();
        });
});

it('should delete an Event', function(done) {
 chai.request(app)
        .delete('/admin/event/'+id)
        .end(function(err, res) {
          expect(res.body.message).to.equal('Successfully deleted');
          done();
        });
});

it('should return an array of length zero after delete route was called', function(done) {
 chai.request(app)
        .get('/admin/events')
        .end(function(err, res) {
          expect(res.body).to.be.an('array').that.has.lengthOf(0);
          done();
        });
});