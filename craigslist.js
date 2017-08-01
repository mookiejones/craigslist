'use strict';

var config = require('./config.json');
var results=[];
var request = require('request');
var cheerio=require('cheerio');


function craigslist(){

}

craigslist.prototype.getPostingDetails=function(postingUrl,markup){


    var c = cheerio.load(markup);

    var links=c('.result-row');
    var titles = c('.result-title');

    var results=[];

    if(links.length>0)
        for(var i=0;i<links.length;i++){
            var link = links.get(i);
            var href=link.attribs.href;
            results.push(href);
        }

        
}
craigslist.prototype.getDetails=function(postingUrl,markup){

    console.log(`url:${postingUrl}`);

    var c= cheerio.load(markup);
    var details={};
    details.description = (c('#postingbody').text() || '').trim();
	details.mapUrl = c('div.mapbox p.mapaddress')
		.find('a')
		.attr('href');
	details.pid = postingUrl
		.substring(postingUrl.search(/[0-9]*\.html/))
		.replace(/\.html/, '');
	details.replyUrl = (c('#replylink').attr('href') || '').trim();
	details.title = (c('#titletextonly').text() || '').trim();
    details.url = postingUrl;
    if(details.description.length>1)
        debugger;
}


function getBody(markup){

}

function getInfo(url){
    try{
        request(url,(err,response,body)=>{
            if(err)
                console.warn(err)
            if(!err && response.statusCode==200)
            getPostingDetails(url,body);
        })
    }catch(e){
        console.error(e);
    }
}


// for(var city of config.cities){
        
//         var url=`https://${city}.craigslist.org/search/boa?query=hunter&hasPic=1&boat_propulsion_type=1`;
//         getInfo(url);
// }
        var url=`https://detroit.craigslist.org/search/boa?query=hunter&hasPic=1&boat_propulsion_type=1`;
//        getInfo(url);


var options={
    category:'boo'
};

var results=[];



function writeListing(l){
    console.log(l);
}

module.exports = new craigslist();

