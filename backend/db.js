const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const user = new Schema({
    userName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    org : {
        type : String,
        required : true
    }
})

const task = new Schema({
    task : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    teamName : {
        type : String,
        required : true
    },
    org : {
        type : String,
        required : true
    }
})

const org = new Schema({
    orgName : {
        type : String,
        required : true,
        unique : true
    },
    teamName : {
        type : String,
        required : true,
        unique : true
    }
})

const userModel = mongoose.model('users', user);
const taskModel = mongoose.model('tasks', task);
const orgModel = mongoose.model('orgs', org);

module.exports = {userModel, taskModel, orgModel};