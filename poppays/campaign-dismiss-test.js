import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { click, currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import setupSocialNetworks from 'creators-web-app/tests/helpers/setup-social-networks';
import setupEmberIntl from 'creators-web-app/tests/helpers/setup-ember-intl';
import { percySnapshot } from 'ember-percy';
import { Response } from 'ember-cli-mirage';

module('Acceptance | Visual | Campaign dismiss', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupSocialNetworks(hooks);
  setupEmberIntl(hooks);

  hooks.beforeEach(function() {
    server.create('user', 'withPinterestIdentity');

    return authenticateSession(this.application);
  });

  test('clicking "Not Interested" shows the confirm modal', async function(assert) {
    const campaign = server.create('campaign');

    await visit(`/campaigns/${campaign.id}`);
    await click('[data-test-dismiss]');

    assert.dom('.ember-modal-overlay').exists();

    percySnapshot(assert);
  });

  test('clicking "Not Interested" redirects to the campaigns list', async function(assert) {
    const campaign = server.create('campaign');

    await visit(`/campaigns/${campaign.id}`);
    await click('[data-test-dismiss]');
    await click('.radio-options__option input[value="other"]');
    await click('[data-test-form-action="modal-confirm"]');

    assert.equal(currentURL(), '/');

    percySnapshot(assert);
  });

  test('when an error occurs the modal closes and a message is displayed', async function(assert) {
    const campaign = server.create('campaign');
    const url = `/campaigns/${campaign.id}`;

    server.put('/user/campaigns/:id/dismiss', (schema, request) => {
      return new Response(500);
    });

    await visit(url);
    await click('[data-test-dismiss]');
    await click('.radio-options__option input[value="other"]');
    await click('[data-test-form-action="modal-confirm"]');

    assert.equal(currentURL(), url);
    assert.dom('.ember-modal-overlay').doesNotExist();
    assert.dom('.flash-message').exists();

    percySnapshot(assert);
  });

  module('pricing reason', function() {
    test('when fixedCost is present', async function(assert) {
      const campaign = server.create('campaign', {
        fixedCost: 1234,
        suggestedBid: null
      });

      await visit(`/campaigns/${campaign.id}`);
      await click('[data-test-dismiss]');

      assert.dom('.radio-options__option input[value="price"]').exists();

      percySnapshot(assert);
    });

    test('when suggestedBid is present', async function(assert) {
      const campaign = server.create('campaign', {
        fixedCost: null,
        suggestedBid: 1234
      });

      await visit(`/campaigns/${campaign.id}`);
      await click('[data-test-dismiss]');

      assert.dom('.radio-options__option input[value="price"]').exists();

      percySnapshot(assert);
    });

    test('without suggestedBid and fixedCost', async function(assert) {
      const campaign = server.create('campaign', {
        fixedCost: 0,
        suggestedBid: 0
      });

      await visit(`/campaigns/${campaign.id}`);
      await click('[data-test-dismiss]');

      assert.dom('.radio-options__option input[value="price"]').doesNotExist();

      percySnapshot(assert);
    });
  });
});
