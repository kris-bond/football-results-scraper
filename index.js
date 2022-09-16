const PORT = 8000;

const axios = require('axios');
const express = require('express');

const app = express();

const urls = [];

const url21to22 = 'https://en.wikipedia.org/w/index.php?title=2021%E2%80%9322_Premier_League&action=edit';
const url22to23 = 'https://en.wikipedia.org/w/index.php?title=2022%E2%80%9323_Premier_League&action=edit';

urls.push(url21to22, url22to23);

urls.forEach(url => {

    axios(url)
        .then(response => {
            const html = response.data;

            //formatting for year from url
            season = url.substring(43, 47) + "/" + url.substring(56, 58);

            const names = [];
            const results = [];

            html.split('\n').forEach(function(data) {

                if(data.startsWith("| name_")){
                    names.push(data);
                }

                if(data.startsWith("| match_")){
                    results.push(data);
                }
            });

            //Deduplicate names
            // names.forEach(function(name) {
                //console.log(name.substring(0, 10));
            // });

            //console.log(season, names, results)
            //console.log(names)

            // output to json
            const json = JSON.stringify(season, names, results);

            //console.log(json);

            var fs = require('fs');
            fs.readFile('data.json',function(err,json){
                if(err) throw err;
                //var parseJson = JSON.parse(content);
                fs.appendFile('data.json',JSON.stringify(season),function(err){
                    if(err) throw err;
                })
                fs.appendFile('data.json',JSON.stringify(names),function(err){
                    if(err) throw err;
                })
                fs.appendFile('data.json',JSON.stringify(results),function(err){
                    if(err) throw err;
                })
            })
            
        })

})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));