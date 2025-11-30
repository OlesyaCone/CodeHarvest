import { Request, Response } from "express";
import { extractSiteHTML, extractSiteCss } from "../services/puppeteerService";

class ScrapeController {
  async getCode(req: Request, res: Response) {
    try {
      const url = req.query.url as string;

      const [html, css] = await Promise.all([
        extractSiteHTML(url),
        extractSiteCss(url)
      ]);

      res.json({ success: true, html, css });
      
    } catch (error) {
      const err = error as Error;
      
      if (err.message.includes('Navigation timeout')) {
        return res.status(408).json({
          success: false,
          error: 'Сайт не отвежает слишком долго'
        });
      }
      if (err.message.includes('ERR_NAME_NOT_RESOLVED')) {
        return res.status(400).json({
          success: false,
          error: 'Неверный адрес сайта'
        });
      }
      if (err.message.includes('ERR_CONNECTION_REFUSED')) {
        return res.status(503).json({
          success: false,
          error: 'Сайт временно недоступен'
        });
      }
      if (err.message.includes('ERR_ABORTED')) {
        return res.status(403).json({
          success: false,
          error: 'Доступ к сайту заблокирован'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Ошибка при получении данных с сайта'
      });
    }
  }
}

export { ScrapeController };