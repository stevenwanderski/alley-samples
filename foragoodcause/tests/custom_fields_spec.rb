require 'rails_helper'

describe 'Nonprofit User Donor: Custom Fields', js: true, driver: :chrome do
  let(:nonprofit_user) { create(:nonprofit_user) }
  let(:nonprofit) { nonprofit_user.nonprofit }
  let(:donor) { create(:donor, nonprofit: nonprofit) }

  context 'Existing fields' do
    let(:text_field) { create(:form_field, field_type: 'text', label: 'Instrument', form_fieldable_type: 'NonprofitDonor', form_fieldable_id: nonprofit.id) }

    before(:each) do
      login_as(nonprofit_user, scope: :nonprofit_user)

      donor.form_field_responses << [
        build(:form_field_response, response: 'Piano', form_field: text_field),
      ]

      visit nonprofit_users_donor_path(donor)
      expect(page).to have_selector('[data-donor-loaded="true"]')
    end

    it 'renders custom field values if they exist' do
      within('[data-donor-custom-fields-block]') do
        expect(page).to have_content(/Instrument Piano/i)
      end
    end

    it 'updates and renders existing text, checkbox, and select fields' do
      within('[data-donor-custom-fields-block]') do
        click_button 'Edit'
      end

      fill_in text_field.id, with: 'Harpsichord'
      click_button 'Update'
      expect(page).to have_selector('button[disabled].btn--loading')

      within('[data-donor-custom-fields-block]') do
        expect(page).to have_content(/Instrument Harpsichord/i)
      end
    end
  end

  context 'New Fields' do
    before(:each) do
      login_as(nonprofit_user, scope: :nonprofit_user)
      visit nonprofit_users_donor_path(donor)
      expect(page).to have_selector('[data-donor-loaded="true"]')

      within('[data-donor-custom-fields-block]') do
        click_button 'Edit'
      end
    end

    it 'adds new custom fields' do
      find('[data-new-custom-field-label]').set('Opus')
      find('[data-new-custom-field-value]').set('60')

      within '[data-donor-custom-fields-modal]' do
        find('[data-custom-field-add]').click
      end

      all('[data-new-custom-field-label]').last.set('Number')
      all('[data-new-custom-field-value]').last.set('4')

      click_button 'Update'
      expect(page).to have_selector('button[disabled].btn--loading')

      within('[data-donor-custom-fields-block]') do
        expect(page).to have_content(/Opus 60/i)
        expect(page).to have_content(/Number 4/i)
      end
    end

    it 'does not save empty new custom fields' do
      # click add multiple times
      within '[data-donor-custom-fields-modal]' do
        find('[data-custom-field-add]').click
        expect(page).to have_selector('[data-new-custom-field-label]', count: 2)
        expect(page).to have_selector('[data-new-custom-field-value]', count: 2)
      end

      # click save and verify that the new fields were not saved
      click_button 'Update'
      expect(page).to have_selector('button[disabled].btn--loading')

      within('[data-donor-custom-fields-block]') do
        expect(page).to have_selector('[data-custom-field-item]', count: 0)
      end
    end
  end

  context 'Form Validation' do
    before(:each) do
      login_as(nonprofit_user, scope: :nonprofit_user)
      visit nonprofit_users_donor_path(donor)
      expect(page).to have_selector('[data-donor-loaded="true"]')

      within('[data-donor-custom-fields-block]') do
        click_button 'Edit'
      end
    end

    context 'when multiple unsaved new custom fields exist' do
      it 'validates the inputs' do
        # first new custom field inputs are empty, button enabled
        expect(find('[data-new-custom-field-label]').value).to eq('')
        expect(find('[data-new-custom-field-value]').value).to eq('')
        expect(page).to have_button('Update', disabled: false)

        # fill in one input, button disabled
        find('[data-new-custom-field-label]').set('Opus')
        expect(page).to have_button('Update', disabled: true)

        # fill in other input, button enabled
        find('[data-new-custom-field-value]').set('60')
        expect(page).to have_button('Update', disabled: false)

        # click add, button enabled
        within '[data-donor-custom-fields-modal]' do
          find('[data-custom-field-add]').click
        end
        expect(page).to have_button('Update', disabled: false)

        # fill in one input, button disabled
        all('[data-new-custom-field-label]').last.set('Number')
        expect(page).to have_button('Update', disabled: true)

        # fill in other input button enabled
        all('[data-new-custom-field-value]').last.set('4')
        expect(page).to have_button('Update', disabled: false)

        # backspace all text from one input, button disabled
        all('[data-new-custom-field-value]').last.send_keys(:backspace)
        expect(page).to have_button('Update', disabled: true)

        # click remove on invalid input, button enabled
        within '[data-donor-custom-fields-modal]' do
          all('[data-custom-field-remove]').last.click
          expect(page).to have_button('Update', disabled: false)

          # click remove on remaining input, text is cleared, button enabled
          find('[data-custom-field-remove]').click
          expect(find('[data-new-custom-field-label]').value).to eq('')
          expect(find('[data-new-custom-field-value]').value).to eq('')
        end
      end
    end
  end
end
