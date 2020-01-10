import React from 'react';

import { useFirebase } from '../Firebase';

const Landing = props => {
  const [users, setUsers] = React.useState(null);

  const firebase = useFirebase();

  React.useEffect(() => {
    firebase.users().on('value', snapshot => {
      const userObject = snapshot.val();
      setUsers(
        Object.keys(userObject).map(userId => {
          return {
            uid: userId,
            ...userObject[userId]
          };
        })
      );
    });
  }, [firebase]);

  if (!users) return null;

  console.log({ users });
  return (
    <div>
      <h1>Landing</h1>
      {users.map((user, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }} key={index}>
          <span>{user.username}</span> <span>{user.email}</span>
        </div>
      ))}
    </div>
  );
};

export default Landing;
