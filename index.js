const PORT = 8000;

const axios = require('axios')
const express = require('express')

const app = express();

const url = 'https://en.wikipedia.org/w/index.php?title=2022%E2%80%9323_Premier_League&action=edit'

axios(url)
    .then(response => {
        const html = response.data

        const names = []
        const results = []

        html.split('\n').forEach(function(data) {

            if(data.startsWith("| name_")){
                names.push(data);
            }
            
            if(data.startsWith("| match_")){
                results.push(data);
            }
        });

        console.log(names, results)
        
    })

app.listen(PORT, () => console.log(`listening on port ${PORT}`));