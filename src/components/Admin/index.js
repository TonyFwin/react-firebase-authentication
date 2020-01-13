import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

import { UserList, UserItem, CreateUser } from '../Users';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      <Link to={ROUTES.ADMIN_CREATE}>Create New User</Link>

      <Switch>
        <Route exact path={ROUTES.ADMIN_CREATE} component={CreateUser} />
        <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
        <Route exact path={ROUTES.ADMIN} component={UserList} />
      </Switch>
    </div>
  );
};

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AdminPage);
