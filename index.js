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

            let names = [];
            let games = [];

            html.split('\n').forEach(function(data) {

                // log the names and code to use for updating team names
                if(data.startsWith("| name_")){

                    let shortName = [];
                    let fullName = [];

                    shortName = data.substring(7);

                    shortName = shortName.substring(0, 3);

                    let startStr = data.lastIndexOf("|")+1
                    let endStr = data.lastIndexOf("]")-1
                    
                    fullName = data.substring(startStr, endStr);

                    let name = {
                        "code": shortName,
                        "name": fullName
                    }

                    names.push(name);
                }

                if(data.startsWith("| match_")){

                    let finalResult = [];

                    let match = data.substring(8, 15);

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

                    let game = {
                        "match": match,
                        "result": finalResult
                    }

                    games.push(game);
                }

            });

            console.log(names);

            console.log(games);

            //TODO update names

            
            
        })

})

class game {
    constructor(match, result) {
        this.match = match;
        this.result = result;
    }
}

class teamName {
    constructor(shortName, fullName) {
        this.shortName = shortName;
        this.fullName = fullName;
    }
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));