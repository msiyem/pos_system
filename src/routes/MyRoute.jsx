import { Routes, Route } from 'react-router-dom';
import { routes } from './routeConfig';
import RoleRoute from './RoleRoute';
import Error from '../error';
import Unauthorized from '../private/pages/unauthorized';

function renderRoutes(routeList) {
  return routeList.map((route) => {
    const Component = route.element;

    return (
      <Route
        key={route.path || 'index'}
        path={route.path}
        index={route.index}
        element={
          <RoleRoute allow={route.roles}>
            <Component />
          </RoleRoute>
        }
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
}

export default function MyRoutes() {
  return (
    <Routes>
      {renderRoutes(routes)}

    </Routes>
  );
}