import { AUCHAN_HOST, AUCHAN_WINE_DEPARTMENT, WINE_TIME_HOST, WINE_TIME_WINE_DEPARTMENT } from 'src/app/app.constants';

export const isAuchanWineDepartment = () => {
  return window.location.host.includes(AUCHAN_HOST) && window.location.pathname.includes(AUCHAN_WINE_DEPARTMENT);
};

export const isWineTimeWineDepartment = () => {
  return window.location.host.includes(WINE_TIME_HOST)
    && (window.location.pathname.includes('wine/')
    || window.location.pathname.includes('wines')
    || window.location.pathname.includes('-wine')
    || window.location.pathname.includes('lambrusko.htm')
    || window.location.pathname.includes('asti.htm')
    || window.location.pathname.includes('prosecco.htm')
    || window.location.pathname.includes('cava.htm')
    || window.location.pathname.includes('grenache.htm')
    || window.location.pathname.includes('cabernet-sauvignon.htm')
    || window.location.pathname.includes('karmener.htm')
    || window.location.pathname.includes('malbec.htm')
    || window.location.pathname.includes('merlot.htm')
    || window.location.pathname.includes('nebbiolo.htm')
    || window.location.pathname.includes('pinot-noir.htm')
    || window.location.pathname.includes('sangiovese.htm')
    || window.location.pathname.includes('gewurztraminer.htm')
    || window.location.pathname.includes('chardonnay.htm')
    || window.location.pathname.includes('sauvignon-blanc.htm')
    || window.location.pathname.includes('riesling.htm')
    || window.location.pathname.includes('muscat.htm'));
};
