var cheerio=require('cheerio')
var fs = require('fs');

var file = process.cwd()+'/body.html';
var text=fs.readFileSync(file,'utf8');

var results = [];
var c = cheerio.load(text);


function getFirstChild(obj){
    return obj.length>0?
        obj[0].firstChild.nodeValue:
        null;
}
function getTitle(cc){
    var t=cc('a.result-title.hdrlnk');
    return getFirstChild(t);
}
function getLink(cc){
    var link = cc('a.result-image.gallery')[0]
    .attribs.href;
return link;
}

function getTime(cc){
    result = cc('time.result-date')[0]
    .attribs.title;

    return result;
}


function getLocation(cc){
    var rh=cc('.result-hood');
    if(rh.length>0)
        return rh[0].firstChild.nodeValue.trim();
    return null;
}

function getPrice(cc){

    var price = cc('span.result-price');
    return price.length>0?
        price[0].firstChild.nodeValue:
        null;

}

function parseNode(node){


    var result ={};
    var cc=c.load(node);
    var price=getPrice(cc);

    var link = getLink(cc);

    var time = getTime(cc);

    var title = getTitle(cc);
    var rp = cc('span.result-price',node);

    
    var location = getLocation(cc);
    var result={
        price:price,
        link:link,
        time:time,
        location:location
    }
    return result;
}



var ul_rows = cheerio('ul.rows',text);
var rows = cheerio('li',ul_rows);

for(var i=0;i<rows.length;i++)
    {
        var row = rows[i];
       var result= parseNode(row);
       results.push(result);
}



