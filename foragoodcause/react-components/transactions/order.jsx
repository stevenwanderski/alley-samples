import React from 'react';
import moment from 'moment';
import formatCurrency from '../../../utils/format-currency';
import formatNumber from '../../../utils/format-number';

class DonorProfileTransactionsOrder extends React.Component {
  constructor(props) {
    super(props);
  }

  typeLabel(type) {
    if (type === 'order') {
      return 'registration';
    }

    return type;
  }

  render() {
    const { transaction } = this.props;
    const date = moment.parseZone(transaction.transacted_at).format('MMM D, YYYY');
    const campaignName = transaction.campaign_name;
    const total = formatCurrency(transaction.total_in_cents);
    const transactionCode = transaction.transaction_code;
    const viewUrl = transaction.view_url;
    const quantity = formatNumber(transaction.total_cart_quantity);
    const typeLabel = this.typeLabel(transaction.type);

    return (
      <div className="donor-activity__item">
        <div className="donor-activity__left">
          <div className="donor-activity__type circle-tooltip circle-tooltip--lt-blue" title={`${typeLabel}`}></div>
          <p className="donor-activity__date label--small">{date}</p>
          <h4 className="donor-activity__title">
            Registered for <span className="donor-activity__title--medium">{campaignName}</span>
          </h4>
          <p className="donor-activity__meta text--12">Quantity: {quantity}</p>
        </div>
        <div className="donor-activity__right">
          <p className="donor-activity__amount">{total}</p>
          <p className="donor-activity__transaction-id text--12"><a href={viewUrl}>#{transactionCode}</a></p>
        </div>
      </div>
    )
  }
}

export default DonorProfileTransactionsOrder;
