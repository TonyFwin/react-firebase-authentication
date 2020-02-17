import React, { Component } from 'react';

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);

    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <div className='message-list-item card'>
        {editMode ? (
          <input
            type='text'
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <div className='card-title'>
            <strong>{message.user.username || message.user.userId}</strong>{' '}
          </div>
        )}
        <div className='card-body'>
          <div className='message'>
            {message.text} {message.editedAt && <span>(Edited)</span>}
            <div>
              {editMode ? (
                <span>
                  <button
                    className='button extra-small primary'
                    onClick={this.onSaveEditText}
                  >
                    Save
                  </button>
                  <button
                    className='button extra-small warning'
                    onClick={this.onToggleEditMode}
                  >
                    Reset
                  </button>
                </span>
              ) : (
                <button
                  className='button extra-small warning'
                  onClick={this.onToggleEditMode}
                >
                  Edit
                </button>
              )}
              {!editMode && (
                <button
                  className='button extra-small error'
                  type='button'
                  onClick={() => onRemoveMessage(message.uid)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageItem;
