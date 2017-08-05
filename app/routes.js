const config = require('../config.json');
var cl = require('../craigslist');
module.exports=function(app){

    app.get('/',(req,res)=>{
        res.send('index.html')
    })

    app.get('/search',(req,res)=>{
        debugger;
    })
 
    app.get('/codes',(req,res)=>{
        var c = require('../config.json');
        return res.json(c.codes);
    })
    app.get('/cities',(req,res)=>{

        var c = require('../config.json');
        return res.json(c.locations);
    })

    app.get('*',(req,res)=>{
        debugger;
    })
}