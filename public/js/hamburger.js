/**
 * Opens the menu when the button is clicked.
 */
$('.hamburger-button').click(function() {
  // Prevents the content from scaling while animating.
  var width = $('.hamburger-main').width();
  $('.hamburger-main').css('width', width);

  // Toggle a mask on top of the content.
  $('.hamburger-mask').css('display', 'block');

  // Disables scrolling on mobile devices when the menu is shown.
  $('.hamburger-container').bind('touchmove', function(e) {
    e.preventDefault()
  });

  // Sets the margin for the container.
  $('.hamburger-menu').css('display', 'block');
  $('#hamburger-container').animate({
    'marginLeft': ['70%']
  }, {
    duration: 300
  });
});


Hamburger = {}


Hamburger.close = function() {
  $('.hamburger-container').unbind('touchmove');
  $('.hamburger-container').animate({'marginLeft': ['0']}, {
    duration: 300,
    complete: function() {
        $('.hamburger-menu').css('display', 'none');
        $('.hamburger-main').css('width', 'auto');
        $('.hamburger-mask').css('display', 'none');
    }
  });
}


/**
 * Closes when a menu item is clicked.
 */
$('.hamburger-menu').on('click', 'a', Hamburger.close);


/**
 * Closes the menu when the mask is clicked.
 */
$('.hamburger-mask').click(Hamburger.close);
