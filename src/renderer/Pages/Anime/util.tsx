import { xml2json } from 'xml-js';
import axios from 'axios'
import * as cheerio from 'cheerio';


export async function findMagnetLink(animeName : string, episode : number){
    let link = `https://nyaa.si/?page=rss&q=${encodeURIComponent(animeName + " - " + episode.toString())}&c=0_0&f=0&u=subsplease`
    let firstMainLinkResponse = await axios.get(link, {responseType:"text"})

    //Straight away return false if the status is not 200!
    if (firstMainLinkResponse.status !== 200) {
        return false
    }

    let parseResponse = JSON.parse(xml2json(firstMainLinkResponse.data));

    let elementResultList = parseResponse.elements[0].elements[0].elements


    const filterResult = elementResultList.filter((obj:any) => {
        return obj.name === "item";
    });

    const firstItem = filterResult[0].elements

    console.log(firstItem)


    const getDescription = firstItem.filter((obj:any) => {
        return obj.name === "description";
    });

    const pageURL = getDescription[0].elements[0].cdata

    const urlHTMLObject = cheerio.load(pageURL);

    const urlHTML = urlHTMLObject(`a`).attr()

    if (urlHTML == null) {
        return false;
    }
    
    let animePageHTML = await axios.get(urlHTML.href)
    let loadMainPageHTML = cheerio.load(animePageHTML.data)
    let torrentMagnet = loadMainPageHTML(`a:contains("Magnet")`).attr()?.href

    if (torrentMagnet == null){
        return false
    } else {
        return torrentMagnet
    }

}
