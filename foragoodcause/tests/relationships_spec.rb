require 'rails_helper'

describe 'Nonprofit User Donor: Relationships', js: true, driver: :chrome do
  let(:nonprofit_user) { create(:nonprofit_user) }
  let(:nonprofit) { nonprofit_user.nonprofit }
  let(:other_nonprofit) { create(:nonprofit) }
  let!(:donor1) { create(:donor, nonprofit: nonprofit, first_name: 'Jimmy', last_name: 'Page') }
  let!(:donor2) { create(:donor, nonprofit: nonprofit, first_name: 'Robert', last_name: 'Plant') }
  let!(:donor3) { create(:donor, nonprofit: nonprofit, first_name: 'John Paul', last_name: 'Jones') }
  let!(:donor4) { create(:donor, nonprofit: other_nonprofit, first_name: 'John', last_name: 'Bonham') }
  let!(:donor5) { create(:donor, nonprofit: other_nonprofit, first_name: 'Jimi', last_name: 'Hendrix') }
  let!(:donor6) { create(:donor, nonprofit: nonprofit, first_name: 'Peter', last_name: 'Grant') }

  it 'renders the relationships' do
    rel1 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor2.id, label: 'Fam')
    rel2 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor3.id, label: 'Sibs')
    rel3 = create(:donor_relationship, donor1_id: donor4.id, donor2_id: donor5.id, label: 'Other')
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    expect(page).to have_selector('[data-donor-loaded="true"]')
    expect(page).to have_content('Robert Plant Fam')
    expect(page).to have_content('John Paul Jones Sibs')
    expect(page).to_not have_content('John Bonham')
    expect(page).to_not have_content('Jimi Hendrix')
  end

  it 'adds relationships' do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    within('[data-donor-relationships-block]') do
      click_button 'Edit'
    end

    find('[data-relationship-input]').set('John')
    find("[data-relationship-suggestion='#{donor3.id}']").click
    find('[data-relationship-label-input]').set('Family')

    expect(page).to have_selector('[data-relationship-full-name]', text: 'John Paul Jones')
    expect(page).to_not have_selector('[data-relationship-input]')

    find('[data-donor-relationship-add]').click

    find('[data-relationship-input]').set('Rob')
    find("[data-relationship-suggestion='#{donor2.id}']").click
    all('[data-relationship-label-input]').last.set('Bandmate')

    expect(page).to have_selector('[data-relationship-full-name]', text: 'Robert Plant')
    expect(page).to_not have_selector('[data-relationship-input]')

    click_button 'Update'
    expect(page).to have_selector('button[disabled].btn--loading')

    within('[data-donor-relationships-block]') do
      expect(page).to have_content('John Paul Jones Family')
      expect(page).to have_content('Robert Plant Bandmate')
    end
  end

  it 'excludes saved relationships and current donor from suggestions' do
    rel1 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor2.id, label: 'Fam')
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    within('[data-donor-relationships-block]') do
      expect(page).to have_content('Robert Plant Fam')
      click_button 'Edit'
    end

    within('[data-donor-relationship-modal]') do
      find('[data-donor-relationship-add]').click

      find('[data-relationship-input]').set('Robert')
      expect(page).to_not have_selector("[data-relationship-suggestion='#{donor2.id}']")
      all('[data-donor-relationship-remove]').last.click

      find('[data-donor-relationship-add]').click
      find('[data-relationship-input]').set('Jimmy')
      expect(page).to_not have_selector("[data-relationship-suggestion='#{donor1.id}']")
      all('[data-donor-relationship-remove]').last.click
    end
  end

  it 'excludes unsaved relationships from suggestions' do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    within('[data-donor-relationships-block]') do
      click_button 'Edit'
    end

    within('[data-donor-relationship-modal]') do
      find('[data-relationship-input]').set('Robert')
      find("[data-relationship-suggestion='#{donor2.id}']").click
      expect(page).to have_selector('[data-relationship-full-name]', text: 'Robert Plant')

      find('[data-donor-relationship-add]').click
      find('[data-relationship-input]').set('Robert')
      expect(page).to_not have_selector("[data-relationship-suggestion='#{donor2.id}']")
    end
  end

  it 'populates the input when keyboard arrows are used on autocomplete' do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    within('[data-donor-relationships-block]') do
      click_button 'Edit'
    end

    find('[data-relationship-input]').set('John')
    expect(page).to have_selector("[data-relationship-suggestion='#{donor3.id}']")
    find('[data-relationship-input]').native.send_keys(:arrow_down)
    expect(find('[data-relationship-input]').value).to eq('John Paul Jones')
  end

  it 'prevents adding an empty relationship' do
    rel1 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor2.id, label: 'Fam')
    expect(donor1.donor_relationships.count).to eq(1)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    within('[data-donor-relationships-block]') do
      click_button 'Edit'
    end

    find('[data-donor-relationship-add]').click

    expect(page).to have_selector('[data-relationship-form-item]', count: 2)
    click_button 'Update'

    expect(page).to have_selector('[data-relationship-item]', count: 1)
  end

  it 'removes a relationship' do
    rel1 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor2.id, label: 'Fam')
    rel2 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor3.id, label: 'Bandmate')
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    within('[data-donor-relationships-block]') do
      click_button 'Edit'
      expect(page).to have_selector('[data-relationship-form-item]', count: 2)
      all('[data-donor-relationship-remove]').last.click

      expect(page).to have_selector('[data-relationship-form-item]', count: 1)
      all('[data-donor-relationship-remove]').last.click

      # Keep a row of blank inputs
      expect(page).to have_selector('[data-relationship-form-item]', count: 1)
      click_button 'Update'
    end

    within('[data-donor-relationships-block]') do
      expect(page).to have_selector('[data-relationship-item]', count: 0)
    end
  end

  it 'edits a relationship' do
    rel1 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor2.id, label: 'Fam')
    rel2 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor3.id, label: 'Bandmate')
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor1)

    within('[data-donor-relationships-block]') do
      expect(page).to have_selector('[data-relationship-item]', count: 2)
      click_button 'Edit'
    end

    expect(page).to have_selector('[data-relationship-full-name]', text: 'Robert Plant')
    expect(page).to_not have_selector('[data-relationship-input]')
    first('[data-relationship-label-input]').set('Vocals')

    expect(page).to have_selector('[data-relationship-full-name]', text: 'John Paul Jones')
    expect(page).to_not have_selector('[data-relationship-input]')
    all('[data-relationship-label-input]').last.set('Bass')

    click_button 'Update'
    expect(page).to have_selector('button[disabled].btn--loading')

    expect(page).to have_content('Robert Plant Vocals')
    expect(page).to have_content('John Paul Jones Bass')
  end

  context 'user does not have edit permissions' do
    let(:nonprofit_user) { create(:nonprofit_user, role: 'read_only') }

    it 'hides the add, edit, and remove controls' do
      rel1 = create(:donor_relationship, donor1_id: donor1.id, donor2_id: donor2.id, label: 'Fam')
      login_as(nonprofit_user, scope: :nonprofit_user)
      visit nonprofit_users_donor_path(donor1)

      within('[data-donor-relationships-block]') do
        expect(page).to have_content('Robert Plant Fam')
        expect(page).to_not have_button('Edit')
      end
    end
  end
end
