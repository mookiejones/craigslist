"use strict";

var config = require("./config.json");
var results = [];
var request = require("request");
var cheerio = require("cheerio");



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
    var result = cc('time.result-date')[0]
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
function getImage(cc){
  var result = [];
  var ids = cc('a[data-ids]');
  if(ids.length>0){
    var attribs = ids[0].attribs;
    var datas = attribs['data-ids'];

    var re =/1:([^,]+)/ig;
    var match = re.exec(datas);
    while(match!=null){
      var img = match[1];

      result.push({
        smImg:`https://images.craigslist.org/${img}_50x50c.jpg`,
        show:false,
        lgImg:`https://images.craigslist.org/${img}_300x300.jpg`
      });
      match = re.exec(datas);
    }
  }
  return result;
}
function parseNode(node,city) {
  var result = {};
  var cc = cheerio.load(node);
  var price = getPrice(cc);

  var img = getImage(cc);
  var link = getLink(cc);
  link=`https://${city}.craigslist.org/${link}`;
  var time = getTime(cc);

  var title = getTitle(cc);
  var rp = cc("span.result-price", node);

  var location = getLocation(cc);
  var result = {
    img:img,
    show:false,
    title:title,
    price: price,
    link: link,
    time: time,
    location: location
  };
  return result;
}

function getPostingDetails(postingUrl, markup,city) {
  var ul_rows = cheerio("ul.rows", markup);
  var rows = cheerio("li", ul_rows);

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var result = parseNode(row,city);
    results.push(result);
  }

  return results;
}

function craigslist() {}

craigslist.prototype.getPostingDetails = getPostingDetails;
craigslist.prototype.getDetails = function(postingUrl, markup) {
  console.log(`url:${postingUrl}`);

  var c = cheerio.load(markup);
  var details = {};
  details.description = (c("#postingbody").text() || "").trim();
  details.mapUrl = c("div.mapbox p.mapaddress").find("a").attr("href");
  details.pid = postingUrl
    .substring(postingUrl.search(/[0-9]*\.html/))
    .replace(/\.html/, "");
  details.replyUrl = (c("#replylink").attr("href") || "").trim();
  details.title = (c("#titletextonly").text() || "").trim();
  details.url = postingUrl;
  if (details.description.length > 1) debugger;
};
function getInfo(url) {
  try {
    debugger;
    request(url, (err, response, body) => {
      if (err) console.warn(err);
      if (!err && response.statusCode == 200)
        return getPostingDetails(url, body);
    });
  } catch (e) {
    console.error(e);
    return e;
  }
}

function getBody(markup) {}
craigslist.prototype.search = function(params) {
  var promise = new Promise((res, rej) => {
    var url = `https://${params.city}.craigslist.org/search/${params.code}?query=${params.terms}`;
    if (params.args) url += params.args;
    if (params.args) url += params.args;

    try {
      request(url, (err, response, body) => {
        if (err) console.warn(err);
        if (!err && response.statusCode == 200) {
          
          res(getPostingDetails(url, body,params.city));
        } else {
          res("hello");
        }
      });
    } catch (e) {
        debugger;
      rej(e);
      console.error(e);
    }
  });
  return promise;
};
craigslist.prototype.getInfo = getInfo;

// for(var city of config.cities){

//         var url=`https://${city}.craigslist.org/search/boa?query=hunter&hasPic=1&boat_propulsion_type=1`;
//         getInfo(url);
// }
var url = `https://detroit.craigslist.org/search/boa?query=hunter&hasPic=1&boat_propulsion_type=1`;
//        getInfo(url);

var options = {
  category: "boo"
};

var results = [];

function writeListing(l) {
  console.log(l);
}

module.exports = new craigslist();
