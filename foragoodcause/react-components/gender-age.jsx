import React from 'react';

class DonorProfileGenderAge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { gender, age } = this.props;
    let ageWithLabel;

    if (age) {
      ageWithLabel = `Age ${age}`;
    }

    if (!gender && !ageWithLabel) {
      return null;
    }

    const markupWithPipe = [gender, ageWithLabel].filter(Boolean).join(' | ');

    return <p>{markupWithPipe}</p>;
  }
}

export default DonorProfileGenderAge;
