$(document).ready(function () {
  add_addModules_listener();
  checkEditModal();
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
    console.log(this_grade);
    setGrade(mod, this_grade, false);
  });
  $(".ReactModalPortal > div > div > form > div > button:contains('Reset Info')").click(function () {
    $("#input-grade :selected").removeAttr("selected");
    $("#input-grade").val(grade['grade']).change();
  });
}

function checkEditModal() {
  let last = $(".ReactModalPortal > div > div > form > h3:contains('Edit info for ')").length;
  setTimeout(function () {
    const has_modal = $(".ReactModalPortal > div > div > form > h3:contains('Edit info for ')").length;
    if (has_modal && !last) {
      console.log('new modal!');
      updateEditModal();
    }
    last = has_modal;
    checkEditModal();
  }, 200);
}

// $('button[type=submit]').click(function () {

// });