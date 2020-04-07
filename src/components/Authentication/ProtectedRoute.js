/* eslint-disable import/prefer-default-export */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Route, Redirect
} from 'react-router-dom';
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
