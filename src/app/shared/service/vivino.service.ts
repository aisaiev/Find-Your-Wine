import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { IWineRating } from '../model/wine-rating.model';

export class VivinoService {
  private resourceUrl = 'https://find-your-wine.herokuapp.com';

  public getWineRating2(wineName: string): Observable<IWineRating | undefined> {
    return ajax.get(`${this.resourceUrl}/get-wine-rating?wine=${wineName}`).pipe(
      map(res => res.response),
      catchError(() => {
        return of(undefined);
      })
    );
  }
}
