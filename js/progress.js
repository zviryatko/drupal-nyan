(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Theme function for the nyan cat star.
   *
   * @param {string} id
   *   The id for the star.
   *
   * @return {string}
   *   The HTML for the progress bar.
   */
  Drupal.theme.nyanCatStar = function (id) {
    var output = '<div class="star starMovement' + id + '">';
    for (var i = 1; i <= 8; i++) {
      output += '<div number="' + i + '"></div>';
    }
    output += '</div>';
    return output;
  };

  /**
   * Theme function for the nyan cat.
   *
   * @param {string} star_number
   *   The number of the star.
   *
   * @return {string}
   *   The HTML for the progress bar.
   */
  Drupal.theme.nyanCat = function (star_number) {
    var stars = '';
    for (var i = 1; i <= star_number; i++) {
      stars += Drupal.theme('nyanCatStar', i);
    }
    return '<div id="nyanContainer">' +
      '<div id="nyanCat"><div id="wholeHead"><div class="skin ear"></div><div class="skin ear rightEar"></div><div id="mainHead" class="skin"><div class="eye"></div><div class="eye rightEye"></div><div class="nose"></div><div class="chick"></div><div class="chick rightChick"></div><div class="mouth">E</div></div></div><div id="toastBody"><div>&nbsp;  &nbsp; &nbsp;.&nbsp;&nbsp;.&nbsp; &nbsp; &nbsp;..&nbsp;  &nbsp; &nbsp;.&nbsp;.&nbsp; &nbsp; &nbsp;&nbsp&nbsp&nbsp;..&nbsp;  &nbsp; &nbsp;.&nbsp;&nbsp;.</div></div><div id="wholeTail"><div class="tail skin"></div><div class="tail middleTail skin"></div><div class="tail backTail skin"></div></div><div id="allYourLegAreBelongToUs"><div class="skin leg back leftBack"></div><div class="skin leg back"></div><div class="skin leg front leftFront"></div><div class="skin leg front"></div></div><div class="rainbow-container"><div class="rainbow odd"></div><div class="rainbow even"></div></div></div>' +
      '<div class="star-container">' + stars + '</div>' +
      '</div>';
  };

  var prototype = Drupal.ProgressBar.prototype;
  Drupal.ProgressBar = function (id, updateCallback, method, errorCallback) {
    this.id = id;
    this.method = method || 'GET';
    this.updateCallback = function (percentage, message, progressBar) {
      // Set progress for Nyan container.
      $('#nyanContainer', this.element).css('left', percentage + '%');
      var rainbow = $('.rainbow');
      var width = rainbow.first().width();
      var rainbowOffset = rainbow.offset();
      if (rainbowOffset !== undefined) {
        var number = Math.round(rainbowOffset.left / width);
        for (var i = 0; i <= number; i++) {
          var length = $('.rainbow').length;
          var offset = (length + 1) * width * -1 + length * 5;
          var item = rainbow.first().clone();
          item.addClass(i % 2 === 0 ? 'even' : 'odd');
          item.removeClass(i % 2 === 0 ? 'odd' : 'even');
          $('.rainbow-container').append(item.css('left', offset));
        }
      }
      if (updateCallback) {
        updateCallback(percentage, message, progressBar);
      }
    };
    this.errorCallback = errorCallback;

    this.element = $(Drupal.theme('progressBar', id));
    this.element.find('.progress__track').replaceWith($(Drupal.theme('nyanCat', 5)));

    // Add an ID to the body for styling purposes.
    $('body').addClass('nyan');

    // Add in the audio if it is enabled.
    if (drupalSettings.nyan.audio.enabled === 1) {
      $('body').append('<audio loop="loop" autoplay="true" id="nyanaudio">' +
        '<source src="' + drupalSettings.nyan.audio.mp3 + '" type="audio/mpeg">' +
        '<source src="' + drupalSettings.nyan.audio.ogg + '" type="audio/ogg">' +
        '</audio>');

      // Add controls if needed.
      if (drupalSettings.nyan.audio.show_controls === 1) {
        document.getElementById('nyanaudio').controls = 'true';
      }

      // Change the volume, as it sounds a bit messy at full volume.
      document.getElementById('nyanaudio').volume = drupalSettings.nyan.audio.initial_volume / 100;
    }
  };
  Drupal.ProgressBar.prototype = prototype;
})(jQuery, window.Drupal, window.drupalSettings);
