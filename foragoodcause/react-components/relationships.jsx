import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DonorProfilePlaceholder from './placeholder';
import DonorProfileRelationship from './relationship';
import DonorProfileRelationshipsForm from './relationships-form';

class DonorProfileRelationships extends React.Component {
  constructor(props) {
    super(props);

    this.clickEdit = this.clickEdit.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      isShowingForm: false
    }
  }

  clickEdit(relationship) {
    this.setState({ isShowingForm: true });
  }

  save(values) {
    const { apiKey, donorRelationshipsCreateBulkUrl, onUpdate, donor } = this.props;

    const compactValues = values.filter(value => value.otherDonorId);
    const relationshipParams = compactValues.map(value => {
      return {
        other_donor_id: value['otherDonorId'],
        label: value['label']
      }
    });

    const params = {
      donor_relationships: relationshipParams,
      api_key: apiKey,
      donor_id: donor.id
    };

    return axios.post(donorRelationshipsCreateBulkUrl, params)
      .then((response) => {
        return onUpdate();
      })
      .then(() => {
        this.hideForm();
        toast('Success!');
      });
  }

  hideForm() {
    this.setState({ isShowingForm: false });
  }

  renderForm() {
    if (this.state.isShowingForm) {
      const { donor, donorsSuggestionsUrl, apiKey, relationships } = this.props;

      return (
        <DonorProfileRelationshipsForm
          relationships={relationships}
          donor={donor}
          apiKey={apiKey}
          onCancel={this.hideForm}
          onUpdate={this.save}
          donorsSuggestionsUrl={donorsSuggestionsUrl} />
      )
    }
  }

  renderBody() {
    const { donor, canEditDonor, relationships } = this.props;

    return relationships.map((relationship, index) => {
      return (
        <DonorProfileRelationship
          relationship={relationship}
          key={index}
        />
      );
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
        <button onClick={this.clickEdit} className="block-header__btn" data-test-edit-relationships>
          <span className="label--small">Edit</span>
        </button>
      )
    }

    const form = this.renderForm();

    return (
      <div className="donor-relationships block" data-donor-relationships-block>
        <div className="block-header">
          <h2 className="title__h4">Relationships</h2>
          {edit}
        </div>
        {body}
        {form}
      </div>
    )
  }
}

export default DonorProfileRelationships;
