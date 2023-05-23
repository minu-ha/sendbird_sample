import { FC, lazy, LazyExoticComponent } from 'react';

export interface Router {
  path: string;
  component?: LazyExoticComponent<FC>;
  children?: Router[];
}

export enum ROUTE_PATH {
  HOME = '/',
  GROUP_CHANNEL = '/group-channel',
  CHAT = '/chat',
}

export const routers: Router[] = [
  {
    path: ROUTE_PATH.HOME,
    component: lazy(() => import('pages/home')),
  },
  {
    path: ROUTE_PATH.GROUP_CHANNEL,
    component: lazy(() => import('pages/channel')),
  },
  {
    path: ROUTE_PATH.CHAT,
    component: lazy(() => import('pages/chat')),
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
