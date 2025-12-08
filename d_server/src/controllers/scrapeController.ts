import { Request, Response } from "express";
import { SiteExtractor } from "../services/puppeteerService";

class ScrapeController {
  async getCode(req: Request, res: Response) {
    try {
      const extractor = new SiteExtractor();
      const url = req.query.url as string;

      const { html, css, screenshot } = await extractor.extractAll(url);

      res.json({ 
        success: true, 
        html, 
        css, 
        screenshot, 
        url 
      });
      
    } catch (error) {
      const err = error as Error;
      const errorStr = String(error);
      
      if (errorStr.includes("ERR_NAME_NOT_RESOLVED")) {
        return res.status(400).json({
          success: false,
          error: "Неверный адрес сайта"
        });
      }
      if (errorStr.includes("Navigation timeout")) {
        return res.status(408).json({
          success: false,
          error: "Сайт не отвежает слишком долго"
        });
      }
      if (errorStr.includes("ERR_CONNECTION_REFUSED")) {
        return res.status(503).json({
          success: false,
          error: "Сайт временно недоступен"
        });
      }
      if (errorStr.includes("ERR_ABORTED")) {
        return res.status(403).json({
          success: false,
          error: "Доступ к сайту заблокирован"
        });
      }

      return res.status(500).json({
        success: false,
        error: "Ошибка при получении данных с сайта"
      });
    }
  }
}

export { ScrapeController };