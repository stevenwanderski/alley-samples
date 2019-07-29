import React from 'react';
import moment from 'moment';
import formatCurrency from '../../../utils/format-currency';

class DonorProfileTransactionsDonation extends React.Component {
  constructor(props) {
    super(props);
  }

  frequencyFormatted(frequency) {
    if (frequency === 'single') {
      return 'One-time';
    } else if (frequency === 'recurring') {
      return 'Recurring';
    }

    return null;
  }

  giftNameFormatted(giftName) {
    if (giftName) {
      return `Gift Designation: ${giftName}`;
    }

    return null;
  }

  frequencyAndGiftNameFormatted(frequency, giftName) {
    // .filter(Boolean) is the same as _.compact
    return [frequency, giftName].filter(Boolean).join(' | ');
  }

  donatedText(campaignName) {
    if (campaignName) {
      return <div>Donated to <span className="donor-activity__title--medium">{campaignName}</span></div>
    }
    return <div>Donation</div>
  }

  render() {
    const { transaction } = this.props;
    const date = moment.parseZone(transaction.transacted_at).format('MMM D, YYYY');
    const campaignName = transaction.campaign_name;
    const total = formatCurrency(transaction.total_in_cents);
    const transactionCode = transaction.transaction_code;
    const viewUrl = transaction.view_url;
    const frequencyFormatted = this.frequencyFormatted(transaction.frequency);
    const giftNameFormatted = this.giftNameFormatted(transaction.gift_name);
    const frequencyAndGiftNameFormatted = this.frequencyAndGiftNameFormatted(frequencyFormatted, giftNameFormatted);
    const donatedText = this.donatedText(campaignName);

    return (
      <div className="donor-activity__item">
        <div className="donor-activity__left">
          <div className="donor-activity__type circle-tooltip circle-tooltip--lt-green" title="Donation"></div>
          <p className="donor-activity__date label--small">{date}</p>
          <h4 className="donor-activity__title">
            {donatedText}
          </h4>
          <p className="donor-activity__meta text--12">{frequencyAndGiftNameFormatted}</p>
        </div>
        <div className="donor-activity__right">
          <p className="donor-activity__amount">{total}</p>
          <p className="donor-activity__transaction-id text--12"><a href={viewUrl}>#{transactionCode}</a></p>
        </div>
      </div>
    )
  }
}

export default DonorProfileTransactionsDonation;
