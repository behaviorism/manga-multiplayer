import { Manga, MangaSource } from "../../types";
import htmlParser from "node-html-parser";

export const scrapeManga = (url: string) => {
  if (url.includes("manganato.com")) {
    return scrapeMangaNato(url);
  } else if (url.includes("mangatoto.com")) {
  }
};

const scrapeMangaNato = async (url: string): Promise<Manga> => {
  const res = await fetch(url);

  const text = await res.text();

  if (text.includes("404 - PAGE NOT FOUND")) {
    throw new Error("Invalid manga url was provided");
  }

  const html = htmlParser(text);

  const name = html.querySelector(".story-info-right h1")!.textContent;
  const cover_url = html.querySelector(".info-image img")!.getAttribute("src")!;
  const chapters = html
    .querySelectorAll(".panel-story-chapter-list a")
    .map((element) => element.getAttribute("href")!.split("/chapter-")[1]);

  return {
    url,
    name,
    cover_url,
    chapters,
    source: MangaSource.MangaNato,
    bookmark: { chapterIndex: 0, pageIndex: 0 },
  };
};

export const scrapeMangaPages = (url: string, chapter: string) => {
  if (url.includes("manganato.com")) {
    return scrapePagesMangaNato(url, chapter);
  } else if (url.includes("mangatoto.com")) {
  }
};

const scrapePagesMangaNato = async (url: string, chapter: string) => {
  const res = await fetch(`${url}/chapter-${chapter}`);

  const text = await res.text();

  if (text.includes("404 - PAGE NOT FOUND")) {
    throw new Error("Invalid manga chapter was provided");
  }

  const html = htmlParser(text);

  return html
    .querySelectorAll(".container-chapter-reader img")
    .map((element) => element.getAttribute("src"));
};
