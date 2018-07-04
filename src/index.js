const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const { writeFileSync } = require('fs');
const { formatDate } = require('@dwing/common');

axios.get('https://segmentfault.com/t/java/blogs')
     .then(({ data }) => {
       const $ = cheerio.load(data)
       const arr = []
       $('.stream-list__item').each((idx, ele) => {
         const $title = $('.title', ele)
         const $title_a = $('a', $title)
         const $desc = $('.excerpt', ele)
         const $author_a = $('.author', ele).find('li').slice(0, 1).find('span a').slice(0, 1)
         arr.push({
           id: $('.bookmark', ele).attr('data-id'),
           title: $title.text(),
           url: $title_a.attr('href'),
           desc: $desc.text(),
           author: {
             nick: $author_a.text(),
             homepage: $author_a.attr('href')
           }
         })
       })
       const date = formatDate('yyyy-MM-dd-hhmmss')
       let wirteFile = {
         watchNum: $('.tag-info .num').text(),
         blogs: arr
       }
       writeFileSync(path.resolve(__dirname, '../data/', `${date}.json`), JSON.stringify(wirteFile, null, 2), 'utf-8')
     })
