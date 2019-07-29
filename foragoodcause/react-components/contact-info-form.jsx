import React from 'react';
import swal from 'sweetalert';
import swalError from '../../utils/swal-error';
import Modal from '../modal';
import HiddenButton from '../hidden-button';

class DonorProfileContactInfoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisabled: false,
      isLoading: false,
      formValues: {
        firstName: this.props.donor.first_name,
        lastName: this.props.donor.last_name,
        address1: this.props.donor.address_1,
        address2: this.props.donor.address_2,
        city: this.props.donor.city,
        state: this.props.donor.state,
        postal: this.props.donor.postal,
        country: this.props.donor.country,
        newsletterEnabled: this.props.donor.newsletter_enabled,
        email: this.props.donor.email,
        emailType: this.props.donor.email_type,
        alternateEmail: this.props.donor.alternate_email,
        alternateEmailType: this.props.donor.alternate_email_type,
        phone: this.props.donor.phone,
        phoneType: this.props.donor.phone_type,
        alternatePhone: this.props.donor.alternate_phone,
        alternatePhoneType: this.props.donor.alternate_phone_type
      }
    }

    this.update = this.update.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  update() {
    const { formValues } = this.state;
    const { onUpdate } = this.props;

    this.setState({ isLoading: true, isDisabled: true });

    onUpdate(formValues)
      .catch((errors) => {
        if (errors.response.status === 422 && errors.response.data.errors.email[0] === 'has already been taken') {
          swal({
            title: 'That email has been taken.',
            icon: 'error'
          });
        } else {
          swalError(errors);
        }
        this.setState({ isLoading: false, isDisabled: false });
      });
  }

  submit(event) {
    event.preventDefault();
    this.update();
  }

  onChange(event) {
    const formValues = this.state.formValues;
    const target = event.target;
    const { name, type, checked, value } = target;
    formValues[name] = type === 'checkbox' ? checked : value;

    if (name === 'country') {
      formValues['state'] = '';
    }

    this.setState({ formValues: formValues });
    this.validate();
  }

  validate() {
    const { firstName, email, alternateEmail } = this.state.formValues;
    const emailRegex = /\S+@\S+\.\S+/;

    const isInvalid = (firstName === '') ||
      (email && !emailRegex.test(email)) ||
      (alternateEmail && !emailRegex.test(alternateEmail))

    this.setState({ isDisabled: isInvalid });
  }

  countryOptions() {
    const { countries } = this.props;

    return Object.keys(countries).map((label, index) => {
      const value = countries[label];
      return <option value={value} key={index}>{label}</option>
    });
  }

  stateOptions() {
    const { states } = this.props;

    const options = Object.keys(states).map((label, index) => {
      const value = states[label];
      return <option value={value} key={index + 1}>{label}</option>
    });

    options.unshift(<option value="" key="0">State</option>);

    return options;
  }

  provinceOptions() {
    const { provinces } = this.props;

    const options = Object.keys(provinces).map((label, index) => {
      const value = provinces[label];
      return <option value={value} key={index + 1}>{label}</option>
    });

    options.unshift(<option value="" key="0">Province</option>);

    return options;
  }

  renderStateSelect() {
    const stateOptions = this.stateOptions();
    const { formValues } = this.state;

    return (
      <div className="form-item form-item--select" data-state-select-field>
        <label htmlFor="state">State</label>
        <div className="form-item--select__container">
          <select
            name="state"
            value={formValues.state}
            onChange={this.onChange}>
              {stateOptions}
          </select>
        </div>
      </div>
    )
  }

  renderProvinceSelect() {
    const provinceOptions = this.provinceOptions();
    const { formValues } = this.state;

    return (
      <div className="form-item form-item--select" data-province-select-field>
        <label htmlFor="state">Province</label>
        <div className="form-item--select__container">
          <select
            name="state"
            value={formValues.state}
            onChange={this.onChange}>
              {provinceOptions}
          </select>
        </div>
      </div>
    )
  }

  renderProvinceTextField() {
    const { formValues } = this.state;

    return (
      <div className="form-item" data-province-text-field>
        <label htmlFor="state">Province</label>
        <input
          type="text"
          name="state"
          value={formValues.state}
          onChange={this.onChange} />
      </div>
    )
  }

  renderStateOrProvince() {
    const { formValues } = this.state;
    const { country } = formValues;
    let output;

    if (country === 'US' || !country) {
      return this.renderStateSelect();
    } else if (country === 'CA') {
      return this.renderProvinceSelect();
    } else {
      return this.renderProvinceTextField();
    }

    return output;
  }

  render() {
    const { formValues, isDisabled, isLoading } = this.state;
    const { onCancel } = this.props;
    const attrs = { 'data-donor-contact-info-modal': 'true' }
    const countryOptions = this.countryOptions();
    const stateOrProvince = this.renderStateOrProvince();

    return (
      <Modal
        onCancel={onCancel}
        onUpdate={this.update}
        title="Edit Contact Info"
        isDisabled={isDisabled}
        isLoading={isLoading}
        attrs={attrs}
      >
        <form onSubmit={this.submit}>

          <div className="modal-fieldset">
            <div className="form-item">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                defaultValue={formValues.firstName}
                onChange={this.onChange} />
            </div>

            <div className="form-item">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                defaultValue={formValues.lastName}
                onChange={this.onChange} />
            </div>

            <div className="form-item">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                defaultValue={formValues.email}
                onChange={this.onChange} />
            </div>

            <div className="form-item form-item--select">
              <label htmlFor="emailType">Email Type</label>
              <div className="form-item--select__container">
                <select
                  name="emailType"
                  defaultValue={formValues.emailType}
                  onChange={this.onChange}>
                    <option value="">Select Type</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                </select>
              </div>
            </div>

            <div className="form-item">
              <label htmlFor="alternateEmail" className="is-offscreen">Alternate Email</label>
              <input
                type="text"
                name="alternateEmail"
                defaultValue={formValues.alternateEmail}
                onChange={this.onChange} />
            </div>

            <div className="form-item form-item--select">
              <label htmlFor="alternateEmailType" className="is-offscreen">Alternate Email Type</label>
              <div className="form-item--select__container">
                <select
                  name="alternateEmailType"
                  defaultValue={formValues.alternateEmailType}
                  onChange={this.onChange}>
                    <option value="">Select Type</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                </select>
              </div>
            </div>

            <div className="form-item">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                defaultValue={formValues.phone}
                onChange={this.onChange} />
            </div>

            <div className="form-item form-item--select">
              <label htmlFor="phoneType">Phone Type</label>
              <div className="form-item--select__container">
                <select
                  name="phoneType"
                  defaultValue={formValues.phoneType}
                  onChange={this.onChange}>
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Cell">Cell</option>
                </select>
              </div>
            </div>

            <div className="form-item">
              <label htmlFor="alternatePhone" className="is-offscreen">Alternate Phone</label>
              <input
                type="text"
                name="alternatePhone"
                defaultValue={formValues.alternatePhone}
                onChange={this.onChange} />
            </div>

            <div className="form-item form-item--select">
              <label htmlFor="alternatePhoneType" className="is-offscreen">Alternate Phone Type</label>
              <div className="form-item--select__container">
                <select
                  name="alternatePhoneType"
                  defaultValue={formValues.alternatePhoneType}
                  onChange={this.onChange}>
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Cell">Cell</option>
                </select>
              </div>
            </div>

            <div className="form-item">
              <label htmlFor="address1">Address 1</label>
              <input
                type="text"
                name="address1"
                defaultValue={formValues.address1}
                onChange={this.onChange} />
            </div>

            <div className="form-item">
              <label htmlFor="address2">Address 2</label>
              <input
                type="text"
                name="address2"
                defaultValue={formValues.address2}
                onChange={this.onChange} />
            </div>

            <div className="form-item">
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                defaultValue={formValues.city}
                onChange={this.onChange} />
            </div>

            <div className="form-item">
              <label htmlFor="postal">Zip / Postal Code</label>
              <input
                type="text"
                name="postal"
                defaultValue={formValues.postal}
                onChange={this.onChange} />
            </div>

            <div className="form-item form-item--select">
              <label htmlFor="country">Country</label>
              <div className="form-item--select__container">
                <select
                  name="country"
                  defaultValue={formValues.country}
                  onChange={this.onChange}>
                    {countryOptions}
                </select>
              </div>
            </div>

            {stateOrProvince}
          </div>

          <div className="form-item form-item--checkbox">
            <label className="form-item--checkbox__container" htmlFor="newsletterEnabled">
              <input
                type="checkbox"
                name="newsletterEnabled"
                id="newsletterEnabled"
                checked={formValues.newsletterEnabled}
                onChange={this.onChange} />
              <span className="form-item--checkbox__label">Newsletter Subscriber</span>
            </label>
          </div>

          <HiddenButton />
        </form>
      </Modal>
    )
  }
}

export default DonorProfileContactInfoForm;
