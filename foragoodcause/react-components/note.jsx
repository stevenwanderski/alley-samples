import React from 'react';
import moment from 'moment';

class DonorProfileNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      isDisabled: false,
      noteBody: props.note.body
    }

    this.clickEdit = this.clickEdit.bind(this);
    this.clickCancel = this.clickCancel.bind(this);
    this.clickSave = this.clickSave.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
  }

  clickEdit(event) {
    event.preventDefault();
    this.setState({ isEdit: true });
  }

  clickCancel(event) {
    event.preventDefault();
    this.setState({ isEdit: false });
  }

  clickSave(event) {
    event.preventDefault();
    const { noteBody } = this.state;
    const { note, onSave } = this.props;

    this.setState({ isDisabled: true });

    onSave(note, noteBody)
      .then(() => {
        this.setState({
          isDisabled: false,
          isEdit: false
        });
      })
  }

  isValid() {
    const { noteBody } = this.state;
    return noteBody != '';
  }

  isDisabledSave() {
    const { isDisabled } = this.state;
    if (isDisabled) { return true; }

    return !this.isValid();
  }

  isDisabledCancel() {
    const { isDisabled } = this.state;
    return isDisabled;
  }

  isDisabledInput() {
    const { isDisabled } = this.state;
    return isDisabled;
  }

  handleNoteChange(event) {
    const { value } = event.target;
    this.setState({ noteBody: value });
  }

  renderShow() {
    const { note, onDelete, canEditNote } = this.props;
    const date = moment.parseZone(note.created_at).format('MMM D, YYYY');
    let controls;

    if (canEditNote) {
      controls = (
        <div className="donor-notes__actions">
          <a
            href=""
            onClick={this.clickEdit}
            data-test-note-edit>
            Edit
          </a>

          <a
            href=""
            onClick={onDelete.bind(this, note)}
            data-test-note-delete>
            Delete
          </a>
        </div>
      )
    }

    return (
      <div className="donor-notes__item" data-test-note={note.id}>
        <div className="donor-notes__date label--small" data-test-note-date>{date}</div>
        <p className="donor-notes__text" data-test-note-body>{note.body}</p>
        {controls}
      </div>
    );
  }

  renderEdit() {
    const { noteBody } = this.state;
    const isDisabledSave = this.isDisabledSave();
    const isDisabledCancel = this.isDisabledCancel();
    const isDisabledInput = this.isDisabledInput();

    return (
      <div className="donor-notes__item">
        <textarea
          value={noteBody}
          disabled={isDisabledInput}
          onChange={this.handleNoteChange}
          className="donor-notes__textarea"
          data-test-note-edit-input>
        </textarea>

        <div className="donor-notes__edit-actions">
          <button
            className="btn btn__small btn__lt-blue"
            disabled={isDisabledSave}
            onClick={this.clickSave}
            data-test-note-edit-submit>
            Save
          </button>

          <button
            className="btn btn__small btn__neutral"
            disabled={isDisabledCancel}
            onClick={this.clickCancel}
            data-test-note-edit-cancel>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  render() {
    const { isEdit } = this.state;

    if (isEdit) {
      return this.renderEdit();
    }

    return this.renderShow();
  }
}

export default DonorProfileNote;
