import React from 'react';
import Modal from '../modal';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

class DonorProfileTagsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.tags,
      value: '',
      suggestions: [],
      isDataError: false,
      isDisabled: false,
      isLoading: false
    }

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.submitTag = this.submitTag.bind(this);
    this.addTag = this.addTag.bind(this);
    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  onSuggestionsFetchRequested({ value }) {
    const { apiKey, tagsSuggestionsUrl } = this.props;
    const { tags } = this.state;

    const params = {
      value: value,
      api_key: apiKey
    }

    return axios.get(tagsSuggestionsUrl, { params: params })
      .then((response) => {
        const suggestions = response.data.map(tag => tag.name);
        const filtered = suggestions.filter((suggestion) => {
          return tags.indexOf(suggestion) === -1;
        })
        this.setState({ suggestions: filtered });
      });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  onSuggestionSelected(event, { suggestionValue }) {
    this.addTag(suggestionValue);
    this.setState({ value: '' });
  }

  onChange(event, { newValue }) {
    this.setState({ value: newValue });
  }

  getSuggestionValue(suggestion) {
    return suggestion;
  }

  cancel() {
    this.props.onCancel();
  }

  update() {
    const { value } = this.state;
    const { onUpdate } = this.props;

    if (value) { this.addTag(value); }

    this.setState({ isLoading: true, isDisabled: true });
    onUpdate(this.state.tags);
  }

  submitTag(event) {
    event.preventDefault();

    const tag = this.state.value;

    if (tag.length === 0) { return; }

    this.addTag(tag);
    this.setState({ value: '' });
  }

  addTag(tagName) {
    const tags = this.state.tags;

    if (tags.indexOf(tagName) > -1) {
      return;
    }

    tags.push(tagName);
    this.setState({ tags: tags });
  }

  removeTag(tagName) {
    let tags = this.state.tags;
    tags = tags.filter(tag => tag != tagName);
    this.setState({ tags: tags });
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
    let itemClassName;
    if (isHighlighted) {
      itemClassName = 'is-highlighted';
    }

    return (
      <div data-tags-suggestion={suggestion} className={`autosuggest-item ${itemClassName}`}>
        <span className="autosuggest-item__name">{suggestion}</span>
      </div>
    )
  }

  renderError() {
    if (this.state.isDataError) {
      return <p className="dashboard__error">This data cannot be shown at this time.</p>;
    }

    return null;
  }

  renderTags() {
    return this.state.tags.map((tag, index) => {
      return (
        <div key={index} className="tag-item" data-tag-item={tag}>
          <span className="tag-item__label">{tag}</span>
          <button onClick={this.removeTag.bind(this, tag)} data-tag-remove={tag} className="tag-item__remove">Delete</button>
        </div>
      )
    });
  }

  render() {
    const { isLoading, isDisabled } = this.state;
    const error = this.renderError();
    const tags = this.renderTags();

    const inputProps = {
      value: this.state.value,
      onChange: this.onChange,
      'data-tags-input': 'true',
      autoFocus: true,
      maxLength: 255
    }

    const modalAttrs = { 'data-donor-tags-modal': 'true' }

    return (
      <Modal
        onCancel={this.cancel}
        onUpdate={this.update}
        title="Edit Tags"
        attrs={modalAttrs}
        isDisabled={isDisabled}
        isLoading={isLoading}
      >
        {error}
        <form onSubmit={this.submitTag} className="tags-form">
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />

          <button className="tags-form__btn">Add</button>
        </form>

        <div data-tags-collection-form className="tags-list">
          {tags}
        </div>
      </Modal>
    )
  }
}

export default DonorProfileTagsForm;
