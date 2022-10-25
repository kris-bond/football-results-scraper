const PORT = 8000;

const axios = require('axios');
const express = require('express');

const app = express();

const cors=require("cors");
const corsOptions ={
   origin:'*',
   credentials:true,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

let names = [];

let games2122 = [];
let games2223 = [];

axios('https://en.wikipedia.org/w/index.php?title=2021%E2%80%9322_Premier_League&action=edit')
        .then(response => {
            const html = response.data;

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
                    fullName = fullName.replace("&amp;", "&") // fix for & in name

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

                    games2122.push(game);
                }

            });

            names.forEach(name => {
                let short = name.code;
                let full = name.name;
                let regex = new RegExp(short, "g");
                games2122 = JSON.parse(
                    JSON.stringify(games2122).replace(regex,full)

                )
            })
            
        })

axios('https://en.wikipedia.org/w/index.php?title=2022%E2%80%9323_Premier_League&action=edit')
    .then(response => {
        const html = response.data;

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
                fullName = fullName.replace("&amp;", "&").trim() // fix for & in name + whitespace

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

                games2223.push(game);
            }

        });

        names.forEach(name => {
            let short = name.code;
            let full = name.name;
            let regex = new RegExp(short, "g");
            games2223 = JSON.parse(
                JSON.stringify(games2223).replace(regex,full)

            )
        })

    })


app.listen(PORT, () => console.log(`listening on port ${PORT}`));

app.get('/games', (req, res) => {

    const sns = req.query.sns;
    let results = null;

    if(sns == "2022/23"){results=games2223;}
    if(sns == "2021/22"){results=games2122;}
    
    res.status(200).send({results})
        
});

app.get('/names', (req, res) => {

    res.status(200).send({names})
        
});
