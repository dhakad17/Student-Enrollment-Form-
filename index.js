console.log("hello ")
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "SCHOOL-DB";
var StdRelationName = "STUDENT-TABLE";
var connToken = "90932336|-31949271605230858|90953829";

$("#rollno").focus();

function resetForm() {
    $("#rollnumber").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#dob").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");
    $("#rollnumber").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#rollnumber").focus();
}


function validate() {
    console.log("validate run");
    var rollno, stdname, clas, dob, address, enrolldate;
    rollno = $("#rollnumber").val();
    stdname = $("#fullname").val();
    clas = $("#class").val();
    dob = $("#dob").val();
    address = $("#address").val();
    enrolldate = $("#enrollmentdate").val();
    console.log(rollno + " " + stdname + " ");
    if (rollno === "") {
        alert("Student Roll NO missing");
        $("#rollno").focus();
        return "";
    }

    if (stdname === "") {
        alert("Student Name is missing");
        $("#fullname").focus();
        return "";
    }

    if (clas === "") {
        alert("Student Class is missing");
        $("#class").focus();
        return "";
    }

    if (dob === "") {
        alert("Student DOB missing");
        $("#dob").focus();
        return "";
    }

    if (address === "") {
        alert("Student Address missing");
        $("#address").focus();
        return "";
    }

    if (enrolldate === "") {
        alert("Student Enrollment Date is missing");
        $("#enrollmentdate").focus();
        return "";
    }

    var jsonStrObj = {
        rollno: rollno,
        stdname: stdname,
        clas: clas,
        dob: dob,
        address: address,
        enrolldate: enrolldate

    };
    console.log(JSON.stringify(jsonStrObj));
    return JSON.stringify(jsonStrObj);


}


function saveData() {
    var jsonStrObj = validate();

    if (jsonStrObj === '')
        return "";

    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, StdRelationName)
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $('#rollnumber').focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChng = validate();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChng, stdDBName, StdRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#rollno").focus();
}
function getStudentAsJsonObj() {
    var rollno = $("#rollnumber").val();
    console.log(rollno);
    var jsonStr = {
        rollno: rollno
    };
    
    return JSON.stringify(jsonStr);
}
function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);

}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    console.log(record);
    $("#fullname").val(record.stdname);
    $("#class").val(record.clas);
    $("#dob").val(record.dob);
    $("#address").val(record.address);
    $("#enrollmentdate").val(record.enrolldate);
   
    

}

function getStudent() {
    var stdRollJsonObj = getStudentAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, StdRelationName, stdRollJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    if (resJsonObj.status === 400) {
        console.log("false is runnign")
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    }
    else if (resJsonObj.status == 200) {

        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disbaled", false);
        $("#fullname").focus();

    }
}