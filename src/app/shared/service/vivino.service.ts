import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, publishReplay, refCount } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';
import { IVivinoQueryParams } from '../model/vivino-query-params.model';
import { IVivinoQueryResult } from '../model/vivino-query-result.model';
import * as cheerio from 'cheerio';

export class VivinoService {
  private resourceUrl = 'https://www.vivino.com';

  private resourceUrl2 = 'https://9takgwjuxl-dsn.algolia.net/1/indexes/WINES_prod/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.33.0)%3B%20Browser%20(lite)&x-algolia-application-id=9TAKGWJUXL&x-algolia-api-key=60c11b2f1068885161d95ca068d3a6ae';

  private headers = {'Content-Type': 'application/json'};

  private cache = {};

  constructor() {
    // this.initCacheDispatcher(30000);
  }

  public getWineRating(wineName: string): Observable<IWineRating | undefined> {
    if (!this.cache[wineName]) {
      this.cache[wineName] = ajax({
        url: `${this.resourceUrl}/search/wines?q=${encodeURIComponent(wineName)}`,
        method: 'GET',
        responseType: 'text'
      }).pipe(
        publishReplay(1),
        refCount(),
        map(res => this.exportWineRating(res.response)),
        catchError(error => {
          console.error(error);
          return of(undefined);
        })
      );
    }
    return this.cache[wineName];
  }

  public getWineRating2(wineName: string): Observable<IWineRating | undefined> {
    if (!this.cache[wineName]) {
      const params: IVivinoQueryParams = {
        params: `query=${encodeURIComponent(wineName)}&hitsPerPage=6`
      };
      this.cache[wineName] = ajax.post(this.resourceUrl2, params, this.headers).pipe(
        publishReplay(1),
        refCount(),
        map(res => this.exportWineRating2(res.response)),
        catchError(error => {
          console.error(error);
          return of(undefined);
        })
      );
    }
    return this.cache[wineName];
  }

  private exportWineRating(htmlPage: string): IWineRating | undefined {
    const $ = cheerio.load(htmlPage);

    const wines: IWineRating[] = [];

    $('.card').each((index, element) => {
      const name = $(element)
        .find('.wine-card__name .link-color-alt-grey')
        .text()
        .trim();

      const score = $(element)
        .find('.average__number')
        .text()
        .trim()
        .replace(',', '.');

      const reviewsCount = $(element)
        .find('.text-micro')
        .text()
        .trim();

      const href = $(element).find('a').attr('href');
      const link = `${this.resourceUrl}${href}`;

      if (!reviewsCount) {
        return;
      }

      wines.push({
        name,
        score: parseFloat(score),
        reviewsCount: parseFloat(reviewsCount),
        link
      });
    });

    return wines.length > 0 ? wines[0] : undefined;
  }

  private exportWineRating2(vivinoQueryResult: IVivinoQueryResult): IWineRating | undefined {
    const wines: IWineRating[] = [];
    vivinoQueryResult.hits.forEach(vivino => {
      const name = vivino.vintages.length > 0 ? vivino.vintages[0].name : undefined;
      const score = vivino.statistics.ratings_average;
      const reviewsCount = vivino.statistics.ratings_count;
      const link = vivino.vintages.length > 0 ? `${this.resourceUrl}/wines/${vivino.vintages[0].id}?cart_item_source=text-search` : this.resourceUrl;

      if (!score) {
        return;
      }

      wines.push({
        name,
        score,
        reviewsCount,
        link
      });
    });
    return wines.length > 0 ? wines[0] : undefined;
  }

  public clearCache() {
    this.cache = {};
  }

  private initCacheDispatcher(interval: number): void {
    setInterval(() => {
      this.clearCache();
    }, interval);
  }
}
