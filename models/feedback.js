// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var feedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    agree:{
        type: Boolean,
        default: false
    },
    channel: {
        type: String,
        default: 'not specified'
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Feedbacks = mongoose.model('Feedback', feedbackSchema);

// make this available to our Node applications
module.exports = Feedbacks;