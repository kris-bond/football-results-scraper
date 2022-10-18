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

            //const season = [];
            const names = [];
            const results = [];

            //season.push(currentSeason);

            let games = [];

            html.split('\n').forEach(function(data) {

                if(data.startsWith("| name_")){
                    // names.push(data);
                    // game.match = data;
                    // games.push(game.match);

                    //TODO log the names to use for team names

                    // console.log(data);
                }

                if(data.startsWith("| match_")){
                    // results.push(data);
                    // game.result = data;
                    // games.push(game.result);

                    let finalResult = [];

                    let match = data.substring(8, 15);
                    // console.log(match);

                    let result = data.substring(18);

                    
                    
                    if(result.charAt(0) === "["){
                        result = result.split("|")[1]

                        if(result.charAt(0) != "a"){

                            if(result.slice(-1) === "]"){
                                finalResult = result.slice(0, -2);
                            } else {
                                finalResult = result;
                            }
                            
                        } else {
                            finalResult = "";
                        }
                    } else{
                        finalResult = result;
                    }
                    console.log(match);
                    console.log(result);
                    console.log(finalResult);
                }

                // games.push(game);

            });

            //Deduplicate names
            // names.forEach(function(name) {
                //console.log(name.substring(0, 10));
            // });

            //console.log(season, names, results)
            //console.log(names)

            // output to json
            // const json = JSON.stringify(season, names, results);

            //console.log(json);

            //////
            // var fs = require('fs');
            // fs.readFile('data.json',function(err,json){
            //     if(err) throw err;

            //     //clear file
            //     fs.writeFile('data.json',"",function(err){
            //         if(err) throw err;
            //     })

            //     //var parseJson = JSON.parse(content);
            //     fs.appendFile('data.json',JSON.stringify(season),function(err){
            //         if(err) throw err;
            //     })
            //     fs.appendFile('data.json',JSON.stringify(names),function(err){
            //         if(err) throw err;
            //     })
            //     fs.appendFile('data.json',JSON.stringify(results),function(err){
            //         if(err) throw err;
            //     })
            // })
            
        })

})

class game {
    constructor(match, result) {
        this.match = match;
        this.result = result;
    }
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));