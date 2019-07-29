require 'rails_helper'

describe 'Nonprofit User Donor: Contact Info', js: true, driver: :chrome do
  let(:nonprofit_user) { create(:nonprofit_user) }
  let(:nonprofit) { nonprofit_user.nonprofit }
  let(:donor) do
    create(:donor,
      nonprofit: nonprofit,
      first_name: 'Frank',
      last_name: 'Zappa',
      address_1: '123 Moon',
      address_2: 'Apt Z',
      city: 'Venus',
      state: 'IL',
      postal: '99988',
      country: 'US',
      newsletter_enabled: false,
      email: 'frank@zappa.com',
      email_type: 'Work',
      phone: '999.888.7777',
      phone_type: 'Home',
      alternate_phone: '111.222.3333',
      alternate_phone_type: nil
    )
  end

  before(:each) do
    login_as(nonprofit_user, scope: :nonprofit_user)
    visit nonprofit_users_donor_path(donor)
    expect(page).to have_selector('[data-donor-loaded="true"]')
  end

  it 'updates the contact info' do
    within('[data-donor-overview-block]') do
      expect(page).to have_content('Frank Zappa')
      expect(page).to have_content('Venus, IL')
    end

    within('[data-donor-contact-info-block]') do
      expect(page).to_not have_content('Newsletter Subscriber')
      expect(page).to have_content('frank@zappa.com Work')
      expect(page).to have_content('999.888.7777 Home')
      expect(page).to have_content('111.222.3333')
      expect(page).to have_content('123 Moon Apt Z Venus, IL 99988 US')
      click_button 'Edit'
    end

    within('[data-donor-contact-info-modal]') do
      find('[name="firstName"]').set('Grand')
      find('[name="lastName"]').set('Wazoo')
      find('[name="address1"]').set('987 Earth')
      find('[name="address2"]').set('Bldg Y')
      find('[name="city"]').set('Mars')
      find('[name="postal"]').set('11122')

      find('[name="email"]').set('dweezil@zappa.com')
      select 'Work', from: 'emailType'
      find('[name="alternateEmail"]').set('fathers@invention.com')
      select 'Personal', from: 'alternateEmailType'
      find('[name="phone"]').set('555.666.7777')
      select 'Cell', from: 'phoneType'
      find('[name="alternatePhone"]').set('222.333.4444')
      select 'Work', from: 'alternatePhoneType'

      find('label[for="newsletterEnabled"]').click
      click_button 'Update'

      expect(page).to have_selector('button[disabled].btn--loading')
    end

    within('[data-donor-header]') do
      expect(page).to have_content('Grand Wazoo')
    end

    within('[data-donor-overview-block]') do
      expect(page).to have_content('Grand Wazoo Mars, IL')
    end

    within('[data-donor-contact-info-block]') do
      expect(page).to have_content('987 Earth Bldg Y')
      expect(page).to have_content('Mars, IL 11122 US')
      expect(page).to have_content('Newsletter Subscriber')
      expect(page).to have_content('dweezil@zappa.com Work')
      expect(page).to have_content('fathers@invention.com Personal')
      expect(page).to have_content('555.666.7777 Cell')
      expect(page).to have_content('222.333.4444 Work')
    end
  end

  it 'shows the unique email error' do
    create(:donor, nonprofit: nonprofit, email: 'edith@state-of-art.com')

    within('[data-donor-contact-info-block]') do
      click_button 'Edit'
    end

    within('[data-donor-contact-info-modal]') do
      find('[name="email"]').set('edith@state-of-art.com')
      click_button 'Update'
    end

    expect(page).to have_content('That email has been taken.')
  end

  context 'Form Validation' do
    before(:each) do
      within('[data-donor-contact-info-block]') do
        click_button 'Edit'
      end
    end

    it 'disables the button when first name is blank' do
      within('[data-donor-contact-info-modal]') do
        find('[name="firstName"]').set('H')
        find('[name="firstName"]').send_keys(:backspace)
        expect(page).to have_selector('[data-modal-submit][disabled]')

        find('[name="firstName"]').set('F')
        expect(page).to_not have_selector('[data-modal-submit][disabled]')
      end
    end

    it 'disables the button when email is not blank and not a valid email' do
      within('[data-donor-contact-info-modal]') do
        fill_in 'email', with: 'bad@bad'
        expect(page).to have_selector('[data-modal-submit][disabled]')

        fill_in 'email', with: 'good@good.times'
        expect(page).to_not have_selector('[data-modal-submit][disabled]')
      end
    end

    it 'disables the button when alternate email is not blank and not a valid email' do
      within('[data-donor-contact-info-modal]') do
        fill_in 'alternateEmail', with: 'no@no'
        expect(page).to have_selector('[data-modal-submit][disabled]')

        fill_in 'alternateEmail', with: 'yes@party.town'
        expect(page).to_not have_selector('[data-modal-submit][disabled]')
      end
    end

    it 'enables the button when email and alternate email are blank' do
      within('[data-donor-contact-info-modal]') do
        find('[name="firstName"]').set('Hey Boy')
        find('[name="email"]').set('e')
        find('[name="email"]').send_keys(:backspace)
        find('[name="alternateEmail"]').set('a')
        find('[name="alternateEmail"]').send_keys(:backspace)
        expect(page).to_not have_selector('[data-modal-submit][disabled]')
      end
    end
  end

  context 'Country / Province fields' do
    context 'when country and state are not blank' do
      before(:each) do
        within('[data-donor-contact-info-block]') do
          click_button 'Edit'
        end

        expect(page).to have_select('country', selected: 'United States')
        expect(page).to have_select('state', selected: 'Illinois (IL)')
      end

      it 'updates country and state with Canada selector' do
        select 'Canada', from: 'country'
        select 'British Columbia (BC)', from: 'state'

        click_button 'Update'

        within('[data-donor-contact-info-block]') do
          expect(page).to have_content('Venus, BC 99988 CA')
        end
      end

      it 'updates country and state with free form Province field' do
        select 'Albania', from: 'country'
        fill_in 'state', with: 'New Babel'

        click_button 'Update'

        within('[data-donor-contact-info-block]') do
          expect(page).to have_content('Venus, New Babel 99988 AL')
        end
      end

      it 'resets the the State input when switching back' do
        select 'Canada', from: 'country'
        select 'British Columbia (BC)', from: 'state'

        select 'United States', from: 'country'
        expect(page).to have_select('state', selected: 'State')
      end
    end

    context 'when country and state are blank' do
      let(:donor) { create(:donor, country: '', state: '', nonprofit: nonprofit) }

      it 'renders US and State' do
        expect(page).to have_selector('[data-donor-loaded="true"]')

        within('[data-donor-contact-info-block]') do
          click_button 'Edit'
        end

        expect(page).to have_selector('[data-state-select-field]')
        expect(page).to_not have_selector('[data-province-select-field]')
        expect(page).to have_select('country', selected: 'United States')
        expect(page).to have_select('state', selected: 'State')
      end
    end
  end
end
