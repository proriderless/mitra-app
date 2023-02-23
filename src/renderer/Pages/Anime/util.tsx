import { xml2json } from 'xml-js';
import axios from 'axios'

export async function findMagnetLink(animeName : string, episode : number){
    let link = `https://nyaa.si/?page=rss&q=${encodeURIComponent(animeName + " - " + episode.toString())}&c=0_0&f=0&u=subsplease`
    let firstMainLinkResponse = await axios.get(link, {responseType:"text"})

    //Straight away return false if the status is not 200!
    if (firstMainLinkResponse.status !== 200) {
        return false
    }

    let parseResponse = JSON.parse(xml2json(firstMainLinkResponse.data));

    let elementResultList = parseResponse.elements[0].elements[0].elements

    console.log(elementResultList)

    const results = elementResultList.filter((obj:any) => {
        return obj.name === "item";
    });
        
    return results


}
