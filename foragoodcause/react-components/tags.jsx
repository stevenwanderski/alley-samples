import React from 'react';
import axios from 'axios';
import DonorProfilePlaceholder from './placeholder';
import DonorProfileTagsForm from './tags-form';
import { toast } from 'react-toastify';

class DonorProfileTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      isLoading: false,
      isDataError: false
    }

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.saveTags = this.saveTags.bind(this);
  }

  componentDidMount() {
    this.fetchTags();
  }

  fetchTags() {
    const { donorId, apiKey, tagsUrl } = this.props;
    const url = tagsUrl;
    const params = {
      api_key: apiKey,
      donor_id: donorId
    }

    return axios.get(url, { params: params })
      .then((response) => {
        const tags = response.data;

        this.setState({
          tags: tags,
          isLoading: false,
          dataFetched: true
        });
      })
      .catch(() => {
        this.setState({
          isDataError: true,
          isLoading: false
        });
      });
  }

  saveTags(tags) {
    const { donorId, apiKey, tagsUrl } = this.props;

    const params = {
      api_key: apiKey,
      donor_id: donorId,
      tags: tags
    }

    return axios.post(tagsUrl, params)
      .then((response) => {
        return this.fetchTags();
      })
      .then(() => {
        this.hideForm();
        toast('Success!');
      });
  }

  showForm(event) {
    event.preventDefault();
    this.setState({ isShowingForm: true });
  }

  hideForm() {
    this.setState({ isShowingForm: false });
  }

  renderTags() {
    const tags = this.state.tags.map((tag) => {
      return (
        <div key={tag.id} className="tag-item">
          {tag.name}
        </div>
      )
    });

    return <div data-tags-collection className="tags-list">{tags}</div>
  }

  renderForm() {
    if (!this.state.isShowingForm) {
      return null;
    }

    const { apiKey, tagsSuggestionsUrl, tagsUrl, donorId } = this.props;
    const tagNames = this.state.tags.map(tag => tag.name);

    return (
      <DonorProfileTagsForm
        apiKey={apiKey}
        donorId={donorId}
        tags={tagNames}
        tagsSuggestionsUrl={tagsSuggestionsUrl}
        onCancel={this.hideForm}
        onUpdate={this.saveTags} />
    )
  }

  renderError() {
    if (this.state.isDataError) {
      return <p className="dashboard__error">This data cannot be shown at this time.</p>;
    }

    return null;
  }

  render() {
    const { donorLoaded, canEditDonor } = this.props;
    let body, edit;

    const tags = this.renderTags();
    const form = this.renderForm();
    const error = this.renderError();

    if (canEditDonor) {
      edit = (
        <button onClick={this.showForm} className="block-header__btn" data-test-edit-tags>
          <span className="label--small">Edit</span>
        </button>
      )
    }

    if (!donorLoaded) {
      body = <DonorProfilePlaceholder />;
    } else {
      body = (
        <div className="donor-tags__body">
          {error}
          {tags}
        </div>
      )
    }

    return (
      <div className="donor-tags block" data-donor-tags-block>
        <div className="block-header">
          <h2 className="title__h4">Tags</h2>
          {edit}
        </div>
        {body}
        {form}
      </div>
    )
  }
}

export default DonorProfileTags;
