import React from 'react';

class DonorProfileRelationship extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { relationship } = this.props;
    const otherDonorId = relationship.other_donor_id;
    const relationshipUrl = `/nonprofit_users/donors/${otherDonorId}`;

    return (
      <div data-relationship-item={relationship.id} className="relationships-list__item">
        <p>
          <span><a href={relationshipUrl}>{relationship.full_name}</a></span> <span className="caption">{relationship.label}</span>
        </p>
      </div>
    )
  }
}

export default DonorProfileRelationship;
