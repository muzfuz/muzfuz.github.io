var calculator = {

  allClear  :   function() {
    num1 = [];
    num2 = [];
    operator = null;
    $screen = $('#screen');
    $screen.html(0);
    solved = false;
  },

  formatDecimal : function(num) {
    return (num % 1 === 0) ? num : num.toFixed(3);
  },

  calculateAnswer : function(num1, num2, operator) {
    //Check to make sure that all numbers and operators exist!
    if (num1 && num2 && operator) {
      

      //Ugly code. Decides wether or not to parse numbers from array before assigning 'var n1'
      if ( Object.prototype.toString.call(num1) === '[object Array]') {
        var n1 = parseFloat(num1.join(''));
      } else {
        var n1 = num1;
      }

      var n2 = parseFloat(num2.join(''));
      var answer = null;

      switch (operator) {
        case '+':
          answer = n1 + n2;
          break;
        case '-':
          answer = n1 - n2;
          break;
        case '*':
          answer = n1 * n2;
          break;
        case '/':
          answer = n1 / n2;
          break;
        case '%':
          answer = n1 % n2;
          break;
      };
    return answer;    
    }
  }
};


$(document).ready(function(){
  //Initialise calculator
  calculator.allClear();


  // Click event for number buttons
  $('.number').on('click', function(event){
    
    if (solved) { calculator.allClear() };
    
    //Assign clicked number to variable
    clickedNumber = $(this).text();
    
    //Push clicked number into array - conditional on wether an operator is pushed.
    if (!operator) {
      num1.push(clickedNumber);
      $screen.html(num1.join(''));
    }
    else {
      num2.push(clickedNumber);
      $screen.html(num2.join(''));
    }   
  });
  
  // Click event for Operator buttons
  $('.operator').on('click', function(event){
    //Logic for continual operations:
    //If the user keeps clicking the operator without hitting equals:
    if (operator && !solved) {
      num1 = calculator.calculateAnswer(num1, num2, operator);
      num2 = []
      // solved = false;
      $screen.html(calculator.formatDecimal(num1));
    //If the user hits equals, but then wants to keep operations:
    } else if (operator && solved) {
      num1 = answer;
      num2 = [];
      solved = false;
      $screen.html(calculator.formatDecimal(num1));
    }
    //Set operator variable equal to button push
    operator = $(this).text();
    $screen.append(operator);
  });

  // Click event for Equals Button
  $('#equals').click(function() {
      answer = calculator.calculateAnswer(num1, num2, operator);
      $screen.html(calculator.formatDecimal(answer));
      num1 = [answer];
      solved = true;    
  });

  // Click event for All Clear Button
  $('#allclear').click(function(){
    calculator.allClear();
  });
});