const express = require("express");

const app = express();

const server = app.listen(process.env.PORT || 8080);

app.post('/', async (req, res) => {
    const port = server.address().port;
    console.log("App now running on port", port);

    console.log({ req });
    console.log( Object.keys(req) );

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