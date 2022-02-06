'use strict';

module.exports = function(app) {
    app.all('/*', function(req, res, next){
        
        // corsheaders
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        if(req.methods == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    })

    app.use('/api/exam', require('./exam'));
}