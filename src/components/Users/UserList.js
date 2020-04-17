import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const firebase = useFirebase();

  useEffect(() => {
    setLoading(true);

    firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      if (usersObject) {
        const userList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key
        }));

        setUsers(userList);
        setLoading(false);
      } else {
        setUsers([]);
        setLoading(false);
      }
    });

    return () => {
      firebase.users().off();
    };
  }, [firebase]);

  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading ...</div>}
      <div className='user-list'>
        {users.map(user => (
          <div className='user-list-item' key={user.uid}>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong>{' '}
              {user.username ? user.username : user.name}
            </span>
            <span>
              <Link
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user }
                }}
              >
                Edit
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
