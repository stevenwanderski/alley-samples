import React from 'react';
import axios from 'axios';
import uuid from 'uuid/v4';
import Modal from '../modal';
import HiddenButton from '../hidden-button';
import swalError from '../../utils/swal-error';
import DonorProfileRelationshipFormItem from './relationship-form-item';

class DonorProfileRelationshipsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisabled: false,
      isLoading: false,
      formValues: this.initializeRelationships()
    }

    this.update = this.update.bind(this);
    this.submit = this.submit.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.changeItem = this.changeItem.bind(this);
  }

  initializeRelationships() {
    const { relationships } = this.props;

    if (relationships.length) {
      return relationships.map(relationship => {
        return {
          id: relationship.id,
          fullName: relationship.full_name,
          otherDonorId: relationship.other_donor_id,
          label: relationship.label
        }
      });
    }

    return [{
      id: uuid(),
      fullName: '',
      otherDonorId: '',
      label: ''
    }]
  }

  update() {
    const { formValues } = this.state;
    const { onUpdate } = this.props;

    this.setState({ isLoading: true, isDisabled: true });

    onUpdate(formValues)
      .catch((errors) => {
        swalError(errors);
        this.setState({ isLoading: false, isDisabled: false });
      });
  }

  submit(event) {
    event.preventDefault();
    this.update();
  }

  addItem() {
    this.setState(state => {
      const formValue = {
        id: uuid(),
        otherDonorId: '',
        fullName: '',
        label: ''
      }

      const formValues = state.formValues.concat(formValue);

      return { formValues };
    });
  }

  removeItem(id) {
    this.setState(state => {
      let formValues;

      if (state.formValues.length === 1) {
        formValues = [{
          id: uuid(),
          otherDonorId: '',
          fullName: '',
          label: ''
        }]
      } else {
        formValues = state.formValues.filter(formValue => formValue['id'] !== id);
      }

      return { formValues };
    });
  }

  changeItem(id, values) {
    this.setState(state => {
      const formValues = state.formValues.map(formValue => {
        if (formValue['id'] === id) {
          values.forEach(valueObj => {
            const name = valueObj['name'];
            const value = valueObj['value'];
            formValue[name] = value;
          });
        }

        return formValue;
      });

      return { formValues };
    });
  }

  render() {
    const { formValues, isDisabled, isLoading } = this.state;
    const { onCancel, donorsSuggestionsUrl, apiKey, relationships } = this.props;
    const attrs = { 'data-donor-relationship-modal': 'true' }

    const items = formValues.map((formValue, index) => {
      const isLast = formValues.length === index + 1;

      return (
        <DonorProfileRelationshipFormItem
          key={formValue.id}
          id={formValue.id}
          index={index}
          fullName={formValue.fullName}
          label={formValue.label}
          otherDonorId={formValue.otherDonorId}
          onClickAdd={this.addItem}
          onClickRemove={this.removeItem}
          onChange={this.changeItem}
          donorsSuggestionsUrl={donorsSuggestionsUrl}
          apiKey={apiKey}
          isLast={isLast}
          formValues={formValues}
        />
      )
    });

    return (
      <Modal
        onCancel={onCancel}
        onUpdate={this.update}
        title="Relationships"
        isDisabled={isDisabled}
        isLoading={isLoading}
        attrs={attrs}
      >
        <p>Add a relationship with another contact and label the relationship, which will display on both contact profiles.</p>

        <form onSubmit={this.submit} className="donor-relationship__form">
          <div className="donor-relationship__labels">
            <label>Contact</label>
            <label>Label</label>
          </div>

          {items}

          <HiddenButton />
        </form>
      </Modal>
    )
  }
}

export default DonorProfileRelationshipsForm;
