import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      pods: [],
      ...props.location.state
    };
  }

  componentDidMount() {
    this.props.firebase.pods().on('value', snapshot => {
      const podsObject = snapshot.val();

      if (podsObject) {
        const podList = Object.keys(podsObject).map(key => ({
          ...podsObject[key],
          uid: key
        }));
        this.setState({ pods: podList, loading: false });
      } else {
        this.setState({ pods: null, loading: false });
      }
    });

    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          loading: false
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
    this.props.firebase.pods().off();
  }

  render() {
    const { user, loading, pods } = this.state;
    const { email, username, moves, title, profilePictureUrl } = user;

    return (
      <>
        {loading && <div>Loading ...</div>}

        {user && (
          <div className='user'>
            <div className='user-image'>
              <img src={profilePictureUrl} alt={username} />
            </div>
            <div className='user-data'>
              <ul className='user-data-list'>
                <li>
                  <span>Name: </span>
                  {username}
                </li>
                <li>
                  <span>E-mail: </span>
                  {email}
                </li>
                <li>
                  <span>Title: </span>
                  {title}
                </li>
                <li>
                  <span>Pod: </span>
                  <UserPod podObject={pods.find(pod => pod.uid === user.pod)} />
                </li>
                {moves && (
                  <>
                    <li className='pokemon-move'>
                      <span>Quick Move: </span>
                      {moves[0]}
                    </li>
                    <li className='pokemon-move'>
                      <span>Charged Move: </span>
                      {moves[1]}
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </>
    );
  }
}

const UserPod = podObject => {
  const pod = podObject.podObject;
  return <>{pod ? pod.podTitle : 'No Pod'}</>;
};

export default withFirebase(UserPage);
