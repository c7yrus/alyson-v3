import { push } from 'react-router-redux';
import * as actions from './vertx.actions';
import { showDialog } from '../../../redux/actions';
import { Bridge } from '../../../utils';

const middleware = store => next => action => {
  /* Since we are not making any side effects to `action`, pass on next. */
  next( action );

  if ( action.type === 'AUTH_ATTEMPT_SUCCESS' ) {
    store.dispatch(
      actions.initVertx()
    );
  }

  if ( action.type === 'VERTX_INIT_ATTEMPT' ) {
    const { data, accessToken } = store.getState().keycloak;

    Bridge.initVertx( data.vertx_url, accessToken );
  }

  if ( action.type === 'VERTX_INIT_SUCCESS' ) {
    const { accessToken } = store.getState().keycloak;

    Bridge.sendAuthInit( accessToken );
  }

  if ( action.type === 'ROUTE_CHANGE' ) {
    const { code, modal } = action.payload;

    if ( modal ) {
      store.dispatch(
        showDialog({ layoutName: code })
      );
    }
    else {
      store.dispatch(
        push( code )
      );
    }
  }
};

export default middleware;
