require 'rails_helper'

context 'Nonprofit User Donor: Transactions', js: true, react: true do
  it 'displays a Donor with transactions' do
    stub_const('NONPROFIT_DONOR_TRANSACTION_RECORDS_PER_PAGE', 2)

    nonprofit_user = create(:nonprofit_user)
    nonprofit = nonprofit_user.nonprofit
    campaign1 = create(:campaign, nonprofit: nonprofit)
    campaign2 = create(:campaign, nonprofit: nonprofit)
    donor = create(:donor, nonprofit: nonprofit)
    current_year_donation = create(:donation, nonprofit: nonprofit, email: donor.email, total: 50.00, transacted_at: 1.day.ago, campaign: campaign1)
    last_year_donation = create(:donation, nonprofit: nonprofit, email: donor.email, total: 25.00, transacted_at: 1.year.ago, campaign: campaign2)
    order = create(:order, campaign: campaign1, email: donor.email, total: 15.00, transacted_at: 1.day.ago)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_content(donor.reload.full_name)
    expect(page).to have_content("YEAR TO DATE $65.00")
    expect(page).to have_content("LIFETIME $90.00")
    expect(page).to have_content("AVERAGE $30.00")

    expect(page).to have_content("Registered for #{campaign1.name}")
    expect(page).to have_content("Donated to #{campaign1.name}")

    # Click page 2
    first('[data-num="2"]').click

    expect(page).to have_content("Donated to #{campaign2.name}")
  end

  it 'displays a Donor with no transactions' do
    nonprofit_user = create(:nonprofit_user)
    nonprofit = nonprofit_user.nonprofit
    donor = create(:donor, nonprofit: nonprofit)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_content(donor.full_name)
    expect(page).to have_content("No recent activity")
  end
end
