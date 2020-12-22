const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const axios = require('axios');

const HttpsProxyAgent = require('https-proxy-agent');
const fetch = require('node-fetch');

const request = require('request'),
  async = require('async'),
  userURL = 'https://www.instagram.com/',
  listURL = 'https://www.instagram.com/explore/tags/',
  postURL = 'https://www.instagram.com/p/',
  locURL = 'https://www.instagram.com/explore/locations/',
  dataExp = /window\._sharedData\s?=\s?({.+);<\/script>/;

const {
  api_key
} = '';

puppeteer.use(StealthPlugin())

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const scrape = function (html) {
    try {
        // console.log('hghhhhhhhhhhhhhhhhh', html.length);
        var dataString = html.match(dataExp)[1];
        // console.log({ dataString });
        //const parsedDataString = dataString.replace(/\\\\"/g, '\\"').replace(/\\\\'/g, "\\'");
        //var json = JSON.parse(parsedDataString);
        var json = JSON.parse(dataString);
        console.log({
          LoginAndSignupPage: Boolean(json.entry_data.LoginAndSignupPage),
          tagPage: Boolean(json.entry_data.tagPage)
        });
    }
    catch (err) {
        // console.log(html);
        console.error(err, 'The HTML returned from instagram was not suitable for scraping');
        return null
    }

    return json;
}

const scrapePostData = function (post) {
    var scrapedData = {
        //media_id: post.node.id,
        shortcode: post.node.shortcode,
        text: post.node.edge_media_to_caption.edges[0] && post.node.edge_media_to_caption.edges[0].node.text,
        // comment_count: post.node.edge_media_to_comment.count,
        // like_count: post.node.edge_liked_by.count,
        display_url: post.node.display_url,
        // owner_id: post.node.owner.id,
        date: new Date(post.node.taken_at_timestamp * 1000),
        // thumbnail: post.node.thumbnail_src,
        // thumbnail_resource: post.node.thumbnail_resources,
        // is_video: post.node.is_video
    }

    if (post.node.is_video) {
        scrapedData.video_view_count = post.node.video_view_count;
    }

    return scrapedData;
}

const prepareProxy = async () => {

  /*
  const subscriptionData = (await axios({
    method: 'GET',
    headers: {
      'Authorization': `Token ${api_key}`,
    },
    url: 'https://proxy.webshare.io/api/subscription/'
  })).data

  console.log({subscriptionData});
  */


  /*
  const proxyListData = (await axios({
    method: 'GET',
    headers: {
      'Authorization': `Token ${api_key}`,
    },
    url: 'https://proxy.webshare.io/api/proxy/list/'
  })).data.results;

  // console.log(proxyListData);
  // console.log(proxyListData.map(proxy => proxy.ports));

  const proxyData = proxyListData[getRandomInt(proxyListData.length-1)];


  const { 
    username,
    password,
    proxy_address,
    ports
  } = proxyData;

  console.log({ username,
    password,
    proxy_address,
    ports
  });

  const protocol = Object.keys(ports).filter(key => !key.includes('socks'));
  // const protocol = Object.keys(ports).filter(key => !key.includes('http'));
  const port = ports[protocol];

  console.log('proxy', `${protocol}://${proxy_address}:${port}`);
  //const proxyArgString = `--proxy-server=${protocol}://${proxy_address}:${port}`;
  */

  // http://lum-customer-hl_ee2c7df4-zone-static:64e5pcrpczwr@zproxy.lum-superproxy.io:22225',
  /*
  const username = "lum-customer-hl_ee2c7df4-zone-static",
    password = "64e5pcrpczwr",
    proxy_address = "zproxy.lum-superproxy.io",
    port = 22225,
  */
  const username = "bbf1591871",
    password = "4wWx6LRf",
    // proxy_address = "196.18.218.64",
    // proxy_address = "196.19.224.64",
    // proxy_address = "196.18.218.63",
    // proxy_address = "196.19.224.63",
    
    proxy_address = "196.18.218.69",
    // proxy_address = "196.19.224.68",
    // proxy_address = "196.19.226.69",
    // proxy_address = "196.19.226.68",
    // proxy_address = "196.18.218.70",

    port = 4444,
    protocol = "http";
  // const proxyArgString = `--proxy-server=${protocol}://${proxy_address}:${port}`;
  const proxyArgString = `--proxy-server=${proxy_address}:${port}`;

  return {
    username,
    password,
    proxyArgString,
    port,
    proxy_address,
    protocol
  }
}

exports.scrapeTag = async (tag, limit) => {
      if (!tag) {
        throw new Error('Argument "tag" must be specified');
      }

      // const useProxy = false;
      const useProxy = true;
      let username,
          password,
          proxyArgString,
          port,
          protocol,
          proxy_address;

      const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list'
      ];

      if(useProxy) {
        ({
          username,
          password,
          proxyArgString,
          port,
          protocol,
          proxy_address
        } = await prepareProxy());
        args.push(proxyArgString);
      }

      const options = {
        args,
        // headless: true,
        ignoreHTTPSErrors: true,
        userDataDir: './tmp'
      };


      console.log('1111111111111');
      
      // const browser = await puppeteer.launch(options);
      const browser = await puppeteer.launch({ 
        headless: true,
        args : [
          '--no-sandbox'
        ]
      });

      console.log('2222222222222');
      
      const page = await browser.newPage();

      console.log('3333333333333');

      if(useProxy) {
        await page.authenticate({
            username,
            password
        });
      }


      page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36");
      await page.goto(listURL + tag);
      const body = await page.evaluate(() => document.body.innerHTML);
/*
      */


      //await page.goto("https://end3pfqfc6x78.x.pipedream.net/");
      // await page.goto("https://whatismyipaddress.com/");


      const agent = new HttpsProxyAgent({
        host: proxy_address,
        port,
        protocol,
        auth: `${username}:${password}`,
      });

      /*
      const blazingSeoApiEmail = "alisher286@gmail.com";
      const blazingSeoApiUserName = "bbf1591871";
      const blazingSeoApiKey = '4wWx6LRf';
      const ppp = await fetch(`https://blazingseollc.com/proxy/dashboard/api/export/ips/${blazingSeoApiUserName}/${blazingSeoApiKey}`);
      const jjj = await ppp.text();
      console.log({ jjj });
      */


      // const resp = await fetch("https://end3pfqfc6x78.x.pipedream.net/", {
      // const resp = await fetch("https://whatismyipaddress.com/", {
      


      //const resp = await fetch(`${listURL}${tag}/`, {
      ({
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6,uk;q=0.5,fr;q=0.4',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
          'dnt': 1,
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'upgrade-insecure-requests': 1
        },
        // agent: require('proxying-agent').create('http://lum-customer-hl_ee2c7df4-zone-static:64e5pcrpczwr@zproxy.lum-superproxy.io:22225', 'https://http://zproxy.lum-superproxy.io/')
      });

      // const body = await resp.text();

      // console.log({ body });

      // console.log('hmmmm', body.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)[0]);

      /*
      const body = (await axios({
        method: 'GET',
        headers: {
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6,uk;q=0.5,fr;q=0.4',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
        },
        // url: listURL + tag,
        url: "http://end3pfqfc6x78.x.pipedream.net/",
        proxy: {
          host: proxy_address,
          port,
          auth: {
            username,
            password
          }
        }
      })).data;
      */

      // console.log({body})


      var data = scrape(body);
      var media = data.entry_data && data.entry_data.TagPage && data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media;

      // let hashTagData = media.edges.map(edge => scrapePostData(edge));

      return await Promise.all(media.edges.slice(0, limit).map(edge => (async() => {
        const data = scrapePostData(edge);
        const shortCodeData = (await axios({
          method: 'GET',
          url: `https://www.instagram.com/p/${data.shortcode}/?__a=1`
        })).data;
        delete data.shortcode;
        data.username = shortCodeData.graphql.shortcode_media.owner.username
        return data;
      })()));

      /*

        awawit Promise.all(edges.map(edge => async() => {

        }))

              async.waterfall([
                  (callback) => {
                      var medias = [];
                      edges.forEach((post) => {
                          medias.push(exports.scrapePostData(post))
                      });
                      callback(null, medias);
                  }
              ], (err, results) => {
                  if(err) {
                    return reject(err);
                  } else {
                    return resolve({
                        total: results.length,
                        medias: results
                    })
                  }
              })

          }
          else {
              console.log({
                  data,
                  media
              })
              return reject(new Error('Error scraping tag page "' + tag + '"'));
          }
      })
  });
  */
};