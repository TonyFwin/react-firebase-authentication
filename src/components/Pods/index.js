import React, { Component } from 'react';
import { compose } from 'recompose';

import PodList from './PodList';

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';

const PodsPage = () => (
  <div>
    <h1>Pods</h1>
    <div>
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

  onEditPod = (pod, podTitle) => {
    const { uid, ...podSnapshot } = pod;

    this.props.firebase.pod(pod.uid).set({
      ...podSnapshot,
      podTitle
    });
  };

  render() {
    const { podTitle, pods, loading } = this.state;

    return (
      <div>
        {loading && <div>Loading...</div>}

        {pods ? (
          <PodList
            pods={pods}
            onEditPod={this.onEditPod}
            onRemovePod={this.onRemovePod}
          />
        ) : (
          <div>There are no pods...</div>
        )}

        <form onSubmit={event => this.onCreatePod(event)}>
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

const Pods = withFirebase(PodsBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(PodsPage);
