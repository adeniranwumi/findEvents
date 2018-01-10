var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var EventSchema = new Schema({
    eventName: String,
    eventDescription: String,

    eventLocation: {
    	longitude: Number,
    	latitude: Number
    },

    eventDuration: {
    	from: Date,
    	to: Date,
    },

    freeOrPaid: Boolean,

    eventPrices:{
    	regular: Number,
    	vip: Number,
    	vvip: Number
    },

    eventOrganisers: String
});

module.exports = mongoose.model('Event', EventSchema);