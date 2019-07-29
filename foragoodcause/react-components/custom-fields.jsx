import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DonorProfilePlaceholder from './placeholder';
import DonorProfileCustomFieldsForm from './custom-fields-form';

class DonorProfileCustomFields extends React.Component {
  constructor(props) {
    super(props);

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      isShowingForm: false
    }
  }

  save({ newFields, existingFields }) {
    const { onUpdate } = this.props;

    return axios.all([
      this.saveNewFields(newFields),
      this.saveExistingFields(existingFields)
    ])
    .then(() => {
      return onUpdate();
    })
    .then(() => {
      this.hideForm();
      toast('Success!');
    });
  }

  saveNewFields(values) {
    if (!values.length) { return; }

    const { apiKey, donorFormFieldsCreateBulkUrl, donor } = this.props;

    const params = {
      donor_form_fields: values,
      api_key: apiKey,
      donor_id: donor.id
    };

    return axios.post(donorFormFieldsCreateBulkUrl, params);
  }

  saveExistingFields(values) {
    if (!values) { return; }

    const { apiKey, donorFormFieldsUpdateBulkUrl, donor } = this.props;

    const params = {
      donor_form_fields: values,
      api_key: apiKey,
      donor_id: donor.id
    };

    return axios.put(donorFormFieldsUpdateBulkUrl, params);
  }

  showForm() {
    this.setState({ isShowingForm: true });
  }

  hideForm() {
    this.setState({ isShowingForm: false });
  }

  renderForm() {
    const { donor, donorsSuggestionsUrl, apiKey } = this.props;

    if (this.state.isShowingForm) {
      return (
        <DonorProfileCustomFieldsForm
          donor={donor}
          apiKey={apiKey}
          onCancel={this.hideForm}
          onUpdate={this.save} />
      )
    }
  }

  renderBody() {
    const { donor, canEditDonor } = this.props;

    return donor.form_field_responses.map(response => {
      if (!response.response) {
        return null;
      }

      return (
        <div className="donor-block-section" key={response.id} data-custom-field-item={response.id}>
          <h3 className="label--small">{response.label}</h3>
          <p>{response.response}</p>
        </div>
      )
    });
  }

  render() {
    const { donorLoaded, donorEditUrl, canEditDonor } = this.props;
    let body, edit;

    if (!donorLoaded) {
      body = <DonorProfilePlaceholder />;
    } else {
      body = this.renderBody();
    }

    if (canEditDonor) {
      edit = (
        <button onClick={this.showForm} className="block-header__btn" data-test-edit-custom-fields>
          <span className="label--small">Edit</span>
        </button>
      )
    }

    const form = this.renderForm();

    return (
      <div className="donor-custom-fields block" data-donor-custom-fields-block>
        <div className="block-header">
          <h2 className="title__h4">More Info</h2>
          {edit}
        </div>
        {body}
        {form}
      </div>
    )
  }
}

export default DonorProfileCustomFields;
