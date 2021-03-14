import { Request, Response } from "express";
import { MediaSourceService } from "../services/MediaSourceService";
import { HdhubCrawlerService } from "../services/Crawlers/HdhubCrawlerService";
import { ExtramoviesCrawlerService } from "../services/Crawlers/ExtramoviesCrawlerService";

const _mediaSourceService = new MediaSourceService();
const _hdhubCrawlerService = new HdhubCrawlerService();
const _extramoviesCrawlerService = new ExtramoviesCrawlerService();

export class CrawlerController {
  public async fetchLatestHdhub(req: Request, res: Response) {
    const latest = await _mediaSourceService.findLastModifiedMediaSource("hdhub");    
    res.json(latest);
  }

  public async fetchLatestExtramovies(req: Request, res: Response) {
    const latest = await _mediaSourceService.findLastModifiedMediaSource("extramovies");    
    res.json(latest);
  }

  public async crawlHdhub(req: Request, res: Response) {
    const latest = await _mediaSourceService.findLastModifiedMediaSource("hdhub");
    const lastModifiedFromConfig = latest?.modified;
    const sources = await _hdhubCrawlerService.fetch(lastModifiedFromConfig);
    for (const source of sources) {
      await _mediaSourceService.upsertMediaSource(source);  
    }
    res.json({ count: sources.length });
  }

  public async crawlExtramovies(req: Request, res: Response) {
    const latest = await _mediaSourceService.findLastModifiedMediaSource("extramovies");
    const lastModifiedFromConfig = latest?.modified;
    const sources = await _extramoviesCrawlerService.fetch(lastModifiedFromConfig);
    for (const source of sources) {
      await _mediaSourceService.upsertMediaSource(source);  
    }
    res.json({ count: sources.length });
  }
}
