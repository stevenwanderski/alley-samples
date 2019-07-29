import Controller from '@ember/controller';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import EventTrackingMixin from 'creators-web-app/mixins/event-tracking';

export default Controller.extend(EventTrackingMixin, {
  flashMessages: service('flashMessages'),
  intl: service('intl'),

  isRunning: readOnly('dismissCampaign.isRunning'),

  dismissCampaign: task(function* (dismissalReason) {
    try {
      const campaign = this.model;
      yield campaign.dismiss({ creator_dismissal_reason: dismissalReason });
      const message = this.intl.t('templates.protected.verified.campaigns.successful-dismiss-text');
      this.flashMessages.success(message);
      this.transitionToRoute('protected.verified.campaigns.networks.index');
    } catch (e) {
      const message = this.intl.t('global.save-error');
      this.flashMessages.danger(message);
    } finally {
      this.set('showDismissModal', false);
    }
  }),

  actions: {
    showGigForm() {
      this.transitionToRoute('protected.verified.campaigns.campaign.apply');
    },

    showDismissCampaignConfirm() {
      this._sendGoogleAnalytics('open', 'Not Interested', 'not interested');
      this.set('showDismissModal', true);
    },

    dismissCampaign(dismissalReason) {
      this.dismissCampaign.perform(dismissalReason);
    }
  }
});
