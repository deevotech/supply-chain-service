var uuidv1 = require('uuid/v1');
var express = require('express');
var bodyParser = require('body-parser');
var Location = require('../models/location.js');
var constants = require('../utils/constants.js');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(function (req, res, next) {      
    Location.getAll().then(locations => {       
        res.json(locations.map(i => i.Record));
    }).catch(err => {
        if(err) return next(err);
    });
})

.post(function (req, res, next) {
    var newLocation = new Location({
        id: req.body.id || uuidv1(),
        objectType: constants.ObjectTypes.Location,
        parent: req.body.parent,
        name: req.body.name,
        content: req.body.content
    })
    newLocation.create().then(status => {        
        if(status == "SUCCESS")
        {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the location : ' + newLocation.id);        
        }
    }).catch(err => {
        if(err) return next(err);        
    });    
})

.delete(function (req, res, next) {
    return next(new Error('Out of scope, this action is not implemented yet.'));
});

// ======================================================

router.route('/:locationId')
.get(function (req, res, next) {    
    Location.find(req.params.locationId).then(location => {      
        if(!location)
        {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end('Could not found object with ID: ' + req.params.locationId);
        } 
        else 
        { 
            res.json(location);
        }
    }).catch(err => {
        if(err) return next(err);
    });    
})

.put(function (req, res, next) {
    var updateLocation = new Location({
        id: req.params.locationId,
        parent: req.body.parent,
        name: req.body.name,        
        content: req.body.content
    })
    updateLocation.update().then(status => {        
        if(status == "SUCCESS")
        {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Updated the Location : ' + updateLocation.id);
        }
    }).catch(err => {
        if(err) return next(err);
    });
})

.delete(function (req, res, next) {    
    return next(new Error('Out of scope, this action is not implemented yet.'));
});

// ======================================================

module.exports = router;