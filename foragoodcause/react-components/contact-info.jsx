import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import DonorProfilePlaceholder from './placeholder';
import DonorProfileContactInfoForm from './contact-info-form';

class DonorProfileContactInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingForm: false
    }

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.save = this.save.bind(this);
  }

  showForm() {
    this.setState({ isShowingForm: true });
  }

  hideForm() {
    this.setState({ isShowingForm: false });
  }

  save(donorValues) {
    const { apiKey, donorUpdateUrl, onUpdate } = this.props;
    const { firstName, lastName, address1, address2, city, state, postal, country, newsletterEnabled, email, emailType, alternateEmail, alternateEmailType, phone, phoneType, alternatePhone, alternatePhoneType } = donorValues;

    const donorParams = {
      first_name: firstName,
      last_name: lastName,
      address_1: address1,
      address_2: address2,
      city: city,
      state: state,
      postal: postal,
      country: country,
      newsletter_enabled: newsletterEnabled,
      email: email,
      email_type: emailType,
      alternate_email: alternateEmail,
      alternate_email_type: alternateEmailType,
      phone: phone,
      phone_type: phoneType,
      alternate_phone: alternatePhone,
      alternate_phone_type: alternatePhoneType
    }

    const params = {
      donor: donorParams,
      api_key: apiKey
    };

    return axios.put(donorUpdateUrl, params)
      .then((response) => {
        return onUpdate();
      })
      .then(() => {
        this.hideForm();
        toast('Success!');
      });
  }

  renderBody() {
    const { donor } = this.props;
    let phone, phoneType, alternatePhone, alternatePhoneType, email, emailType, alternateEmail, alternateEmailType, newsletter, address1, address2, cityStatePostal, country;

    if (donor.email) {
      if (donor.email_type) {
        emailType = <span className="caption">{donor.email_type}</span>
      }

      email = (
        <p className="donor-contact__email">
          <a href={`mailto:${donor.email}`}>{donor.email}</a> {emailType}
        </p>
      )
    }

    if (donor.alternate_email) {
      if (donor.alternate_email_type) {
        alternateEmailType = <span className="caption">{donor.alternate_email_type}</span>
      }

      alternateEmail = (
        <p className="donor-contact__email">
          <a href={`mailto:${donor.alternate_email}`}>{donor.alternate_email}</a> {alternateEmailType}
        </p>
      )
    }

    if (donor.phone) {
      if (donor.phone_type) {
        phoneType = <span className="caption">{donor.phone_type}</span>
      }

      phone = <p className="donor-contact__phone">{donor.phone} {phoneType}</p>
    }

    if (donor.alternate_phone) {
      if (donor.alternate_phone_type) {
        alternatePhoneType = <span className="caption">{donor.alternate_phone_type}</span>
      }

      alternatePhone = <p className="donor-contact__phone">{donor.alternate_phone} {alternatePhoneType}</p>
    }

    if (donor.newsletter_enabled) {
      newsletter = <p className="donor-contact__newsletter">Newsletter Subscriber</p>
    }

    if (donor.address_1) {
      address1 = <p className="donor-address__address-1">{donor.address_1}</p>
    }

    if (donor.address_2) {
      address2 = <p className="donor-address__address-2">{donor.address_2}</p>
    }

    if (donor.city || donor.state || donor.postal) {
      const cityState = [donor.city, donor.state].filter(Boolean).join(', ');
      cityStatePostal = <p className="donor-address__city-state-zip">{cityState} {donor.postal}</p>
    }

    if (donor.country) {
      country = <p className="donor-address__country">{donor.country}</p>
    }

    return (
      <div className="block-body">
        <div className="donor-email donor-block-section">
          {email}
          {alternateEmail}
          {newsletter}
        </div>

        <div className="donor-phone donor-block-section">
          {phone}
          {alternatePhone}
        </div>

        <div className="donor-address donor-block-section">
          <h3 className="label--small">Address</h3>
          {address1}
          {address2}
          {cityStatePostal}
          {country}
        </div>
      </div>
    )
  }

  renderForm() {
    if (!this.state.isShowingForm) {
      return null;
    }

    const { donor, countries, states, provinces } = this.props;

    return (
      <DonorProfileContactInfoForm
        donor={donor}
        onCancel={this.hideForm}
        onUpdate={this.save}
        countries={countries}
        states={states}
        provinces={provinces} />
    )
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
        <button onClick={this.showForm} className="block-header__btn" data-test-edit-contact-info>
          <span className="label--small">Edit</span>
        </button>
      )
    }

    const form = this.renderForm();

    return (
      <div className="donor-contact-info block" data-donor-contact-info-block>
        <div className="block-header">
          <h2 className="title__h4">Contact Info</h2>
          {edit}
        </div>
        {body}
        {form}
      </div>
    )
  }
}

export default DonorProfileContactInfo;
