var mods_taken_raw = JSON.parse(localStorage.getItem('persist:planner'));
var all_mods_info_raw = JSON.parse(localStorage.getItem('persist:moduleBank'));
var mods_taken_grade = JSON.parse(localStorage.getItem('YSL:data'));

var modcodes_array = get_modcodes_array(mods_taken_raw);
var mods_taken_info_cap = get_mods_taken_info(modcodes_array);
function get_modcodes_array(mods_taken_raw) {
    let res = [];
    let mods_taken = JSON.parse(mods_taken_raw['modules']);
    for (let key in mods_taken) {
        
        let mod_code = mods_taken[key]['moduleCode'];
        res.push(mod_code);
        
    }
    return res;
}

function get_mods_taken_info(modcodes_array) {
    let res = {};
    let all_mods_info = JSON.parse(all_mods_info_raw['modules']);
    for (let i = 0; i < modcodes_array.length; i++) {
        let mod_code = modcodes_array[i];
        let mc, grade, su;
        if (all_mods_info.hasOwnProperty(mod_code)) {
            mc = all_mods_info[mod_code]['moduleCredit'];
        } else {
            console.log('Error: CAP calculator, no MC info for' + mod_code);
            mc = 0;
        }
        if (mods_taken_grade.hasOwnProperty(mod_code)) {
            grade = mods_taken_grade[mod_code]['grade'];
            su = mods_taken_grade[mod_code]['su'];
        } else {
            grade = 'NA';
            su = false;
        }
        res[mod_code] = {
            mc, 
            grade,
            su
        }
    }
    return res;
}