$(document).ready(function () {

	//Initialise Grid
	var input = 64;
	//FillGrid function(below)
	FillGrid(input);
	//ChangeColor function(below)
	ChangeColor();

	//Sketch Button is Clicked
	$('#sketch').click(function(){
		$('.box').remove();
		input = parseInt(prompt('Please enter a number between 1 and 100'));
			if (input > 100) 
				{ input = 100; }
			else if (input < 1) 
				{ input = 1; }
		//Call Functions to re-fill our container
		FillGrid(input);
		ChangeColor();
	});

	//Funky Trails Button is Clicked
	$('#funky').click(function(){
		$('.box').remove();
		input = parseInt(prompt('Please enter a number between 1 and 100'));
			if (input > 100) 
				{ input = 100; }
			else if (input < 1) 
				{ input = 1; }
		//Call Functions to re-fill our container
		FillGrid(input);
		LightTrail();
	});

});


//---------------------------------------------------------
//FUNCTIONS -- These functions are called in the main body
//---------------------------------------------------------

//This creates our grid. Square <div>s of the .box class are filled into our wrapper.
function FillGrid(boxCount){
	//For loop fills the grid
	for (var i = 0; i<(boxCount*boxCount); i++) {
		$('<div/>', {
			'class'	: 'box',
		}).appendTo('#grid');
	}
	//Adjust each .box size to fit into the grid (960px)
	var boxSize = 960 / boxCount;	
	$('.box').css({
		'width' : boxSize,
		'height': boxSize
	});
}

//Change Colour Function - used in "standard" mode
function ChangeColor(){
	$('.box').mouseenter(function(){	
		$(this).addClass('box_coloured');
		$(this).mouseleave(function(){
			$(this).fadeTo('slow', 0.7);			
		});
	});
}

//Light Trails Function
function LightTrail(){
	$('.box').mouseenter(function(){
		$(this).fadeTo(100, 0);		
		// $(this).addClass('box_coloured');
		$(this).mouseleave(function(){
				$(this).fadeTo(400,1);
				$(this).css("background-color", "#142e5f");

		});
	});
}


