import React from 'react';

const FirebaseContext = React.createContext(null);

export default withFirebase = Componet => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);
