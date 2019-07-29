import React from 'react';
import Modal from '../modal';
import HiddenButton from '../hidden-button';
import swalError from '../../utils/swal-error';

class DonorProfileCustomFieldsForm extends React.Component {
  constructor(props) {
    super(props);

    const { donor } = this.props;

    this.state = {
      isDisabled: false,
      isLoading: false,
      formValues: {},
      newFields: [
        { label: '', value: '', id: Date.now() }
      ]
    }

    donor.donor_form_fields.forEach(field => {
      const response = donor.form_field_responses.find(response => {
        return response.form_field_id === field.id;
      });

      const value = response ? response.response : '';

      this.state['formValues'][field.id] = value;
    });

    this.update = this.update.bind(this);
    this.submit = this.submit.bind(this);
    this.onChangeExistingField = this.onChangeExistingField.bind(this);
    this.onChangeNewField = this.onChangeNewField.bind(this);
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
  }

  componentDidMount() {
    this.validate();
  }

  newFieldsWithValues() {
    const { newFields } = this.state;

    return newFields.filter(field => {
      return field['label'] !== '' && field['value'] !== '';
    });
  }

  update() {
    const { onUpdate } = this.props;
    const { newFields, formValues } = this.state;
    const values = { existingFields: formValues }

    values['newFields'] = this.newFieldsWithValues();

    this.setState({ isLoading: true, isDisabled: true });

    onUpdate(values)
      .catch((errors) => {
        swalError(errors);
        this.setState({ isLoading: false, isDisabled: false });
      });

  }

  submit(event) {
    event.preventDefault();
    this.update();
  }

  addField() {
    const { newFields } = this.state;
    const newField = { label: '', value: '', id: Date.now() }

    newFields.push(newField);

    this.setState({ newFields: newFields });
    this.validate();
  }

  removeField(id) {
    const { newFields } = this.state;

    if (newFields.length === 1) {
      newFields[0]['label'] = '';
      newFields[0]['value'] = '';
      this.setState({ newFields: newFields });
      this.validate(newFields);
    } else {
      const result = newFields.filter(field => field.id != id);
      this.setState({ newFields: result });
      this.validate(result);
    }
  }

  onChangeNewField(id, fieldType, event) {
    const { newFields } = this.state;
    const target = event.target;
    const { value } = target;

    const field = newFields.find(field => field.id === id);
    field[fieldType] = value;

    this.setState({ newFields: newFields });
    this.validate();
  }

  onChangeExistingField(event) {
    const { formValues } = this.state;
    const target = event.target;
    const { name, type, value } = target;

    formValues[name] = value;

    this.setState({ formValues: formValues });
    this.validate();
  }

  validate(newFields = this.state.newFields) {
    let isInvalid = false;

    for (var i = 0; i < newFields.length; i++) {
      const field = newFields[i];
      const onlyLabelPresent = (field.label !== '' && field.value === '');
      const onlyValuePresent = (field.label === '' && field.value !== '');

      if (onlyLabelPresent || onlyValuePresent) {
        isInvalid = true;
        break;
      }
    }

    this.setState({ isDisabled: isInvalid });
  }

  render() {
    const { formValues, isDisabled, isLoading, newFields } = this.state;
    const { onCancel, donor, apiKey } = this.props;
    const attrs = { 'data-donor-custom-fields-modal': 'true' }

    const existingFields = donor.donor_form_fields.map((field, index) => {
      const formFieldResponse = donor.form_field_responses.find(response => {
        return response.form_field_id === field.id;
      });

      const value = formFieldResponse ? formFieldResponse.response : '';

      return (
        <div className="form-item" key={field.id}>
          <label>{field.label}</label>
          <input
            type="text"
            name={field.id}
            onChange={this.onChangeExistingField}
            defaultValue={value}
          />
        </div>
      );
    });

    const fields = newFields.map((field, index) => {
      const isLast = newFields.length === index +1;

      const remove = (
        <button
          type="button"
          className="btn-action-icon btn-delete-icon"
          onClick={this.removeField.bind(this, field.id)}
          data-custom-field-remove>
        </button>
      )

      let add;
      if (isLast) {
        add = (
          <button
            type="button"
            className="btn-action-icon btn-add-icon"
            onClick={this.addField}
            data-custom-field-add>
          </button>
        )
      }

      return (
        <div className="custom-fields__item" key={field.id} data-new-custom-field={field.id}>
          <div className="modal-fieldset">
            <div className="custom-fields__input form-item">
              <input
                type="text"
                onChange={this.onChangeNewField.bind(this, field.id, 'label')}
                value={field.label}
                data-new-custom-field-label={field.id}
                placeholder="Label"
              />
            </div>
            <div className="custom-fields__input form-item">
              <input
                type="text"
                onChange={this.onChangeNewField.bind(this, field.id, 'value')}
                value={field.value}
                data-new-custom-field-value={field.id}
                placeholder="Info"
              />
            </div>
          </div>
          <div className="custom-fields__actions">
            {remove}
            {add}
          </div>
        </div>
      )
    });

    return (
      <Modal
        onCancel={onCancel}
        onUpdate={this.update}
        title="More Info"
        attrs={attrs}
        isDisabled={isDisabled}
        isLoading={isLoading}
      >
        <form onSubmit={this.submit}>
          <div className="custom-fields-list mb--24">
            {existingFields}
          </div>

          <div className="add-custom-fields">
            <h3 className="title__h5 mb--12">Add Custom Fields</h3>
            {fields}
          </div>

          <HiddenButton />
        </form>
      </Modal>
    )
  }
}

export default DonorProfileCustomFieldsForm;
