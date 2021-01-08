$(document).ready(function () {
  add_editModules_listener();
  add_ModuleCards_listener();
  add_Click_listener();
});

function add_editModules_listener() {
  $("body").click(function () {
    $("button:contains('Edit MC and Title'):not([ysl])").attr('ysl', 'ysl').click(showDropdownList);
  });
}


function add_ModuleCards_listener() {
  $("body").click(function () {
    $("h3:contains('Semester ')").siblings("div").children("div[draggable]:not([ysl])").attr('ysl', 'ysl').dblclick(toggleSU).each(changeColor);
  });
}


function add_Click_listener() {
  $("body").click(function () {
    $("h3:contains('Semester ')").siblings("div").children("div[draggable]").each(changeColor);
  });
}

function toggleSU() {
  console.log($(this).find("strong").text());
  const mod_code = $(this).find("strong").text();
  if (canSU(mod_code)){
    // change colour
    updateSU(mod_code);
  }
}


function updateSU(mod_code){
  const mod_grade = getGrade(mod_code);
  // if alr sued, make it not su, update su_left
  // else if not sued and have enough su, su it and update su_left
  // else do nothing
  if (mod_grade['su']) {
    setGrade(mod_code, mod_grade['grade'], false);
    SULeft();
    console.log(mod_code+ " was un-SUed");
  } else if (SULeft() >= getMC(mod_code)) {
    setGrade(mod_code, mod_grade['grade'], true);
    SULeft();
    console.log(mod_code+ " was SUed");
  } else {
    console.log(mod_code+" not enough su");
  }
}


function changeColor() {
  getGrade($(this).find("strong").text())['su'] ? $(this).css("backgroundColor", 'red') : $(this).css("backgroundColor", "2BB34A");
}


/**
 * 
 * @param {string} mod mod code
 * @return {{grade:string, su:boolean}} mod object
 */
function getGrade(mod) {
  let ysl_data = localStorage.getItem('YSL:data');
  if (ysl_data && JSON.parse(ysl_data)[mod]) {
    ysl_data = JSON.parse(ysl_data);
    return {
      grade: ysl_data[mod]['grade'],
      su: ysl_data[mod]['su']
    };
  } else {
    return {
      grade: '',
      su: false,
    };
  }
}

/**
 * 
 * @param {string} mod mod code
 * @param {string} grade 
 * @param {boolean} su 
 */
function setGrade(mod, grade, su) {
  let ysl_data = localStorage.getItem('YSL:data');
  if (ysl_data) {
    ysl_data = JSON.parse(ysl_data);
    if (ysl_data[mod]) {
      ysl_data[mod]['grade'] = grade;
      ysl_data[mod]['su'] = su;
      localStorage.setItem('YSL:data', JSON.stringify(ysl_data));
    } else {
      ysl_data[mod] = {
        grade,
        su
      };
      localStorage.setItem('YSL:data', JSON.stringify(ysl_data));
    }
  } else {
    ysl_data = {};
    ysl_data[mod] = {
      grade,
      su
    };
    localStorage.setItem('YSL:data', JSON.stringify(ysl_data));
  }

  console.log(mod);

  // $("h3:contains('Semester ')").siblings("div").children("div[draggable]:not([ysl])").attr('ysl', 'ysl').find(":contains:" + mod).each(changeColor, console.log("debug" + $(this).find("strong").text()));
}

/**
 * 
 * @param {string} mod mod code
 * @returns {boolean} can SU?
 */
function canSU(mod) {
  const moduleBank = JSON.parse(localStorage.getItem('persist:moduleBank'));
  const modules = JSON.parse(moduleBank['modules']);
  if (!modules[mod]['attributes']) {
    return false;
  }
  return modules[mod]['attributes']['su'];
}

function updateEditModal() {
  const mod = $(".ReactModalPortal > div > div > form > h3:contains('Edit info for ')").first().text().substr('Edit info for '.length);
  const grade = getGrade(mod);
  const grade_selector = $("<div></div>").attr({
    class: "col-md-3",
  });
  let grade_selector_options = '<option' + (grade['grade'] ? '' : ' selected') + '></option>';
  for (const option_val of [
    'A+',
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'D+',
    'D',
    'F',
    'CS',
    'CU',
  ]) {
    grade_selector_options += `<option value="${option_val}"${grade['grade'] === option_val ? ' selected' : ''}>${option_val}</option>`;
  }
  grade_selector.html(
    '<label for="input-grade">Grade (optional)</label>' +
    '<select id="input-grade" class="form-control">' +
    grade_selector_options +
    '</select>'
  );
  $(".ReactModalPortal > div > div > form > .form-row > .col-md-9").attr("class", "col-md-6");
  $(".ReactModalPortal > div > div > form > .form-row").append(grade_selector);

  $(".ReactModalPortal > div > div > form > div > div > button:contains('Save')").click(function () {
    const this_grade = $('#input-grade').find(":selected").text()
    // console.log(this_grade);
    // console.log("su?", $("#su-selector-input").is(":checked"));
    setGrade(mod, this_grade, $("#su-selector-input").is(":checked"));
  });
  $(".ReactModalPortal > div > div > form > div > button:contains('Reset Info')").click(function () {
    $("#input-grade :selected").removeAttr("selected");
    $("#input-grade").val(grade['grade']).change();
  });

  addSUSelector(mod, grade['grade']);

  $('#input-grade').on('change', function () {
    // console.log(this.value);
    addSUSelector(mod, this.value);
  });
}

var total_SU = 32;

function SULeft() {
  const ysl_data = JSON.parse(localStorage.getItem('YSL:data'));
  if (!ysl_data) {
    localStorage.setItem('YSL:SUleft', total_SU);
    return total_SU;
  }
  const modules = JSON.parse(JSON.parse(localStorage.getItem('persist:moduleBank'))['modules']);
  const su_left = total_SU - Object.keys(ysl_data).reduce((acc, cur) => acc + ysl_data[cur]['su'] ? modules[cur]['moduleCredit'] : 0, 0);
  localStorage.setItem('YSL:SUleft', su_left);
  console.log('......' + su_left);
  return su_left;
}

/**
 * 
 * @param {string} mod mod code
 * @returns {number} number of MCs of the mod
 */
function getMC(mod) {
  const modules = JSON.parse(JSON.parse(localStorage.getItem('persist:moduleBank'))['modules']);
  return modules[mod]['moduleCredit'];
}

function addSUSelector(mod, grade) {
  console.log('????????')
  const su_left = SULeft();
  if (!['CS', 'CU'].includes(grade) && canSU(mod)) {
    if ($("#su-selector-div").length) {
      return;
    }
    const su_selector = $("<div></div>").attr({
      class: "col-md-2",
      id: "su-selector-div"
    });
    su_selector.html(
      '<label for="input-su" style="width: 100%; text-align: center;">SU?</label>' +
      `<input id="su-selector-input" type="checkbox" class="form-control" value="1"${getGrade(mod)['su'] ? " checked" : ""}${(su_left < getMC(mod)) && !getGrade(mod)['su'] ? ' disabled' : ''}>`
    );
    $(".ReactModalPortal > div > div > form > .form-row > .col-md-6").attr("class", "col-md-4");
    $(".ReactModalPortal > div > div > form > .form-row").append(su_selector);
  } else {
    $("#su-selector-div").remove();
    $(".ReactModalPortal > div > div > form > .form-row > .col-md-4").attr("class", "col-md-6");
  }
}

function showDropdownList() {
  setTimeout(function () {
    // console.log('new modal!!!');
    updateEditModal();
  }, 0);
}

// $('button[type=submit]').click(function () {

// });