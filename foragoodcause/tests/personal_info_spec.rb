require 'rails_helper'

describe 'Nonprofit User Donor: Personal Info', js: true, driver: :chrome do
  let(:nonprofit_user) { create(:nonprofit_user) }
  let(:nonprofit) { nonprofit_user.nonprofit }
  let(:donor) do
    create(:donor,
      nonprofit: nonprofit,
      first_name: 'Frank',
      last_name: 'Zappa',
      job_title: nil,
      company: nil,
      birthdate_year: nil,
      birthdate_month: nil,
      birthdate_day: nil
    )
  end

  before(:each) do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)
    expect(page).to have_selector('[data-donor-loaded="true"]')
  end

  it 'updates the Job Title and Employer' do
    within('[data-donor-personal-info-block]') do
      expect(page).to_not have_content('JOB TITLE & EMPLOYER')
      click_button 'Edit'
    end

    within('[data-donor-personal-info-modal]') do
      fill_in 'jobTitle', with: 'Musician'
      fill_in 'company', with: 'Mothers of Invention'
      click_button 'Update'
      expect(page).to have_selector('button[disabled].btn--loading')
    end

    within('[data-donor-personal-info-block]') do
      expect(page).to have_content(/Job Title & Employer Musician Mothers of Invention/i)
      click_button 'Edit'
    end

    within('[data-donor-personal-info-modal]') do
      find('[name="jobTitle"]').set('H')
      find('[name="jobTitle"]').send_keys(:backspace)
      click_button 'Update'
    end

    within('[data-donor-personal-info-block]') do
      expect(page).to have_content(/Job Title & Employer Mothers of Invention/i)
    end
  end

  context 'Birthday' do
    it 'updates the Birthday' do
      within('[data-donor-personal-info-block]') do
        expect(page).to_not have_content(/Birthday/i)
        click_button 'Edit'
      end

      within('[data-donor-personal-info-modal]') do
        select '2016', from: 'birthdateYear'
        select 'March', from: 'birthdateMonth'
        select '31', from: 'birthdateDay'
        click_button 'Update'
      end

      within('[data-donor-personal-info-block]') do
        expect(page).to have_content(/Birthday March 31, 2016/i)
        click_button 'Edit'
      end
    end

    it 'changes Day values based on Month' do
      within('[data-donor-personal-info-block]') do
        click_button 'Edit'
      end

      within('[data-donor-personal-info-modal]') do
        # The day counts include number of days plus a blank value
        select 'February', from: 'birthdateMonth'
        expect(page).to have_selector('select[name="birthdateDay"] option', count: 29)

        select 'January', from: 'birthdateMonth'
        expect(page).to have_selector('select[name="birthdateDay"] option', count: 32)

        select 'April', from: 'birthdateMonth'
        expect(page).to have_selector('select[name="birthdateDay"] option', count: 31)
      end
    end

    it 'resets Day value if outside of Month' do
      within('[data-donor-personal-info-block]') do
        click_button 'Edit'
      end

      within('[data-donor-personal-info-modal]') do
        select 'January', from: 'birthdateMonth'
        select '31', from: 'birthdateDay'
        select '2016', from: 'birthdateYear'
        expect(page).to_not have_selector('[data-modal-submit][disabled]')

        select 'February', from: 'birthdateMonth'
        expect(page).to have_select('birthdateDay', selected: 'Day')
        expect(page).to have_selector('[data-modal-submit][disabled]')
      end
    end
  end

  context 'Form Validation' do
    it 'disables submit button when birthday is missing values' do
      within('[data-donor-personal-info-block]') do
        click_button 'Edit'
      end

      within('[data-donor-personal-info-modal]') do
        select '2016', from: 'birthdateYear'
        select 'January', from: 'birthdateMonth'
        select '1', from: 'birthdateDay'
        expect(page).to_not have_selector('[data-modal-submit][disabled]')

        select 'Year', from: 'birthdateYear'
        select 'Month', from: 'birthdateMonth'
        select 'Day', from: 'birthdateDay'
        expect(page).to_not have_selector('[data-modal-submit][disabled]')

        select '2016', from: 'birthdateYear'
        expect(page).to have_selector('[data-modal-submit][disabled]')
      end
    end
  end
end
