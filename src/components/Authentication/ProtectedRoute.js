/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  Route, Redirect
} from 'react-router-dom';
// import auth from './Auth';
import {
  getFromStorage
} from '../Storage';

export const ProtectedRoute = ({ component: Component, ...rest }) =>
  (
    <Route
      {...rest}
      render={
            (props) => {
              if (getFromStorage('expense_app')) {
                return <Component {...props} />;
              }
              return (
                <Redirect to={
                        {
                          pathname: '/',
                          state: {
                            from: props.location
                          }
                        }
                    }
                />
              );
            }
        }
    />
  );
