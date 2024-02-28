import express, { NextFunction } from "express";
import { BadRequestError } from "../handlers/errors";
import { scrapeManga, scrapeMangaPages } from "../providers/scraper";

const router = express.Router();

router.get("/fetchManga", async (request, response, next: NextFunction) => {
  try {
    const url = request.query.url as string;

    if (!url) {
      throw new BadRequestError('Parameter: "url" required');
    }

    const manga = await scrapeManga(url);

    response.json(manga);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/fetchMangaPages",
  async (request, response, next: NextFunction) => {
    try {
      const { url, chapter } = request.query;

      if (!(url && chapter)) {
        throw new BadRequestError('Parameters: "url" and "chapter" required');
      }

      const pages = await scrapeMangaPages(url as string, chapter as string);

      response.json(pages);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
