import React, { createContext, useContext } from 'react';

const FirebaseContext = createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error(
      'useFirebase must be wrapped in a FirebaseContext.Provider component'
    );
  }

  return context;
};

export default FirebaseContext;
