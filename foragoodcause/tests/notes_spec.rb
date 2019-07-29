require 'rails_helper'

describe 'Nonprofit User Donor: Notes', js: true, react: true do
  it 'renders the notes with a pager' do
    stub_const('NONPROFIT_DONOR_NOTE_RECORDS_PER_PAGE', 2)

    nonprofit_user = create(:nonprofit_user)
    nonprofit = nonprofit_user.nonprofit
    donor = create(:donor, nonprofit: nonprofit)
    note1 = create(:donor_note, donor_id: donor.id, body: 'Abbey Road', created_at: 1.days.ago)
    note2 = create(:donor_note, donor_id: donor.id, body: 'White Album', created_at: 2.days.ago)
    note3 = create(:donor_note, donor_id: donor.id, body: 'Let it Be', created_at: 3.days.ago)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_content(note1.body)
    expect(page).to have_content(note2.body)
    expect(page).to_not have_content(note3.body)

    # Click page 2
    first('[data-num="2"]').click

    expect(page).to_not have_content(note1.body)
    expect(page).to_not have_content(note2.body)
    expect(page).to have_content(note3.body)
  end

  it 'creates a note' do
    nonprofit_user = create(:nonprofit_user)
    nonprofit = nonprofit_user.nonprofit
    donor = create(:donor, nonprofit: nonprofit)
    body = 'I am note. Hear me roar.'

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_css('[data-test-note-create-input]')
    find('[data-test-note-create-input]').set(body)
    click_button 'Add Note'

    expect(page).to have_content(body)
  end

  it 'edits the correct note after adding a few' do
    nonprofit_user = create(:nonprofit_user)
    nonprofit = nonprofit_user.nonprofit
    donor = create(:donor, nonprofit: nonprofit)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_css('[data-test-note-create-input]')
    find('[data-test-note-create-input]').set('One')
    click_button 'Add Note'
    expect(page).to have_css('[data-test-note]', text: 'One')

    find('[data-test-note-create-input]').set('Two')
    click_button 'Add Note'
    expect(page).to have_css('[data-test-note]', text: 'Two')

    first('[data-test-note]').hover
    first('[data-test-note-edit]').click

    expect(first('[data-test-note-edit-input]').value).to eq('Two')
  end

  it 'edits a note' do
    nonprofit_user = create(:nonprofit_user)
    nonprofit = nonprofit_user.nonprofit
    donor = create(:donor, nonprofit: nonprofit)
    note = create(:donor_note, donor_id: donor.id, body: 'I am note.')

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_content('I am note.')
    find('[data-test-note]').hover
    find('[data-test-note-edit]').click
    expect(page).to have_css('[data-test-note-edit-input]')
    find('[data-test-note-edit-input]').set('Hear me roar.')
    find('[data-test-note-edit-submit]').click

    expect(page).to have_content('Hear me roar.')
  end

  it 'deletes a note' do
    nonprofit_user = create(:nonprofit_user)
    nonprofit = nonprofit_user.nonprofit
    donor = create(:donor, nonprofit: nonprofit)
    note = create(:donor_note, donor_id: donor.id, body: 'I am note.')

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    expect(page).to have_content(note.body)
    find('[data-test-note]').hover
    expect(page).to have_content('DELETE')
    find('[data-test-note-delete]').click
    expect(page).to have_content('Are you sure?')

    click_button 'Delete'

    expect(page).to have_selector('[data-test-note]', count: 0)
  end
end
