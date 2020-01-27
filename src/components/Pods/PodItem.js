import React, { Component } from 'react';

class PodItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.pod.podTitle
    };
  }

  onToggleEditMode = () => {
    console.log('edit mode bro');
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.pod.podTitle
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditPod(this.props.pod, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { pod, onRemovePod } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type='text'
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <strong>{pod.podTitle}</strong>
        )}
        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button type='button' onClick={this.onToggleEditMode}>
            Edit
          </button>
        )}
        {!editMode && (
          <button type='button' onClick={() => onRemovePod(pod.uid)}>
            Delete
          </button>
        )}
      </li>
    );
  }
}

export default PodItem;
