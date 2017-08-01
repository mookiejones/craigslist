const config = require('../config.json');
var cl = require('../craigslist');
module.exports=function(app){

    app.get('/',(req,res)=>{
        res.send('index.html')
    })

    app.get('/search/:search',(req,res)=>{
        var s= req.params.search;
        console.log(s);
    })
    app.get('/codes',(req,res)=>{
        var c = require('../config.json');
        return res.json(c.codes);
    })
    app.get('/cities',(req,res)=>{

        var c = require('../config.json');
        return res.json(c.locations);
    })
}