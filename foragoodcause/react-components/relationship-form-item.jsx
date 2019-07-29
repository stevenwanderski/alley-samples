import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import debounce from 'debounce';

class DonorProfileRelationshipFormItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      donorSuggestions: [],
      autoSuggestValue: '',
      isLoading: false
    }

    this.clickAdd = this.clickAdd.bind(this);
    this.clickRemove = this.clickRemove.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAutoSuggestChange = this.onAutoSuggestChange.bind(this);
    this.onDonorSuggestionsFetchRequested = debounce(this.onDonorSuggestionsFetchRequested.bind(this), 300);
    this.onDonorSuggestionsClearRequested = this.onDonorSuggestionsClearRequested.bind(this);
    this.onDonorSuggestionSelected = this.onDonorSuggestionSelected.bind(this);
  }

  clickAdd() {
    const { onClickAdd } = this.props;
    onClickAdd();
  }

  clickRemove() {
    const { onClickRemove, id } = this.props;
    onClickRemove(id);
  }

  onChange(event) {
    const { id, onChange } = this.props;
    const target = event.target;
    const { name, value } = target;
    const values = [
      { name: name, value: value }
    ];

    onChange(id, values);
  }

  onAutoSuggestChange(event, { newValue }) {
    let autoSuggestValue;

    if (typeof newValue === 'object') {
      autoSuggestValue = `${newValue.first_name} ${newValue.last_name}`;
    } else {
      autoSuggestValue = newValue;
    }

    this.setState({ autoSuggestValue: autoSuggestValue });
  }

  onDonorSuggestionsFetchRequested({ value }) {
    if (value.length < 1) {
      return;
    }

    const { apiKey, donorsSuggestionsUrl, formValues } = this.props;

    const params = {
      value: value,
      api_key: apiKey
    }

    this.setState({ isLoading: true });

    return axios.get(donorsSuggestionsUrl, { params: params })
      .then((response) => {
        const suggestions = response.data;
        const selectedIds = formValues.map(formValue => formValue.otherDonorId);
        const filteredSuggestions = suggestions.filter(suggestion => {
          return selectedIds.indexOf(suggestion.id) === -1;
        })
        this.setState({ donorSuggestions: filteredSuggestions });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      })
  }

  onDonorSuggestionsClearRequested() {
    this.setState({
      donorSuggestions: []
    });
  }

  onDonorSuggestionSelected(event, { suggestionValue }) {
    const { id, onChange } = this.props;
    const fullName = `${suggestionValue.first_name} ${suggestionValue.last_name}`;

    const values = [
      { name: 'otherDonorId', value: suggestionValue.id },
      { name: 'fullName', value: fullName }
    ]

    onChange(id, values);
  }

  getDonorSuggestionValue(suggestion) {
    return suggestion;
  }

  renderDonorSuggestion(suggestion, { query, isHighlighted }) {
    let itemClassName;
    if (isHighlighted) {
      itemClassName = 'is-highlighted';
    }

    return (
      <div data-relationship-suggestion={suggestion.id} className={`autosuggest-item ${itemClassName}`}>
        <div data-relationship-suggestion-name className="autosuggest-item__name">
          {suggestion.first_name} {suggestion.last_name}
        </div>
        <div data-relationship-suggestion-email className="autosuggest-item__email">
          {suggestion.email}
        </div>
      </div>
    )
  }

  render() {
    let donorInput, removeButton, addButton;

    const { donorSuggestions, isLoading } = this.state;
    const { label, fullName, isLast, otherDonorId } = this.props;
    const attrs = { 'data-donor-relationship-modal': 'true' }
    const relationshipUrl = `/nonprofit_users/donors/${otherDonorId}`;

    const relationshipInputProps = {
      value: this.state.autoSuggestValue,
      onChange: this.onAutoSuggestChange,
      'data-relationship-input': 'true',
    }

    if (fullName) {
      donorInput = (
        <div className="donor-relationship__name" data-relationship-full-name>
          <a href={relationshipUrl} target="_blank">{fullName}</a>
        </div>
      )
    } else {
      donorInput = (
        <Autosuggest
          suggestions={donorSuggestions}
          onSuggestionsFetchRequested={this.onDonorSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onDonorSuggestionsClearRequested}
          onSuggestionSelected={this.onDonorSuggestionSelected}
          getSuggestionValue={this.getDonorSuggestionValue}
          renderSuggestion={this.renderDonorSuggestion}
          inputProps={relationshipInputProps}
        />
      )
    }

    const remove = (
      <button
        type="button"
        className="btn-action-icon btn-delete-icon"
        data-donor-relationship-remove="true"
        onClick={this.clickRemove}>
      </button>
    )

    let add, hint;
    if (isLast) {
      add = (
        <button
          type="button"
          className="btn-action-icon btn-add-icon"
          data-donor-relationship-add="true"
          onClick={this.clickAdd}>
        </button>
      )

      hint = <div className="donor-relationship__caption caption">Ex. Spouse, Sibling, Co-worker</div>
    }

    let loading;
    if (isLoading) {
      loading = <div className="donor-relationship__loading caption">Loading...</div>
    }

    return (
      <div className="custom-fields__item" data-relationship-form-item>
        <div className="modal-fieldset">
          <div className="custom-fields__input form-item">
            {loading}
            {donorInput}
          </div>

          <div className="custom-fields__input form-item">
            <input
              type="text"
              name="label"
              id="relationship-label"
              data-relationship-label-input="true"
              defaultValue={label}
              onChange={this.onChange}
            />
            {hint}
          </div>
        </div>

        <div className="custom-fields__actions">
          {remove}
          {add}
        </div>
      </div>
    )
  }
}

export default DonorProfileRelationshipFormItem;
