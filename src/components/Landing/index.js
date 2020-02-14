import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { UserItem } from '../Users';

const Landing = props => {
  const [users, setUsers] = React.useState(null);
  const [pods, setPods] = React.useState([]);

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
    firebase.pods().on('value', snapshot => {
      const podsObject = snapshot.val();
      setPods(
        Object.keys(podsObject).map(podId => {
          return {
            uid: podId,
            ...podsObject[podId]
          };
        })
      );
    });
    return () => {
      firebase.users().off();
      firebase.pods().off();
    };
  }, [firebase]);

  if (!users) return null;

  function getRandomPhotoNumber() {
    return Math.floor(Math.random() * Math.floor(99));
  }

  function getPhotoGender(gender) {
    if (gender === 'male') {
      return 'men';
    }
    return 'women';
  }

  const UserPod = podObject => {
    const pod = podObject.podObject;
    return <>{pod ? pod.podTitle : 'No Pod'}</>;
  };

  return (
    <>
      <h1>Landing</h1>
      <div className='user-grid'>
        {users.map((user, index) => (
          <Link
            to={{
              pathname: `${ROUTES.USER}/${user.uid}`,
              state: { user }
            }}
          >
            <div className='usercard' key={index}>
              <div>
                <img
                  src={`https://randomuser.me/api/portraits/${getPhotoGender(
                    user.gender
                  )}/${getRandomPhotoNumber()}.jpg`}
                  alt=''
                />
              </div>

              <span>Name: {user.username}</span>
              <span>Title: {user.title}</span>
              <span>
                Pod:{' '}
                <UserPod podObject={pods.find(pod => pod.uid === user.pod)} />
              </span>
              <span>
                <ul>
                  {user.moves &&
                    user.moves.map(move => <li key={move}>{move}</li>)}
                </ul>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Landing;
