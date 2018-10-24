/// jquery to add button after alloted time
console.log("im here ")

const $div = $("#deboard");
const timeout = window.setTimeout(()=>{
   const $form = $('<form method="POST" action="/auth/takeTrip"></form>');
   const $input = $("<input type='submit' value='deboard'>");
   $form.append($input)
   $div.append($form)
   
}, 12000)
