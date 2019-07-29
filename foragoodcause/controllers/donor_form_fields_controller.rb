class Api::Nonprofits::DonorFormFieldsController < Api::Nonprofits::ApplicationController
  def create_bulk
    donor = @nonprofit.donors.find(params[:donor_id])

    params[:donor_form_fields].each do |donor_form_field|
      FormField.transaction do
        form_field = FormField.create!(
          form_fieldable_id: @nonprofit.id,
          form_fieldable_type: 'NonprofitDonor',
          field_type: 'text',
          label: donor_form_field['label'],
          required: false
        )

        donor.form_field_responses << FormFieldResponse.new(
          form_field: form_field,
          response: donor_form_field['value']
        )
      end
    end

    render json: { success: true }
  end

  def update_bulk
    donor = @nonprofit.donors.find(params[:donor_id])

    params[:donor_form_fields].each do |donor_form_field_id, value|
      form_field_response = donor.form_field_responses.find_or_initialize_by(form_field_id: donor_form_field_id)
      form_field_response.response = value
      form_field_response.save!
    end

    render json: { success: true }
  end
end
