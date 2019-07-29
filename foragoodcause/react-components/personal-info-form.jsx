import React from 'react';
import Modal from '../modal';
import HiddenButton from '../hidden-button';
import swalError from '../../utils/swal-error';

class DonorProfilePersonalInfoForm extends React.Component {
  constructor(props) {
    super(props);

    this.monthDayCounts = {
      '01': 31,
      '02': 28,
      '03': 31,
      '04': 30,
      '05': 31,
      '06': 31,
      '07': 30,
      '08': 31,
      '09': 30,
      '10': 31,
      '11': 30,
      '12': 31
    }

    this.months = [
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ]

    const { donor } = this.props;
    const birthdateYear = donor.birthdate_year;
    const birthdateMonth = donor.birthdate_month;
    const birthdateDay = donor.birthdate_day;

    this.state = {
      isDisabled: false,
      isLoading: false,
      formValues: {
        jobTitle: donor.job_title,
        company: donor.company,
        birthdateYear: birthdateYear,
        birthdateMonth: birthdateMonth,
        birthdateDay: birthdateDay
      }
    }

    this.update = this.update.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  update() {
    const { formValues } = this.state;
    const { onUpdate } = this.props;
    this.setState({ isLoading: true, isDisabled: true });

    onUpdate(formValues)
      .catch((errors) => {
        swalError(errors);
        this.setState({ isLoading: false, isDisabled: false });
      });
  }

  submit(event) {
    event.preventDefault();
    this.update();
  }

  onChange(event) {
    const formValues = this.state.formValues;
    const target = event.target;
    const { name, type, value } = target;
    formValues[name] = value;

    if (name === 'birthdateMonth') {
      const day = formValues.birthdateDay;
      const month = value;
      if (!this.validDayOfMonth(day, month)) {
        formValues['birthdateDay'] = '';
      }
    }

    this.setState({ formValues: formValues });
    this.validate();
  }

  validate() {
    const { birthdateDay, birthdateMonth, birthdateYear } = this.state.formValues;
    const isValid = (birthdateDay && birthdateMonth) ||
      (!birthdateDay && !birthdateMonth && !birthdateYear);

    this.setState({ isDisabled: !isValid });
  }

  validDayOfMonth(day, month) {
    const dayCount = this.monthDayCounts[month];
    return day <= dayCount;
  }

  renderDayOptions() {
    const options = [];
    const month = this.state.formValues.birthdateMonth;
    const dayCount = this.monthDayCounts[month];

    for (var i = 0; i < dayCount; i++) {
      const value = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
      const option = <option value={value} key={i}>{i + 1}</option>
      options.push(option);
    }

    return options;
  }

  renderMonthOptions() {
    return this.months.map((month, index) => {
      return <option value={month.value} key={index}>{month.label}</option>
    });
  }

  renderYearOptions() {
    const options = [];
    const currentYear = new Date().getFullYear();

    for (var i = currentYear; i > 1900; i--) {
      const option = <option value={i} key={i}>{i}</option>
      options.push(option);
    }

    return options;
  }

  render() {
    const { formValues, isDisabled, isLoading } = this.state;
    const { onCancel, donor, apiKey } = this.props;
    const attrs = { 'data-donor-personal-info-modal': 'true' }
    const dayOptions = this.renderDayOptions();
    const monthOptions = this.renderMonthOptions();
    const yearOptions = this.renderYearOptions();

    return (
      <Modal
        onCancel={onCancel}
        onUpdate={this.update}
        title="Edit Personal Info"
        attrs={attrs}
        isDisabled={isDisabled}
        isLoading={isLoading}
      >
        <form onSubmit={this.submit}>

          <div className="modal-fieldset">
            <div className="form-item">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                defaultValue={formValues.jobTitle}
                onChange={this.onChange} />
            </div>

            <div className="form-item">
              <label htmlFor="company">Employer</label>
              <input
                type="text"
                name="company"
                defaultValue={formValues.company}
                onChange={this.onChange} />
            </div>
          </div>

          <div className="form-item form-item__bday">
            <label>Birthday</label>
            <div className="form-item__select-inline">
              <div className="form-item--select__container">
                <select
                  name="birthdateMonth"
                  defaultValue={formValues.birthdateMonth}
                  onChange={this.onChange}>
                  <option value="">Month</option>
                  {monthOptions}
                </select>
              </div>

              <div className="form-item--select__container">
                <select
                  name="birthdateDay"
                  defaultValue={formValues.birthdateDay}
                  onChange={this.onChange}>
                  <option value="">Day</option>
                  {dayOptions}
                </select>
              </div>

              <div className="form-item--select__container">
                <select
                  name="birthdateYear"
                  defaultValue={formValues.birthdateYear}
                  onChange={this.onChange}>
                  <option value="">Year</option>
                  {yearOptions}
                </select>
              </div>
            </div>
          </div>

          <HiddenButton />
        </form>
      </Modal>
    )
  }
}

export default DonorProfilePersonalInfoForm;
