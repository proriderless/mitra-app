import { xml2json } from "xml-js";
import axios from "axios";
import * as cheerio from "cheerio";
import antimony from "anitomyscript";
import { Resolution, ETorrentIpcListener } from "../../Utils/enums";

declare global {
  interface Window {
    ipcRenderer: any;
  }
}

//This will open up the torrent server and find the file path!!
export async function openServerAndfindFilePath(animeName: string, episode: number, subGroup: string) {
  //Scrape from the port
  let getMagnetLink = await findMagnetLink(animeName, episode, subGroup)

  console.log(getMagnetLink)

  //Call to await this function
  await window.ipcRenderer.invoke("torrent:openTorrentServer", getMagnetLink)
  
  //Once called, scrape it!
  let responseLocalhost = await axios.get(`http://localhost:1500`)
  let $ = cheerio.load(responseLocalhost.data)
  let listOfItems = $("a:first").text()
  let htmlLink = $("a:first").attr()?.href

  if (htmlLink != null){
    return htmlLink
  } else {
    return false
  }
  
}

export async function findMagnetLink(animeName: string, episode: number, subGroup: string) {
  let link = `https://nyaa.si/?page=rss&q=${encodeURIComponent(
    animeName
  )}&c=0_0&f=0&u=${subGroup}`;
  let firstMainLinkResponse = await axios.get(link, { responseType: "text" });

  //Straight away return false if the status is not 200!
  if (firstMainLinkResponse.status !== 200) {
    return false;
  }

  let parseResponse = JSON.parse(xml2json(firstMainLinkResponse.data));

  let elementResultList = parseResponse.elements[0].elements[0].elements;

  const filterResult = elementResultList.filter((obj: any) => {
    return obj.name === "item";
  });

  console.log(filterResult);

  let identifiedEpsIndex = await identifyEpisodeIndex(
    episode,
    Resolution.NORMAL_HD,
    filterResult
  );

  const firstItem = filterResult[identifiedEpsIndex].elements;

  console.log(firstItem);

  const getDescription = firstItem.filter((obj: any) => {
    return obj.name === "description";
  });

  const pageURL = getDescription[0].elements[0].cdata;

  const urlHTMLObject = cheerio.load(pageURL);

  const urlHTML = urlHTMLObject(`a`).attr();

  if (urlHTML == null) {
    return false;
  }

  let animePageHTML = await axios.get(urlHTML.href);
  let loadMainPageHTML = cheerio.load(animePageHTML.data);
  let torrentMagnet = loadMainPageHTML(`a:contains("Magnet")`).attr()?.href;
  let torrentDownload = loadMainPageHTML(`a:contains("Download")`).attr()?.href;

  if (torrentDownload == null || torrentMagnet == null) {
    return false;
  }

  let concatLink = `${torrentMagnet}&xs=${encodeURIComponent(torrentDownload)}`;

  if (torrentMagnet == null) {
    return false;
  } else {
    return concatLink;
  }
}

async function identifyEpisodeIndex(
  episode: number,
  resolution: Resolution,
  arrayList: any
) {
  let titleArrList = [];

  for (let item of arrayList) {
    let title = item.elements[0].elements[0].text;
    titleArrList.push(title);
  }

  let result = await window.window.ipcRenderer.invoke(
    ETorrentIpcListener.HANDLE_PARSED_TITLES,
    titleArrList
  );

  let resultingArrayEp = result.filter(function (el: any) {
    return el.episode_number == episode;
  });

  //Get the first item as fallback
  console.log(resultingArrayEp)
  let fallbackResult = resultingArrayEp[0]["item_index"];

  //Check if there is only one video, if there is, that means there are no alternating resolutions!
  //Return that!
  if (resultingArrayEp.length === 1) {
    return fallbackResult;
  }

  //Otherwise, filter again for resolution!!
  let resultingArrayRes = resultingArrayEp.filter(function (el: any) {
    return el.video_resolution == resolution;
  });

  //If there are no results, return fallback
  if (resultingArrayRes.length === 0) {
    return fallbackResult;
  }

  return resultingArrayRes[0]["item_index"];
}
