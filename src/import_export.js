$(document).ready(function () {
  add_button();
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
  const export_url = (`https://nusmods.com/planner?planner=${encodeURIComponent(localStorage.getItem('persist:planner'))}&ysl=${encodeURIComponent(localStorage.getItem('YSL:data'))}`);
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

function populateModuleBank(mod) {
  let moduleBank = localStorage.getItem('persist:moduleBank');
  if (moduleBank) {
    moduleBank = JSON.parse(moduleBank);
  } else {
    moduleBank = {};
  }
  let modules = moduleBank['modules'];
  if (modules) {
    modules = JSON.parse(modules);
  } else {
    modules = {};
  }
  if (modules[mod]) {
    return;
  }
  const yr = new Date().getFullYear()
  const mth = new Date().getMonth();
  let ay;
  if (mth < 6) {
    ay = '' + (yr - 1) + '-' + yr;
  } else {
    ay = '' + yr + '-' + (yr + 1);
  }
  fetch(`https://api.nusmods.com/v2/${ay}/modules/${mod}.json`)
    .then(res => res.json())
    .then(data => {
      modules[mod] = data;
      moduleBank['modules'] = JSON.stringify(modules);
      moduleBank = JSON.stringify(moduleBank);
      localStorage.setItem('persist:moduleBank', moduleBank);
    });
}

function importData() {
  const url_string = (window.location.href);
  const url = new URL(url_string);
  const planner = decodeURIComponent(url.searchParams.get("planner"));
  const ysl = decodeURIComponent(url.searchParams.get("ysl"));
  localStorage.setItem('persist:planner', planner);
  localStorage.setItem('YSL:data', ysl);
  const planner_obj = JSON.parse(planner);
  const modules = Object.values(JSON.parse(planner_obj['modules'])).map(x => x['moduleCode']);
  modules.forEach(x => {
    populateModuleBank(x);
  });
  window.location.href = '/planner';
}

function add_button() {
  var export_btn = $(`<button class="btn btn-svg btn-outline-primary" style="margin-left:8px" type="button">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg svg-small"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
  Export</button>`);
  var space = $('<div class="divider"/>');
  checkExist(".main-content > div > header > div", function () {
    space.appendTo($(".main-content > div > header > div"));
    export_btn.appendTo($(".main-content > div > header > div"));
    export_btn.click(exportData);
  });
}