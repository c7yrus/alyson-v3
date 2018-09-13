import { store } from '../../redux';

const getBasePath = () => {
  const { index, routes } = store.getState().navigation;
  const { params } = routes[index];

  if ( !params )
    return null;

  const { layout } = params;

  if (
    !layout ||
    typeof layout !== 'string'
  ) {
    return null;
  }

  if ( !layout.startsWith( '/' ))
    return `/${layout}`;

  return layout;
};

/* Mock - there will never be query params here. */
const getQueryParams = () => ({});

export default {
  getBasePath,
  getQueryParams,
};
