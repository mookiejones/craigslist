var fs = require('fs');
var text = fs.readFileSync('mainpage.txt');
var cheerio = require('cheerio');

var c = cheerio.load(text);

var result={
    continents:[]
};

var world=c('.jump_to_continents');

var continents = world.children('a');


for(var i=0;i<continents.length;i++){
    var continent=continents[i];
    result.continents.push({
        name:continent.firstChild.data.toString(),
        value:continent.firstChild.nodeValue.toString()
    });
    
    console.log('hello');


}

var uu = c('div.box.box1');

var us=    c('.colmask');
for(var i=0;i<us.length;i++){
    var u = us[i];
    var box = us[i].children[1];

body > article > section > div:nth-child(4) > div.box.box_1
    var state=u.children('h4');
    console.log()
}


console.log();