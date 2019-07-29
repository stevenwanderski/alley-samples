import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import DonorProfilePlaceholder from './placeholder';
import DonorProfilePersonalInfoForm from './personal-info-form';

class DonorProfilePersonalInfo extends React.Component {
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
    const { jobTitle, company, birthdateYear, birthdateMonth, birthdateDay } = donorValues;

    const donorParams = {
      job_title: jobTitle,
      company: company,
      birthdate_year: birthdateYear,
      birthdate_month: birthdateMonth,
      birthdate_day: birthdateDay
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

  renderJobTitleCompany() {
    const { donor } = this.props;
    let jobTitle, company;

    if (donor.job_title) {
      jobTitle = <p>{donor.job_title}</p>
    }

    if (donor.company) {
      company = <p>{donor.company}</p>
    }

    if (!jobTitle && !company) {
      return null;
    }

    return (
      <div className="donor-personal donor-block-section">
        <h3 className="label--small">Job Title & Employer</h3>
        {jobTitle}
        {company}
      </div>
    )
  }

  renderBirthdate() {
    const { donor } = this.props;
    const birthdateYear = donor.birthdate_year;
    const birthdateMonth = donor.birthdate_month;
    const birthdateDay = donor.birthdate_day;

    if (!birthdateYear && !birthdateMonth && !birthdateDay) {
      return null;
    }

    let formattedBirthdate;
    if (birthdateYear) {
      const birthdate = [birthdateYear, birthdateMonth, birthdateDay].join('-');
      formattedBirthdate = moment.parseZone(birthdate).format('MMMM D, YYYY');
    } else {
      const birthdate = ['1900', birthdateMonth, birthdateDay].join('-');
      formattedBirthdate = moment.parseZone(birthdate).format('MMMM D');
    }

    return (
      <div className="donor-personal donor-block-section">
        <h3 className="label--small">Birthday</h3>
        <p>{formattedBirthdate}</p>
      </div>
    )
  }

  renderBody() {
    const birthdate = this.renderBirthdate();
    const jobTitleCompany = this.renderJobTitleCompany();

    return (
      <div className="block-body">
        {birthdate}
        {jobTitleCompany}
      </div>
    );
  }

  renderForm() {
    if (!this.state.isShowingForm) {
      return null;
    }

    const { donor, donorsSuggestionsUrl, apiKey } = this.props;

    return (
      <DonorProfilePersonalInfoForm
        donor={donor}
        apiKey={apiKey}
        onCancel={this.hideForm}
        onUpdate={this.save}
        donorsSuggestionsUrl={donorsSuggestionsUrl} />
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
        <button onClick={this.showForm} className="block-header__btn" data-test-edit-personal-info>
          <span className="label--small">Edit</span>
        </button>
      )
    }

    const form = this.renderForm();

    return (
      <div className="donor-personal-info block" data-donor-personal-info-block>
        <div className="block-header">
          <h2 className="title__h4">Personal Info</h2>
          {edit}
        </div>
        {body}
        {form}
      </div>
    )
  }
}

export default DonorProfilePersonalInfo;
