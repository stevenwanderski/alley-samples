require 'rails_helper'

describe 'Nonprofit User Donor: Delete', js: true, driver: :chrome do
  let(:nonprofit_user) { create(:nonprofit_user) }
  let(:nonprofit) { nonprofit_user.nonprofit }
  let(:donor) { create(:donor, nonprofit: nonprofit) }

  it 'deletes the donor' do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    click_button 'Delete Contact'
    click_button 'Delete'

    expect(page).to have_content('Donor was successfully deleted')
  end

  context 'read-only user' do
    let(:nonprofit_user) { create(:nonprofit_user, role: 'read_only') }

    it 'hides the delete control' do
      login_as(nonprofit_user, scope: :nonprofit_user)
      visit nonprofit_users_donor_path(donor)

      expect(page).to_not have_button('Delete Contact')
    end
  end
end
