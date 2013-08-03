/**
 * Opens the menu when the button is clicked.
 */
$('.hamburger-button').click(function() {
  // Prevent the content from scaling while animating.
  var width = $('.hamburger-main').width();
  $('.hamburger-main').css('width', width);

  //display a layer to disable clicking and scrolling on the content while menu is shown
  // Toggle a mask on top of the content.
  $('.hamburger-mask').css('display', 'block');

  //disable all scrolling on mobile devices while menu is shown
  $('.hamburger-container').bind('touchmove', function(e) {
      e.preventDefault()
  });

  //set margin for the whole container with a jquery UI animation
  $('.hamburger-menu').css('display', 'block');
  $('#hamburger-container').animate({
      'marginLeft': ['70%']
  }, {
    duration: 300
  });
});


/**
 * Closes the menu when the mask is clicked.
 */
$('.hamburger-mask').click(function() {
    $('.hamburger-container').unbind('touchmove');
    //set margin for the whole container back to original state with a jquery UI animation
    $('.hamburger-container').animate({'marginLeft': ['0']}, {
        duration: 300,
        complete: function() {
            $('.hamburger-menu').css('display', 'none');
            $('.hamburger-main').css('width', 'auto');
            $('.hamburger-mask').css('display', 'none');
        }
    });
});
