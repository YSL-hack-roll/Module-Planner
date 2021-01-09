$(document).ready(function () {
  setTimeout(() => {
    add_button();
  }, 500);
  const url_string = window.location.href;
  const url = new URL(url_string);
  const planner = url.searchParams.get("planner");
  const ysl = url.searchParams.get("ysl");
  if (planner && ysl) {
    let import_mah = confirm('Import data?');
    if (import_mah) {
      importData();
    }
  }
});

function exportData() {
  const export_url = `https://nusmods.com/planner?planner=${localStorage.getItem('persist:planner')}&ysl=${localStorage.getItem('YSL:data')}`
  // setTimeout(() => {
  //   navigator.clipboard.writeText(export_url).then(function () {
  //     console.log('succeeded');
  //     confirm('URL copied to clipboard!');
  //   }, function () {
  //     console.log('failed');
  //   });
  // }, 1000);
  navigator.clipboard.writeText(export_url).then(function () {
    console.log('succeeded');
    confirm('URL copied to clipboard!');
  }, function () {
    console.log('failed');
  });
}

function importData() {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const planner = url.searchParams.get("planner");
  const ysl = url.searchParams.get("ysl");
  localStorage.setItem('persist:planner', planner);
  localStorage.setItem('YSL:data', ysl);
  window.location.href = '/planner';
}

function add_button() {


  var export_btn = $(`<button class="btn btn-svg btn-outline-primary" style="margin-left:8px" type="button">Export</button>`);
  var space = $('<div class="divider"/>');
  space.appendTo($(".main-content > div > header > div"));
  export_btn.appendTo($(".main-content > div > header > div"));
  export_btn.click(exportData);
}