const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = app.listen(process.env.PORT || 8080);
const port = server.address().port;
console.log("App now running on port", port);

app.post('/', async (req, res) => {  

    // console.log({ req });
    // console.log( Object.keys(req) );
    // 

    const { tag, limit = 2 } = req.body;

    console.log({ tag, limit });

    const { scrapeTag } = require('./scrapeIG.js');
    let hashTagData

    try {
      hashTagData = await scrapeTag(tag, limit);
      console.log({hashTagData})
      return res.status(200).json({hashTagData});
    } catch( error ) {
      console.log(error);
      return res.status(500).json({success: false});
    }
});