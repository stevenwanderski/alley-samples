import React from 'react';

class DonorProfileCityState extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { city, state } = this.props;

    if (!city && !state) {
      return null;
    }

    const markupFormatted = [city, state].filter(Boolean).join(', ');

    return <p>{markupFormatted}</p>;
  }
}

export default DonorProfileCityState;
