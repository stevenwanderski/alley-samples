class Api::Nonprofits::DonorNotesController < Api::Nonprofits::ApplicationController
  before_action :authorize_nonprofit_user!
  before_action :authorize_and_assign_donor!

  def index
    notes = @donor.donor_notes
      .order(created_at: :desc)
      .page(params[:page])
      .per(params[:per_page])

    meta = {
      total_count: notes.total_count
    }

    render json: notes, meta: meta, adapter: :json, each_serializer: Serializers::V2::DonorNoteSerializer
  end

  def create
    note = @donor.donor_notes.new(donor_note_params)

    if note.save
      render json: note, serializer: Serializers::V2::DonorNoteSerializer
    else
      render json: { errors: note.errors }, status: 422
    end
  end

  def update
    note = @donor.donor_notes.find_by(id: params[:id])

    if note.update(donor_note_params)
      render json: note, serializer: Serializers::V2::DonorNoteSerializer
    else
      render json: { errors: note.errors }, status: 422
    end
  end

  def destroy
    note = @donor.donor_notes.find_by(id: params[:id])

    if note.destroy
      render json: note, serializer: Serializers::V2::DonorNoteSerializer
    else
      render json: { errors: ['Could note destroy note'] }, status: 422
    end
  end

  private

  def authorize_nonprofit_user!
    return true if current_nonprofit_user.admin?

    if !read_only_actions.include?(action_name.to_sym)
      return render json: { errors: ['Not authorized'] }, status: 401
    end
  end

  def read_only_actions
    [:index]
  end

  def authorize_and_assign_donor!
    @donor = @nonprofit.donors.find_by(id: params[:donor_id])

    if @donor.nil?
      render json: { errors: ['Donor not found'] }, status: 404
    end
  end

  def donor_note_params
    params.require(:donor_note).permit(:body)
  end
end
