<?php

namespace Drupal\nyan\Form;

use Drupal\Core\Batch\BatchBuilder;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class NyanSettingsForm.
 */
class NyanSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['nyan.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'nyan_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('nyan.settings');
    $form['audio'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Audio'),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    ];
    $form['audio']['audio_enabled'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Audio Enabled'),
      '#default_value' => $config->get('audio_enabled'),
    ];
    $form['audio']['audio_show_controls'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show controls'),
      '#default_value' => $config->get('audio_show_controls'),
      '#states' => [
        'visible' => [
          ':input[name="audio_enabled"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['audio']['audio_initial_volume'] = [
      '#type' => 'select',
      '#title' => $this->t('Initial volume'),
      '#description' => $this->t('If you prefer the initial volume louder or quieter, you can set it here.'),
      '#options' => [
        '10' => $this->t('10%'),
        '20' => $this->t('20%'),
        '30' => $this->t('30%'),
        '40' => $this->t('40%'),
        '50' => $this->t('50%'),
        '60' => $this->t('60%'),
        '70' => $this->t('70%'),
        '80' => $this->t('80%'),
        '90' => $this->t('90%'),
        '100' => $this->t('100%'),
      ],
      '#default_value' => $config->get('audio_initial_volume'),
      '#states' => [
        'visible' => [
          ':input[name="audio_enabled"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="audio_enabled"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['test_time'] = [
      '#type' => 'number',
      '#title' => $this->t('Preview testing time'),
      '#default_value' => 10,
      '#description' => $this->t('Number of seconds to test.'),
      '#step' => 1,
      '#min' => 1,
      '#max' => 100,
    ];

    $form['actions']['preview'] = [
      '#type' => 'submit',
      '#value' => $this->t('Preview'),
      '#submit' => ['::testProgressBar'],
      '#weight' => 2,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * Submit handler for progress bar test preview.
   *
   * @param array $form
   *   Submitted form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   Submitted form state.
   */
  public function testProgressBar(array &$form, FormStateInterface $form_state) {
    $batch_builder = (new BatchBuilder)->setTitle($this->t('Batch test'));
    for ($i = 0; $i <= $form_state->getValue('test_time', 10); $i++) {
      $batch_builder->addOperation([$this, 'batchTestSleep']);
    }
    batch_set($batch_builder->toArray());
  }

  /**
   * Test batch operation.
   */
  public function batchTestSleep() {
    sleep(1);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('nyan.settings')
      ->set('audio_enabled', $form_state->getValue('audio_enabled'))
      ->set('audio_show_controls', $form_state->getValue('audio_show_controls'))
      ->set('audio_initial_volume', $form_state->getValue('audio_initial_volume'))
      ->save();

    Cache::invalidateTags(['library_info']);
  }

}
