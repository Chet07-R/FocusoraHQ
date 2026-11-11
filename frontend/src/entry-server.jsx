import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import AppRoot from './AppRoot.jsx';

export const render = (url) => {
  const app = <AppRoot Router={StaticRouter} routerProps={{ location: url }} />;
  return {
    html: renderToString(app),
  };
};
