class Api::Nonprofits::DonorTransactionsController < Api::Nonprofits::ApplicationController
  before_action :authorize_and_assign_donor!

  def index
    transactions = @donor.nonprofit_transactions
      .order(transacted_at: :desc)
      .page(params[:page])
      .per(params[:per_page])

    meta = {
      total_count: transactions.total_count
    }

    render json: transactions, meta: meta, adapter: :json, each_serializer: Serializers::V2::DonorTransactionSerializer
  end

  def totals
    donations = @donor.donations
    orders = @donor.orders

    donations_sum = donations.sum(:total_in_cents)
    orders_sum = orders.sum(:total_in_cents)

    total_count = donations.count + orders.count
    total_in_cents = donations_sum + orders_sum
    average_in_cents = total_count.zero? ? 0 : total_in_cents / total_count

    current_year = Date.today.year
    current_year_donations = donations.where('EXTRACT(YEAR from transacted_at) = ?', current_year)
    current_year_orders = orders.where('EXTRACT(YEAR from transacted_at) = ?', current_year)
    year_to_date_in_cents = current_year_donations.sum(:total_in_cents) + current_year_orders.sum(:total_in_cents)

    data = {
      year_to_date_in_cents: year_to_date_in_cents.round,
      total_in_cents: total_in_cents.round,
      average_in_cents: average_in_cents.round
    }

    render json: data
  end

  private

  def authorize_and_assign_donor!
    @donor = @nonprofit.donors.find_by(id: params[:donor_id])

    if @donor.nil?
      render json: { errors: ['Donor not found'] }, status: 404
    end
  end
end
