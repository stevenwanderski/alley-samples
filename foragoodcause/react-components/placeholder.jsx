import React from 'react';

class DonorProfilePlaceholder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { includeAvatar } = this.props;
    let { lineCount } = this.props;
    let avatar;
    const lines = [];

    if (includeAvatar) {
      avatar = <div className="donor-loading-block__thumb"></div>
    }

    if (lineCount == undefined) {
      lineCount = 2;
    }

    for (var i = 0; i < lineCount; i++) {
      lines.push(<div className="donor-loading-block__content-line" key={i}></div>);
    }

    return (
      <div className="donor-loading-block__wrapper">
        {avatar}
        <div className="donor-loading-block__content">
          {lines}
        </div>
      </div>
    )
  }
}

export default DonorProfilePlaceholder;
