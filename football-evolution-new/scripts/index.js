
$('.second').parallax({
     imageSrc: 'images/bkgs/2.jpg',
});
$('.third').parallax({
     imageSrc: 'images/bkgs/3.jpg',
});
$('.field-img-container').parallax({
     imageSrc: 'images/bkgs/4_3.png',
});


$(document).ready(function () {
     // Add smooth scrolling to all links
     $("a").on('click', function (event) {

          // Make sure this.hash has a value before overriding default behavior
          if (this.hash !== "") {
               // Prevent default anchor click behavior
               event.preventDefault();

               // Store hash
               var hash = this.hash;

               // Using jQuery's animate() method to add smooth page scroll
               // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
               $('html, body').animate({
                    scrollTop: $(hash).offset().top
               }, 800, function () {

                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
               });
          } // End if
     });


});

$(window).scroll(function () {
     $("#pixels").text(parseInt($(this).scrollTop()));
});