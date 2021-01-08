import { AUCHAN_HOST, GOOD_WINE_HOST, MESSAGE_TYPE, TAB_STATUS, WINE_TIME_HOST } from './app/app.constants';
import { IMessage } from './app/shared/model/message.model';
import { VivinoService } from './app/shared/service/vivino.service';

const vivinoService = new VivinoService();

function initialize(): void {
  chrome.runtime.onMessage.addListener(contentMessageListener);
  chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
}

function contentMessageListener(message: IMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean {
  if (message.type === MESSAGE_TYPE.GET_WINE_RATING) {
    vivinoService.getWineRating2(message.data).subscribe(rating => {
      sendResponse(rating);
    });
    return true;
  }
}

function tabsUpdatedListener(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
  if (tab.url.includes(AUCHAN_HOST)) {
    sendMessageToContent(tabId, {
      type: MESSAGE_TYPE.AUCHAN_PAGE_CHANGED,
      data: undefined
    });
  } else if (tab.url.includes(WINE_TIME_HOST)) {
    sendMessageToContent(tabId, {
      type: MESSAGE_TYPE.WINE_TIME_PAGE_CHANGED,
      data: undefined
    });
  } else if (tab.url.includes(GOOD_WINE_HOST)) {
    sendMessageToContent(tabId, {
      type: MESSAGE_TYPE.GOOD_WINE_PAGE_CHANGED,
      data: undefined
    });
  } else {
    // nothing to do.
  }
}

function sendMessageToContent(tabId: number, message: IMessage): void {
  chrome.tabs.sendMessage(tabId, message);
}

initialize();
