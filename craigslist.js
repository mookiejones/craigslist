'use strict';

var config = require('./config.json');
var results=[];
var request = require('request');
var cheerio=require('cheerio');

function getPostingDetails(postingUrl,markup){


    var c = cheerio.load(markup);

    var links=c('.result-row');
    var titles = c('.result-title');

    var results=[];

    if(links.length>0)
        for(var i=0;i<links.length;i++){
            var link = links.get(i);
            var item={};
            for(var child of link.children)
                {
                    if(child.type==='text')
                        continue;
                    if(child.tagName==='a'){
                        item.image=child.attribs.href;

                    }
console.log()
            }
            results.push(item);
        }
return results;
}

function craigslist(){

}

craigslist.prototype.getPostingDetails=getPostingDetails
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
function getInfo(url){
    try{
     debugger;
        request(url,(err,response,body)=>{
            if(err)
                console.warn(err)
            if(!err && response.statusCode==200)
           return  getPostingDetails(url,body);
        })
    }catch(e){
        console.error(e);
        return e;
    }
}

function getBody(markup){

}
craigslist.prototype.search=function(params){

    var promise = new Promise((res,rej)=>{

    var url=`https://${params.city}.craigslist.org/search/${params.code}?query=${params.terms}`;
    if(params.args)
        url+=params.args;

 try{
        request(url,(err,response,body)=>{
            if(err)
                console.warn(err)
            if(!err && response.statusCode==200)
           {
               res(getPostingDetails(url,body));
           } else{
            res('hello');
           }
        })
    }catch(e){
        rej(e);
        console.error(e);
    }
        });
return promise;

}
craigslist.prototype.getInfo=getInfo;


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

