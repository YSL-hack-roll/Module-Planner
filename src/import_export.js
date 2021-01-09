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
    confirm('URL copied to clipboard!'); ``
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
  //        <button class="btn btn-svg btn-outline-primary" type="button">      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings</button>

  var space = $('<div class="divider"/>');
  space.appendTo($(".main-content > div > header > div"));
  export_btn.appendTo($(".main-content > div > header > div"));
  export_btn.click(exportData);

}