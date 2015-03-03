$(function() {

	var transitionTime = 4000,
		transitionSpeed = 400;

	var images = $('#slides').children('li'),
		dots = $('#dots').children('li'),
		lastElem = images.length-1,
		autoRotate,
		imageIndex;


	//On load - hide all images, show the first. Add .active class to first dot.
	dots.first().addClass('active');
	images.hide().first().show();

	//We assign the Dot's index to imageIndex, since this will always be identical to the <li>image</li> index value.
	$('#button-next').on('click', function() {
		imageIndex = $('ul#dots li.active').index();
		imageIndex === lastElem ? imageIndex = 0 : imageIndex = imageIndex + 1;
		nextSlide(imageIndex)
	});

	$('#button-prev').on('click', function() {
		imageIndex = $('ul#dots li.active').index();
		imageIndex === 0 ? imageIndex = lastElem : imageIndex = imageIndex - 1;
		nextSlide(imageIndex); 
	});

	//Make the dots clickable
	dots.on('click', function(){
		if (!$(this).hasClass('active')) {
			imageIndex = $(this).index();
			nextSlide(imageIndex);
		}
	});

	// --------------------------
	// Recursive rotator function
	// --------------------------

	function nextSlide(nextIndex) {
		//nextIndex value is passed to both the image <li> and dot <li> items.
		images.fadeOut(transitionSpeed).eq(nextIndex).fadeIn(transitionSpeed);
		dots.removeClass('active').eq(nextIndex).addClass('active');

		//Resets timeout function every time nextSlide is called
		clearTimeout(autoRotate);
		//Recursively rotate image forever.
		autoRotate = setTimeout(function() {
						nextIndex === lastElem ? nextSlide(0) : nextSlide(nextIndex + 1)
						}, transitionTime );
	}

	//Run the function on load
	nextSlide(0);
});

// Code adapted from this stack overflow thread:
// http://stackoverflow.com/questions/12608356/how-to-build-simple-jquery-image-slider-with-sliding-or-opacity-effect