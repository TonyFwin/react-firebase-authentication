import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';

const PodsPage = () => (
  <div>
    <h1>Pods</h1>
    <div>
      <h2>Pods:</h2>
      <Pods />
    </div>
  </div>
);

class PodsBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      podTitle: '',
      loading: false,
      pods: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.pods().on('value', snapshot => {
      const podObject = snapshot.val();

      if (podObject) {
        const podList = Object.keys(podObject).map(key => ({
          ...podObject[key],
          uid: key
        }));
        this.setState({ pods: podList, loading: false });
      } else {
        this.setState({ pods: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.pods().off();
  }

  onChangePodTitle = event => {
    this.setState({ podTitle: event.target.value });
  };

  onCreatePod = event => {
    this.props.firebase.pods().push({
      podTitle: this.state.podTitle
    });

    this.setState({ podTitle: '' });

    event.preventDefault();
  };

  onRemovePod = uid => {
    this.props.firebase.pod(uid).remove();
  };

  render() {
    const { podTitle, pods, loading } = this.state;

    return (
      <div>
        {loading && <div>Loading...</div>}

        {pods ? (
          <PodList pods={pods} onRemovePod={this.onRemovePod} />
        ) : (
          <div>There are no pods...</div>
        )}

        <form onSubmit={this.onCreatePod}>
          <input
            type='text'
            value={podTitle}
            onChange={this.onChangePodTitle}
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    );
  }
}

const PodList = ({ pods, onRemovePod }) => (
  <ul>
    {pods.map(pod => (
      <PodItem key={pod.uid} pod={pod} onRemovePod={onRemovePod} />
    ))}
  </ul>
);

const PodItem = ({ pod, onRemovePod }) => (
  <li>
    <strong>{pod.podTitle}</strong>
    <button type='button' onClick={() => onRemovePod(pod.uid)}>
      Delete
    </button>
  </li>
);

const Pods = withFirebase(PodsBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(PodsPage);
