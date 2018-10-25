/// jquery to add button after alloted time
console.log("im here ")

const $div = $("#deboard");
<<<<<<< HEAD
const timeout = window.setTimeout(() => {
    const $form = $('#theForm');
    const $input = $("<input type='submit' value='deboard'>");
    $form.append($input)
    $div.append($form)

=======
const timeout = window.setTimeout(()=>{
   const $form = $('#theForm');
   const $input = $("<input type='submit' value='deboard'>");
   $form.append($input)
   $div.append($form)
   
>>>>>>> ccbc578e63457777cb67a8e6eaa06da1c08b3bf8
}, 12000)

