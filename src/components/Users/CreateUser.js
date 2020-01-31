import React, { useState } from 'react';
import { useFirebase } from '../Firebase';
import { useHistory } from 'react-router-dom';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pod, setPod] = useState('');
  const [pods, setPods] = useState([]);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState('male');
  const [title, setTitle] = useState('');
  const [moves, setMoves] = useState([]);

  const history = useHistory();
  const firebase = useFirebase();
  const limit = 555;

  function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(limit));
  }

  React.useEffect(() => {
    async function fetchPokeMove() {
      await fetch(`https://pokeapi.co/api/v2/move/?limit=${limit}`)
        .then(res => res.json())
        .then(data =>
          setMoves([
            data.results[getRandomInt()].name.replace(/-/g, ' '),
            data.results[getRandomInt()].name.replace(/-/g, ' ')
          ])
        )
        .catch(error => console.log(error));
      return;
    }

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
    fetchPokeMove();
    return () => {
      firebase.pods().off();
    };
  }, [firebase]);

  const handleSubmit = e => {
    e.preventDefault();
    firebase
      .users()
      .push({ username, email, gender, pod, title, moves })
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
    <>
      <div>
        Your moves are{' '}
        {moves.length && (
          <>
            <strong className='form-pokemon-move'>{moves[0]}</strong> &{' '}
            <strong className='form-pokemon-move'>{moves[1]}</strong>
          </>
        )}
      </div>
      <form className='user-form' onSubmit={handleSubmit}>
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
        <input
          type='text'
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          placeholder='Title'
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
    </>
  );
};

export default CreateUser;
