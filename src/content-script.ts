import { debounceTime } from 'rxjs/operators';
import { Message_Type } from './app/app.constants';
import { backgroundMessageListener } from './app/shared/service/message.service';
import { addAuchanWineRating } from './app/shared/stores/auchan.store';
import { addWineTimeWineRating } from './app/shared/stores/wine-time.store';

function initialize(): void {
  backgroundMessageListener.pipe(
    debounceTime(500)
  ).subscribe(event => {
    if (event.message.type === Message_Type.AUCHAN_PAGE_CHANGED) {
      addAuchanWineRating();
    } else if (event.message.type === Message_Type.WINE_TIME_PAGE_CHANGED) {
      addWineTimeWineRating();
    } else {
      // nothing to do.
    }
  });
}

initialize();
