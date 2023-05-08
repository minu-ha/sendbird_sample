import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routerPaths } from './routers';
import { ComponentType, LazyExoticComponent, Suspense } from 'react';

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>loading</div>}>
        <Routes>
          {routerPaths.map(({ key, path, component }) => {
            const Component = component as LazyExoticComponent<ComponentType>;
            return <Route key={key} path={path} element={<Component />} />;
          })}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
