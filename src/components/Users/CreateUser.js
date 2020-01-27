import React from 'react';
import { useFirebase } from '../Firebase';
import { useHistory } from 'react-router-dom';

const CreateUser = () => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pod, setPod] = React.useState('');
  const [pods, setPods] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [gender, setGender] = React.useState('male');

  const history = useHistory();

  const firebase = useFirebase();

  React.useEffect(() => {
    firebase.pods().on('value', snapshot => {
      const podObject = snapshot.val();

      if (podObject) {
        const podList = Object.keys(podObject).map(key => ({
          ...podObject[key],
          uid: key
        }));

        setPods(podList);
      } else {
        setPods(null);
      }
    });
    return () => {
      firebase.pods().off();
    };
  }, [firebase]);

  const handleSubmit = e => {
    e.preventDefault();
    firebase
      .users()
      .push({ username, email, gender, pod })
      .then(
        success => {
          firebase
            .doSendSignInLinkToEmail(email, {
              url: 'http://localhost:3000/signup',
              handleCodeInApp: true
            })
            .then(() => {
              history.push('/admin');
            })
            .catch(err => {
              setError(err.message);
            });
        },
        error => {
          setError(error);
        }
      );
  };

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={username}
        onChange={e => setUsername(e.currentTarget.value)}
        placeholder='Full Name'
      />
      <input
        type='email'
        value={email}
        onChange={e => setEmail(e.currentTarget.value)}
        placeholder='E-mail'
      />
      <select
        onChange={e => setGender(e.target.value)}
        name='gender'
        value={gender}
      >
        <option name='male'>Male</option>
        <option value='female'>Female</option>
      </select>
      <select
        onChange={e => setPod(e.currentTarget.value)}
        value={pod}
        name='pods'
        id='pods'
      >
        {pods.map(pod => (
          <option key={pod.uid} value={pod.uid}>
            {pod.podTitle}
          </option>
        ))}
      </select>
      <button type='submit'>Submit</button>
    </form>
  );
};

export default CreateUser;
