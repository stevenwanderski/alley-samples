import React from 'react';
import formatCurrency from '../../utils/format-currency';

class DonorProfileStats extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { yearToDateInCents, totalInCents, averageInCents } = this.props;

    return (
      <div className="donor-stats flex-grid mb--6">
        <div className="col-1-3">
          <h3 className="donor-stats__label stat-label label--small">Year to Date</h3>
          <p className="donor-stats__number stat-number">{formatCurrency(yearToDateInCents)}</p>
        </div>
        <div className="col-1-3">
          <h3 className="donor-stats__label stat-label label--small">Lifetime</h3>
          <p className="donor-stats__number stat-number">{formatCurrency(totalInCents)}</p>
        </div>
        <div className="col-1-3">
          <h3 className="donor-stats__label stat-label label--small">Average</h3>
          <p className="donor-stats__number stat-number">{formatCurrency(averageInCents)}</p>
        </div>
      </div>
    )
  }
}

export default DonorProfileStats;
