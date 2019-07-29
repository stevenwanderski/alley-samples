require 'rails_helper'

describe 'Nonprofit User Donor: Authorization', js: true, react: true do
  it 'hides controls for read-only users' do
    nonprofit_user = create(:nonprofit_user, role: 'read_only')
    nonprofit = nonprofit_user.nonprofit
    donor = create(:donor, nonprofit: nonprofit)
    note1 = create(:donor_note, donor_id: donor.id, body: 'Abbey Road', created_at: 1.days.ago)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_content(note1.body)
    expect(page).to_not have_css('[data-test-note-create-input]')
    expect(page).to_not have_css('[data-test-add-donation]')
    expect(page).to_not have_css('[data-test-add-donation-header]')
    expect(page).to_not have_css('[data-test-edit-donor]')
    expect(page).to_not have_css('[data-test-edit-tags]')
    expect(page).to_not have_css('[data-test-edit-contact-info]')
    expect(page).to_not have_css('[data-test-edit-personal-info]')
    expect(page).to_not have_css('[data-test-edit-relationships]')
    expect(page).to_not have_css('[data-test-edit-custom-fields]')
  end
end
