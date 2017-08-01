
var cl = require('./craigslist');
var config = require('./config.json');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var url=`https://detroit.craigslist.org/search/ata`;
var results=[];
var searchDir=process.cwd()+'/optionssearch';
var items = fs.readdirSync(searchDir);
var options=[
                {
                    "label":"search titles only",
                    "type":"checkbox",
                    "name":"srchType"
                },{
                    "label":"has image",
                    "type":"checkbox",
                    "name":"hasPic"
                    },
                {"label":"posted today","type":"checkbox","name":"postedToday"},{"label":"bundle duplicates","type":"checkbox","name":"bundleDuplicates"},{"label":"include nearby areas","type":"checkbox","name":"searchNearby"},{"label":"distance","type":"number","name":"search_distance"},{"label":"zip","type":"text","name":"postal"},{"label":"min","type":"tel","name":"min_price"},{"label":"max","type":"tel","name":"max_price"} 
            ];

for(var con of config.codes)
    con.options=options;
fs.writeFileSync('./config.json',JSON.stringify(config));

var findInput=(data)=>{
   
    if(data.childNodes!=null){
        for(var i=0;i<data.children.length;i++){
            var child = data.children[i];
            findInput(child);
        }
    } else if (data.length!=null){
        for(var i = 0;i<data.length;i++){
            var child = data[i];
            findInput(child);
        }    
    }else if(data.tagName!=null){
        debugger;
    }else{
 debugger;
    }
}
var parseList=(options,text)=>{
    var result=[];
    var c = cheerio.load(text);
    var data=c(options);
    if(data.length)
        for(var i=0;i<data.length;i++)
            result.push(data[i]);
    else{
        debugger;
    }
 
return result;
}

var getLabel=(file)=>{
    var parent = file.parent;
    for(var node of parent.childNodes){
        if(node.type==='text'){
            return node.data;
        }else{

        }
    }
}
var getInput=(file)=>{
    if(file.name && file.name==="input"){
       var lbl=getLabel(file);
       var value={
            label:lbl,
            type:file.attribs.type,
            name:file.attribs.name
        }
        if(value.name==="nearbyArea")
            return;
        results.push(value);
        return;

    }
    if(!file.childNodes)
        return;
    for(var child of file.childNodes){
        getInput(child);
    }
   
}
var parseOptions=(file)=>{
    var text=fs.readFileSync(file,'utf8');
    var items = parseList('.searchgroup',text);
    items.filter(item=>{
        if(item.attribs && item.attribs.class!=null){
            switch(item.attribs.class){
                case "searchgroup buttongroup purveyor":
                case "searchgroup categories":
                case "searchgroup resetsearch":
                return false;
                case"searchgroup":
                case "searchgroup minmax price":
                return true;
            }
            if(item.attribs.class==="searchgroup categories")
                return false;            
        }
        debugger;
    })
    .forEach(getInput);
 
}

items
    .map(item=>searchDir+'/'+item)
    .filter(item=>fs.statSync(item)
    .isFile()).forEach(parseOptions);


 request(url,(err,response,body)=>{
            if(err)
                console.warn(err)

            fs.writeFileSync(`./optionssearch/${code.code}_${code.name}.txt`,body);
            if(!err && response.statusCode==200)
            getPostingDetails(url,body);

        }) 
console.log(JSON.stringify(results));
