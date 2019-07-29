import React from 'react';
import axios from 'axios';
import DonorProfilePlaceholder from './placeholder';
import DonorProfileTransactionsDonation from './transactions/donation';
import DonorProfileTransactionsOrder from './transactions/order';

class DonorProfileTransactionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      isLoading: false,
      dataFetched: false,
      isDataError: false
    }
  }

  typeLabel(type) {
    if (type === 'order') {
      return 'registration';
    }

    return type;
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    const { donorId, apiKey, transactionsPerPage } = this.props;
    const url = `/api/nonprofits/donor_transactions/${donorId}?api_key=${apiKey}`;
    const params = {
      per_page: transactionsPerPage
    }

    return axios.get(url, { params })
      .then((response) => {
        const transactions = response.data['nonprofit_transactions'];
        const totalCount = response.data['meta']['total_count'];

        this.setState({
          transactions: transactions,
          isLoading: false,
          dataFetched: true
        });

        if (totalCount > 0) {
          this.initializePagination(url, totalCount);
        }
      });
  }

  initializePagination(url, totalCount) {
    const { transactionsPerPage } = this.props;

    $(this.pagerEl).pagination({
      dataSource: url,
      locator: 'nonprofit_transactions',
      pageSize: transactionsPerPage,
      totalNumber: totalCount,
      triggerPagingOnInit: false,
      hideWhenLessThanOnePage: true,

      alias: {
        pageNumber: 'page',
        pageSize: 'per_page'
      },

      ajax: {
        beforeSend: () => {
          this.setState({ isLoading: true });
        }
      },

      callback: (data, pagination) => {
        this.setState({ transactions: data, isLoading: false });
      }
    });
  }

  renderTransactions() {
    const { transactions } = this.state;

    if (transactions.length === 0) {
      return <p className="dashboard__no-activity">No recent activity.</p>;
    }

    return transactions.map((transaction) => {
      const type = transaction.type;

      if (type === 'donation') {
        return <DonorProfileTransactionsDonation transaction={transaction} key={transaction.id} />
      } else if (type === 'order') {
        return <DonorProfileTransactionsOrder transaction={transaction} key={transaction.id} />
      }
    });
  }

  renderBody() {
    const { dataFetched, isDataError } = this.state;

    if (!dataFetched) {
      return <DonorProfilePlaceholder />;
    }

    if (isDataError) {
      return <p className="dashboard__error">This data cannot be shown at this time.</p>;
    }

    return this.renderTransactions();
  }

  renderLoading() {
    if (this.state.isLoading) {
      return <div className="loading-bar"></div>
    }

    return null;
  }

  render() {
    const { donationAddUrl, canAddDonation } = this.props;
    const loading = this.renderLoading();
    const body = this.renderBody();
    let addDonation;

    if (canAddDonation) {
      addDonation = (
        <p className="label--small">
          <a href={donationAddUrl} data-test-add-donation>Add Donation</a>
        </p>
      )
    }

    return (
      <div className="donor-activity block">
        {loading}
        <div className="block-header">
          <h2 className="title__h4">Activity</h2>
          {addDonation}
        </div>
        <div className="donor-activity__list">
          {body}
          <div ref={(el) => { this.pagerEl = el; }}></div>
        </div>
      </div>
    );
  }
}

export default DonorProfileTransactionList;
