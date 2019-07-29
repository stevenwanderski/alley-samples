class Api::Nonprofits::DonorRelationshipsController < Api::Nonprofits::ApplicationController
  def create_bulk
    donor = @nonprofit.donors.find(params[:donor_id])

    relationships = params[:donor_relationships] || []

    DonorRelationship.transaction do
      DonorRelationship.destroy_all(id: donor.donor_relationships.ids)

      relationships.each do |donor_relationship|
        DonorRelationship.create!(
          donor1_id: donor.id,
          donor2_id: donor_relationship['other_donor_id'],
          label: donor_relationship['label']
        )
      end
    end

    render json: { success: true }
  end
end
