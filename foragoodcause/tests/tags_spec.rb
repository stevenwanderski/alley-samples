require 'rails_helper'

describe 'Nonprofit User Donor: Tags', js: true, driver: :chrome do
  let(:nonprofit_user) { create(:nonprofit_user) }
  let(:nonprofit) { nonprofit_user.nonprofit }
  let(:donor) { create(:donor, nonprofit: nonprofit) }

  it 'renders the tags' do
    tag1 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 1")
    tag2 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 2")
    tag3 = create(:nonprofit_tag, name: "Tag 3")
    create(:donor_nonprofit_tag, donor: donor, nonprofit_tag: tag1)
    create(:donor_nonprofit_tag, donor: donor, nonprofit_tag: tag2)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    within('[data-donor-tags-block]') do
      expect(page).to have_content('Tag 1')
      expect(page).to have_content('Tag 2')
      expect(page).to_not have_content('Tag 3')
    end
  end

  it 'adds tags' do
    tag1 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 1")
    tag2 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 2")

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    within('[data-donor-tags-block]') do
      click_button 'Edit'
    end

    within('[data-donor-tags-modal]') do
      find('[data-tags-input]').set('Tag 2')
      find('[data-tags-suggestion="Tag 2"]').click
      find('[data-tags-input]').set('Tag 3')
      click_button 'Add'
    end

    within '[data-tags-collection-form]' do
      expect(page).to have_content('Tag 2')
      expect(page).to have_content('Tag 3')
    end

    click_button 'Update'
    expect(page).to have_selector('button[disabled].btn--loading')

    within '[data-tags-collection]' do
      expect(page).to have_content('Tag 2')
      expect(page).to have_content('Tag 3')
    end
  end

  it 'adds the input value as a tag' do
    tag1 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 1")
    tag2 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 2")

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    within('[data-donor-tags-block]') do
      click_button 'Edit'
    end

    within('[data-donor-tags-modal]') do
      find('[data-tags-input]').set('Tag 2')
      # blur the input to close the suggestions
      find('.modal-header').click
    end

    click_button 'Update'
    expect(page).to have_selector('button[disabled].btn--loading')

    within '[data-tags-collection]' do
      expect(page).to have_content('Tag 2')
    end
  end

  it 'prevents adding a duplicate tag' do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    within('[data-donor-tags-block]') do
      click_button 'Edit'
    end

    within('[data-donor-tags-modal]') do
      find('[data-tags-input]').set('Tag 1')
      click_button 'Add'
    end

    within '[data-tags-collection-form]' do
      expect(page).to have_content('Tag 1', count: 1)
    end

    # Attempt to add the same tag again
    within('[data-donor-tags-modal]') do
      find('[data-tags-input]').set('Tag 1')
      click_button 'Add'
    end

    within '[data-tags-collection-form]' do
      expect(page).to have_content('Tag 1', count: 1)
    end
  end

  it 'prevents adding an empty tag' do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    within('[data-donor-tags-block]') do
      click_button 'Edit'
    end

    within('[data-donor-tags-modal]') do
      click_button 'Add'
    end

    within '[data-tags-collection-form]' do
      expect(page).to_not have_selector('[data-tag-item]')
    end
  end

  it 'excludes existing tags from the suggestions' do
    tag1 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 1")

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    within('[data-donor-tags-block]') do
      click_button 'Edit'
    end

    within('[data-donor-tags-modal]') do
      find('[data-tags-input]').set('Tag 1')
      find('[data-tags-suggestion="Tag 1"]').click
    end

    within '[data-tags-collection-form]' do
      expect(page).to have_content('Tag 1', count: 1)
    end

    find('[data-tags-input]').set('Tag 1')
    expect(page).to_not have_selector('[data-tags-suggestion="Tag 1"]')
  end

  it 'removes a tag' do
    tag1 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 1")
    tag2 = create(:nonprofit_tag, nonprofit: nonprofit, name: "Tag 2")
    create(:donor_nonprofit_tag, donor: donor, nonprofit_tag: tag1)
    create(:donor_nonprofit_tag, donor: donor, nonprofit_tag: tag2)

    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)

    within('[data-donor-tags-block]') do
      click_button 'Edit'
    end

    find("[data-tag-remove='Tag 1']").click
    click_button 'Update'

    within '[data-tags-collection]' do
      expect(page).to_not have_content('Tag 1')
      expect(page).to have_content('Tag 2')
    end
  end
end
