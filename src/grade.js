$(document).ready(function () {
  add_addModules_listener();
});

function ha() {
  setTimeout(() => {
    $(".input-group").each(function () {
      console.log(this);
    });
  }, 100);
}

function add_addModules_listener() {
  $("button:contains('Add Modules'):not([ysl])").attr("ysl", "ysl").click(ha);
}