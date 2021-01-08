$(document).ready(function () {
    add_button();
});


function add_button() {
    var $calculate = $('<button class="btn btn-svg btn-outline-primary" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Calculate</button>');
    $calculate.appendTo($(".main-content > div > header"));
}



// calculate the cap of the semester
function calculate_cap(courses) {
    var LOOKUP = {'A+':5.0, 'A':5.0, 'A-':4.5, 'B+':4.0, 'B':3.5, 'B-':3.0, 'C+':2.5, 'C': 2.0, 'D+':1.5, 'D':1.0, 'F': 0};
    var total_mc = 0;
    var total_grade_sum = 0;

    for (const course in courses) {
      if (courses[course]['su'] === true || courses[course]['grade'] === "CS" || courses[course]['grade'] === "NA") {
          continue;
      } else {
        var point = LOOKUP[courses[course]['grade']];
        var mc = courses[course]['mc'];
        total_mc += mc;
        total_grade_sum += point * mc;
      }
    }

    var cap = 0.0; // cap is 0.0 by default

    if (total_mc === 0 || total_grade_sum === 0) {
        cap = 0.0;
    } else {
        cap = total_grade_sum / total_mc;
    }
    return cap;
}


// calculate the remaining sus
function calculate_remaining_su(courses) {
    var su = 32; // sus are 32 by default
    var su_used = 0;

    for (const course in courses) {
        if (courses[course]['su'] === true) {
            su_used += courses[course]['mc'];
            su -= su_used;
        }
    }

    if (su < 0) {
        throw new Error("You have overused your SUs");
    }

    return su;
}

