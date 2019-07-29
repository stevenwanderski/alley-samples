import React from 'react';

class DonorProfileAvatar extends React.Component {
  constructor(props) {
    super(props);
  }

  getInitials() {
    const { firstName, lastName } = this.props;
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);

    return `${firstInitial}${lastInitial}`;
  }

  render() {
    const { avatar } = this.props;
    const classNames = ['donor-thumb'];
    let body;

    if (!avatar) {
      const initials = this.getInitials();
      classNames.push('donor-thumb__initials');
      body = initials;
    } else {
      classNames.push('donor-thumb__image');
      body = <img src={avatar} />
    }

    return (
      <div className={classNames.join(' ')}>
        {body}
      </div>
    )
  }
}

export default DonorProfileAvatar;
