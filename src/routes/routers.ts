import { FC, lazy, LazyExoticComponent } from 'react';

export interface Router {
  key: string;
  path: string;
  component?: LazyExoticComponent<FC>;
  children?: Router[];
}

enum ROUTE_KEY {
  LOGIN = 'login',
  OPEN_CHAT = 'open-chat',
}

enum ROUTE_PATH {
  LOGIN = '/',
  OPEN_CHAT = '/open-chat',
}

export const routers: Router[] = [
  {
    path: ROUTE_PATH.LOGIN,
    component: lazy(() => import('pages/Login')),
    key: ROUTE_KEY.LOGIN,
  },
  {
    path: ROUTE_PATH.OPEN_CHAT,
    component: lazy(() => import('pages/OpenChat')),
    key: ROUTE_KEY.OPEN_CHAT,
  },
];

const flatPaths = (routers: Router[], router: Router) => {
  if (!router.children) {
    routers.push(router);
  } else if (router.component) {
    routers.push(router);
  }
  router.children?.forEach(children => flatPaths(routers, children));
  return routers;
};

export const routerPaths = routers.flatMap((router: Router) => flatPaths([], router));
