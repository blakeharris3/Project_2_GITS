/// jquery to add button after alloted time
console.log("im here ")

const $div = $("#deboard");
const timeout = window.setTimeout(()=>{
   const $form = $('#theForm');
   const $input = $("<input type='submit' value='deboard'>");
   $form.append($input)
   $div.append($form)
   
}, 12000)

