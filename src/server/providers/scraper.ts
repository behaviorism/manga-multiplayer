import htmlParser from "node-html-parser";
import { Manga, MangaSource } from "../../types";
import { BadRequestError, NotFoundError } from "../handlers/errors";

export const scrapeManga = (url: string) => {
  const { hostname } = new URL(url);

  switch (hostname) {
    case "manganato.com":
    case "chapmanganato.com":
      return scrapeMangaNato(url);
    case "mangatoto.com":
      throw new BadRequestError(`Site: "${hostname}" is not implemented yet`);
    default:
      throw new BadRequestError(`Site: ${hostname} is not supported`);
  }
};

const scrapeMangaNato = async (
  url: string
): Promise<Omit<Manga, "bookmark">> => {
  const _url = url.replace(
    "https://manganato.com",
    "https://chapmanganato.com"
  );

  const response = await fetch(_url);

  const text = await response.text();

  if (text.includes("404 - PAGE NOT FOUND")) {
    throw new NotFoundError("Invalid manga url was provided");
  }

  const html = htmlParser(text);

  const name = html.querySelector(".story-info-right h1")!.textContent;
  const cover_url = html.querySelector(".info-image img")!.getAttribute("src")!;
  const chapters = html
    .querySelectorAll(".panel-story-chapter-list a")
    .map((element) => element.getAttribute("href")!.split("/chapter-")[1]);

  chapters.reverse();

  return {
    url: _url,
    name,
    cover_url,
    chapters,
    source: MangaSource.MangaNato,
  };
};

export const scrapeMangaPages = (url: string, chapter: string) => {
  const { hostname } = new URL(url);

  switch (hostname) {
    case "manganato.com":
    case "chapmanganato.com":
      return scrapePagesMangaNato(url, chapter);
    case "mangatoto.com":
      throw new BadRequestError("Site not implemented yet");
    default:
      throw new BadRequestError("Site is not supported");
  }
};

const scrapePagesMangaNato = async (url: string, chapter: string) => {
  const response = await fetch(`${url}/chapter-${chapter}`);

  const text = await response.text();

  if (text.includes("404 - PAGE NOT FOUND")) {
    throw new NotFoundError("Invalid manga chapter was provided");
  }

  const html = htmlParser(text);

  const pagesUrls = html
    .querySelectorAll(".container-chapter-reader img")
    .map((element) => element.getAttribute("src")!);

  return await Promise.all(
    pagesUrls.map(async (pageUrl) => {
      const response = await fetch(pageUrl, {
        headers: { referer: "https://chapmanganato.com/" },
      });
      return `data:${response.headers.get("Content-Type")};base64,${Buffer.from(
        await response.arrayBuffer()
      ).toString("base64")}`;
    })
  );

  return;
};
