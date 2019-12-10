import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <button type='button' onclick={firebase.doSignOut}>
    SignOut
  </button>
);

export default withFirebase(SignOutButton);
