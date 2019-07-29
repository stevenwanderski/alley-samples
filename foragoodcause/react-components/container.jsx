import React from "react";
import axios from "axios";
import DonorProfilePlaceholder from './placeholder';
import DonorProfileContactInfo from './contact-info';
import DonorProfileAvatar from './avatar';
import DonorProfileGenderAge from './gender-age';
import DonorProfileCityState from './city-state';
import DonorProfileSocialLinks from './social-links';
import DonorProfileStats from './stats';
import DonorProfilePersonalInfo from './personal-info';
import DonorProfileRelationships from './relationships';
import DonorProfileTransactionList from './transaction-list';
import DonorProfileNoteList from './note-list';
import DonorProfileTags from './tags';
import DonorProfileCustomFields from './custom-fields';
import { ToastContainer, toast, Slide } from 'react-toastify';
import swalError from '../../utils/swal-error';

import 'react-toastify/dist/ReactToastify.css';

class DonorProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      donor: {},
      totals: {},
      fullContact: {},
      donorLoaded: false,
      isLoading: true
    }

    this.fetchDonor = this.fetchDonor.bind(this);
    this.refreshDonor = this.refreshDonor.bind(this);
    this.deleteDonor = this.deleteDonor.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({ isLoading: true });

    const { donor, apiKey } = this.props;
    const { id, email } = donor;

    const donorFetcher = this.fetchDonor();
    const fullContactFetcher = this.fetchFullContact(email);
    const totalsFetcher = this.fetchTotals(id, apiKey);

    axios.all([donorFetcher, fullContactFetcher, totalsFetcher])
      .then(() => {
        this.setState({ isLoading: false, donorLoaded: true });
      })
      .catch((errors) => {
        swalError(errors);
      })
  }

  fetchDonor() {
    const { apiKey, donorUrl } = this.props;

    const params = {
      api_key: apiKey
    }

    return axios.get(donorUrl, { params })
      .then((response) => {
        this.setState({ donor: response.data });
      })
  }

  fetchFullContact(email) {
    const { fullContactUrl, apiKey } = this.props;
    const params = {
      api_key: apiKey,
      email: email
    }

    return axios.get(fullContactUrl, { params })
      .then((response) => {
        this.setState({ fullContact: response.data });
      })
      .catch((error) => {
        return error.response;
      });
  }

  fetchTotals(id, apiKey) {
    const url = `/api/nonprofits/donor_transactions/${id}/totals`
    const params = {
      api_key: apiKey
    }

    return axios.get(url, { params })
      .then((response) => {
        this.setState({ totals: response.data });
      })
  }

  refreshDonor() {
    return this.fetchDonor();
  }

  deleteDonor() {
    const { donorDeleteUrl } = this.props;

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ['Cancel', 'Delete'],
      dangerMode: true
    }).then((confirmed) => {
      if (!confirmed) { return false; }

      window.location.href = donorDeleteUrl;
    });
  }

  renderLoading() {
    if (this.state.isLoading) {
      return <div className="loading-bar"></div>
    }

    return null;
  }

  renderOverview() {
    const { apiKey, donorEditUrl, donationAddUrl, transactionsPerPage, notesPerPage, notesUrl, notesAddUrl } = this.props;
    const { donor, fullContact, totals, donorLoaded } = this.state;
    const { gender, ageRange, avatar, facebook, twitter, linkedin, website } = fullContact;

    if (!donorLoaded) {
      return (
        <div className="block">
          <DonorProfilePlaceholder
            includeAvatar={true}
            lineCount={3} />
        </div>
      )
    }

    return (
      <div className="block">
        <div className="donor-header flex-grid mb--30">
          <div className="donor-overview col-1-2" data-donor-overview-block>

            <DonorProfileAvatar
              avatar={avatar}
              firstName={donor.first_name}
              lastName={donor.last_name} />

            <div className="donor-info">
              <h2 className="donor-info__name title__h4">{donor.first_name} {donor.last_name}</h2>

              <DonorProfileGenderAge
                gender={gender}
                age={ageRange} />

              <DonorProfileCityState
                city={donor.city}
                state={donor.state} />
            </div>
          </div>

          <DonorProfileSocialLinks
            facebook={facebook}
            twitter={twitter}
            linkedin={linkedin}
            website={website} />
        </div>

        <DonorProfileStats
          yearToDateInCents={totals.year_to_date_in_cents}
          totalInCents={totals.total_in_cents}
          averageInCents={totals.average_in_cents} />
      </div>
    )
  }

  renderContactInfo() {
    const { apiKey, donorUpdateUrl, canEditDonor, countries, states, provinces } = this.props;
    const { donorLoaded, donor } = this.state;

    return (
      <DonorProfileContactInfo
        apiKey={apiKey}
        donor={donor}
        donorLoaded={donorLoaded}
        donorUpdateUrl={donorUpdateUrl}
        canEditDonor={canEditDonor}
        onUpdate={this.refreshDonor}
        countries={countries}
        states={states}
        provinces={provinces} />
    )
  }

  renderPersonalInfo() {
    const { apiKey, donorUpdateUrl, canEditDonor, donorsSuggestionsUrl } = this.props;
    const { donorLoaded, donor } = this.state;

    return (
      <DonorProfilePersonalInfo
        apiKey={apiKey}
        donor={donor}
        donorLoaded={donorLoaded}
        donorUpdateUrl={donorUpdateUrl}
        canEditDonor={canEditDonor}
        onUpdate={this.refreshDonor} />
    )
  }

  renderRelationsihps() {
    const { apiKey, donorUpdateUrl, canEditDonor, donorsSuggestionsUrl, donorRelationshipsCreateBulkUrl } = this.props;
    const { donorLoaded, donor } = this.state;

    return (
      <DonorProfileRelationships
        relationships={donor.donor_relationships}
        apiKey={apiKey}
        donor={donor}
        donorLoaded={donorLoaded}
        canEditDonor={canEditDonor}
        onUpdate={this.refreshDonor}
        donorsSuggestionsUrl={donorsSuggestionsUrl}
        donorRelationshipsCreateBulkUrl={donorRelationshipsCreateBulkUrl}
      />
    )
  }

  renderTransactions() {
    const { donor, apiKey, donationAddUrl, transactionsPerPage, canAddDonation } = this.props;

    return (
      <DonorProfileTransactionList
        donorId={donor.id}
        apiKey={apiKey}
        donationAddUrl={donationAddUrl}
        transactionsPerPage={transactionsPerPage}
        canAddDonation={canAddDonation} />
    )
  }

  renderNotes() {
    const { donor, apiKey, notesPerPage, notesUrl, notesAddUrl, canEditNote, canAddNote } = this.props;

    return (
      <DonorProfileNoteList
        donorId={donor.id}
        apiKey={apiKey}
        notesUrl={notesUrl}
        notesAddUrl={notesAddUrl}
        notesPerPage={notesPerPage}
        canEditNote={canEditNote}
        canAddNote={canAddNote} />
    )
  }

  renderTags() {
    const { donor, apiKey, tagsUrl, tagsSuggestionsUrl, canEditDonor } = this.props;
    const { donorLoaded } = this.state;

    return (
      <DonorProfileTags
        donorId={donor.id}
        apiKey={apiKey}
        tagsUrl={tagsUrl}
        tagsSuggestionsUrl={tagsSuggestionsUrl}
        donorLoaded={donorLoaded}
        canEditDonor={canEditDonor} />
    )
  }

  renderCustomFields() {
    const { apiKey, donorFormFieldsCreateBulkUrl, donorFormFieldsUpdateBulkUrl, canEditDonor } = this.props;
    const { donorLoaded, donor } = this.state;

    return (
      <DonorProfileCustomFields
        apiKey={apiKey}
        donor={donor}
        donorLoaded={donorLoaded}
        donorFormFieldsCreateBulkUrl={donorFormFieldsCreateBulkUrl}
        donorFormFieldsUpdateBulkUrl={donorFormFieldsUpdateBulkUrl}
        canEditDonor={canEditDonor}
        onUpdate={this.refreshDonor} />
    )
  }

  renderHeader() {
    const { donorsUrl, donationAddUrl, canEditDonor } = this.props;
    const { donorLoaded, donor } = this.state;
    const backUrlCookie = Cookies.get('fagc_donors_search_href');
    const backUrl = backUrlCookie ? backUrlCookie : donorsUrl;

    let addDonationButton;
    if (canEditDonor) {
      addDonationButton = (
        <div className="content-header--btns">
          <a
            href={donationAddUrl}
            className="btn btn__lt-green btn__small"
            data-test-add-donation-header="true">
            Add Donation
          </a>
        </div>
      )
    }

    return (
      <div className="content-header" data-donor-header>
        <a href={backUrl} className="back-link">
          <svg className="icon-arrow-left">
            <use xlinkHref="#icon-arrow-left"></use>
          </svg>
          <span className="label--small">Donors</span>
        </a>
        <h1 className="page-title" data-donor-name>{donor.first_name} {donor.last_name}</h1>

        {addDonationButton}
      </div>
    )
  }

  renderDeleteButton() {
    const { canEditDonor } = this.props;

    if (!canEditDonor) {
      return '';
    }

    const deleteButton = (
      <button
        onClick={this.deleteDonor}
        type="button"
        className="btn btn--destructive btn__small"
        data-delete-donor="true">
        Delete Contact
      </button>
    );

    return deleteButton;
  }

  render() {
    const { donorLoaded } = this.state;

    const loading = this.renderLoading();
    const overview = this.renderOverview();
    const contactInfo = this.renderContactInfo();
    const personalInfo = this.renderPersonalInfo();
    const relationships = this.renderRelationsihps();
    const transactions = this.renderTransactions();
    const notes = this.renderNotes();
    const tags = this.renderTags();
    const customFields = this.renderCustomFields();
    const header = this.renderHeader();
    const deleteButton = this.renderDeleteButton();

    return (
      <div data-donor-loaded={donorLoaded}>
        {header}

        <div className="flex-grid">
          {loading}

          <div className="col-2-3">
            {overview}
            {transactions}
            {notes}
          </div>

          <div className="col-1-3">
            {tags}
            {contactInfo}
            {personalInfo}
            {relationships}
            {customFields}
          </div>

          <ToastContainer
            className="toast-container"
            toastClassName="dark-toast"
            position={toast.POSITION.BOTTOM_CENTER}
            transition={Slide}
            hideProgressBar={true}
            autoClose={2000} />
        </div>

        <div className="donor-delete">
          {deleteButton}
        </div>
      </div>
    )
  }
}

export default DonorProfileContainer;
