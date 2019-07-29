import React from 'react';

class DonorProfileSocialLinks extends React.Component {
  constructor(props) {
    super(props);
  }

  getUsername(url) {
    const lastSlashIndex = url.lastIndexOf('/');
    return url.slice(lastSlashIndex);
  }

  render() {
    const { facebook, twitter, linkedin, website } = this.props;

    if (!facebook && !twitter && !linkedin && !website) {
      return null;
    }

    let facebookHtml, twitterHtml, linkedinHtml, websiteHtml;

    if (facebook) {
      const facebookUsername = this.getUsername(facebook);

      facebookHtml = (
        <li>
          <a href={facebook} target="_blank" title="Facebook" className="donor-social__icon">
            <svg className="icon-facebook-mark">
              <use xlinkHref="#icon-facebook-mark" />
            </svg>
          </a>
        </li>
      )
    }

    if (twitter) {
      const twitterUsername = this.getUsername(twitter);

      twitterHtml = (
        <li>
          <a href={twitter} target="_blank" title="Twitter" className="donor-social__icon">
            <svg className="icon-twitter-mark">
              <use xlinkHref="#icon-twitter-mark" />
            </svg>
          </a>
        </li>
      )
    }

    if (linkedin) {
      const linkedinUsername = this.getUsername(linkedin);

      linkedinHtml = (
        <li>
          <a href={linkedin} target="_blank" title="Linkedin" className="donor-social__icon">
            <svg className="icon-linkedin-mark">
              <use xlinkHref="#icon-linkedin-mark" />
            </svg>
          </a>
        </li>
      )
    }

    if (website) {
      websiteHtml = (
        <li>
          <a href={website} target="_blank" title="Website" className="donor-social__icon">
            <svg className="icon-link">
              <use xlinkHref="#icon-link" />
            </svg>
          </a>
        </li>
      )
    }

    return (
      <div className="donor-social">
        <h3 className="label--small mb--6">Social Links</h3>
        <ul className="donor-social__list">
          {twitterHtml}
          {facebookHtml}
          {linkedinHtml}
          {websiteHtml}
        </ul>
      </div>
    )
  }
}

export default DonorProfileSocialLinks;
