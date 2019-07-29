import React from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import DonorProfilePlaceholder from './placeholder';
import DonorProfileNote from './note';

class DonorProfileNoteList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [],
      isLoading: false,
      dataFetched: false,
      isDataError: false,
      newNote: ''
    }

    this.saveNote = this.saveNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.handleNewNoteChange = this.handleNewNoteChange.bind(this);
  }

  componentDidMount() {
    this.fetchNotes();
  }

  initializePagination(totalCount) {
    const { donorId, notesPerPage, apiKey, notesUrl } = this.props;
    const url = `${notesUrl}?api_key=${apiKey}&donor_id=${donorId}`;

    $(this.el).pagination({
      dataSource: url,
      locator: 'donor_notes',
      pageSize: notesPerPage,
      totalNumber: totalCount,
      triggerPagingOnInit: false,
      hideWhenLessThanOnePage: true,

      alias: {
        pageNumber: 'page',
        pageSize: 'per_page'
      },

      ajax: {
        beforeSend: () => {
          this.setState({ isLoading: true });
        }
      },

      callback: (data, pagination) => {
        this.setState({ notes: data, isLoading: false });
      }
    });
  }

  fetchNotes() {
    this.setState({ isLoading: true });

    const { donorId, apiKey, notesPerPage, notesUrl } = this.props;

    // Include params directly in the string so that
    // they can be passed to the pagination plugin.
    const url = notesUrl;
    const params = {
      api_key: apiKey,
      donor_id: donorId,
      per_page: notesPerPage
    }

    return axios.get(url, { params })
      .then((response) => {
        const notes = response.data['donor_notes'];
        const totalCount = response.data['meta']['total_count'];

        this.setState({
          notes: notes,
          isLoading: false,
          dataFetched: true
        });

        return totalCount;
      })
      .catch(() => {
        this.setState({
          isDataError: true,
          isLoading: false,
          dataFetched: true
        });
      })
      .then((totalCount) => {
        if (totalCount > 0) {
          this.initializePagination(totalCount);
        }
      });
  }

  mergeNotes(newNote) {
    // Return a copy of notes in state,
    // replacing the old note with the new.
    // Keeps things immutable. Yay.
    return this.state.notes.map((oldNote) => {
      if (oldNote.id === newNote.id) { return newNote; }
      return oldNote;
    });
  }

  saveNote(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    const { donorId, apiKey, notesPerPage, notesAddUrl } = this.props;
    const { newNote } = this.state;
    const url = notesAddUrl;
    const params = {
      api_key: apiKey,
      donor_id: donorId,
      donor_note: { body: newNote }
    }

    return axios.post(url, params)
      .then((response) => {
        return this.fetchNotes();
      })
      .then((response) => {
        this.setState({
          newNote: '',
          isLoading: false
        });
      });
  }

  updateNote(note, body) {
    this.setState({ isLoading: true });

    const { donorId, apiKey } = this.props;
    const url = note.update_url;
    const params = {
      api_key: apiKey,
      donor_id: donorId,
      donor_note: { body: body }
    }

    return axios.put(url, params)
      .then((response) => {
        const note = response.data;
        const notes = this.mergeNotes(note);

        this.setState({
          notes: notes,
          isLoading: false
        });
      })
      .catch(() => {
        this.setState({ isLoading: false });
        alert("Oops! That couldn't be saved. Refresh the page and try again?");
      });
  }

  deleteNote(note, event) {
    event.preventDefault();

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ['Cancel', 'Delete'],
      dangerMode: true
    }).then((confirmed) => {
      if (!confirmed) { return; }

      const { apiKey, donorId } = this.props;
      const url = `${note.delete_url}?api_key=${apiKey}&donor_id=${donorId}`;

      this.setState({ isLoading: true });
      axios.delete(url)
        .then((response) => {
          this.setState({ isLoading: false });
          this.fetchNotes();
        })
        .catch((error) => {
          console.error(error);
        })
    });
  }

  handleNewNoteChange(event) {
    const { value } = event.target;
    this.setState({ newNote: value });
  }

  isValid() {
    const { newNote } = this.state;
    return newNote != '';
  }

  isDisabled() {
    const { isLoading } = this.state;
    const isValid = this.isValid();
    return isLoading || !isValid;
  }

  renderNotes() {
    const { canEditNote } = this.props;
    const { notes } = this.state;

    return notes.map((note) => {
      return (
        <DonorProfileNote
          key={note.id}
          note={note}
          onSave={this.updateNote}
          onDelete={this.deleteNote}
          canEditNote={canEditNote} />
      )
    });
  }

  renderForm() {
    const { canAddNote } = this.props;
    if (!canAddNote) { return null; }

    const { newNote } = this.state;
    const disabled = this.isDisabled();

    return (
      <div className="donor-notes__form">
        <textarea
          value={newNote}
          onChange={this.handleNewNoteChange}
          className="donor-notes__textarea"
          data-test-note-create-input>
        </textarea>

        <button
          onClick={this.saveNote}
          className="btn btn__small btn__lt-blue"
          disabled={disabled}
          data-test-note-create-submit>
          Add Note
        </button>
      </div>
    )
  }

  renderNotesAndForm() {
    const form = this.renderForm();
    const notes = this.renderNotes();

    return (
      <React.Fragment>
        {form}
        <div className="donor-notes__list">
          {notes}
        </div>
      </React.Fragment>
    )
  }

  renderBody() {
    const { dataFetched, isDataError } = this.state;

    if (!dataFetched) {
      return <DonorProfilePlaceholder />;
    }

    if (isDataError) {
      return <p className="dashboard__error">This data cannot be shown at this time.</p>;
    }

    return this.renderNotesAndForm();
  }

  renderLoading() {
    if (this.state.isLoading) {
      return <div className="loading-bar"></div>
    }

    return null;
  }

  render() {
    const loading = this.renderLoading();
    const body = this.renderBody();

    return (
      <div className="donor-notes block">
        {loading}

        <div className="block-header">
          <h2 className="title__h4">Notes</h2>
        </div>

        <div className="donor-notes__wrapper" ref={(el) => { this.el = el; }}>
          {body}
        </div>
      </div>
    );
  }
}

export default DonorProfileNoteList;
