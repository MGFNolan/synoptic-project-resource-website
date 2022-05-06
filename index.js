const database = require("./database.js");

const addResourceBtn = document.querySelector('#addResourceBtn');
const tabBody = document.querySelector('#tableBody');
const resourceTab = document.querySelector('#resourceTable');
let rowNum = tabBody.childElementCount;

const srcName = document.querySelector('#srcInput');
const urlInput = document.querySelector('#urlInput');
const ratingInput = document.querySelector('#ratingInput');
const tagInput = document.querySelector('#tagInput');
const descInput = document.querySelector('#descInput');

//URL EXTRACTION
const getParam = (url) => {
    let parameter = new URL(url)
    return parameter.hostname;
}

//ADDING A RESOURCE
addResourceBtn.addEventListener('click', (e) => {
    
    // prevent default form submit if valid, otherwise, not prevent default behaviour so the HTML5 validation behaviour can take place
    if(document.getElementById("addSourceForm").checkValidity()){
        e.preventDefault();
        const url = urlInput.value;    
        const source = srcName.value;
        const rating = ratingInput.value;
        const tag = tagInput.value;
        const description = descInput.value;
        let valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url)

        //Wouldn't it be great to run this validation onBlur? Might be an option...
        //URL VALIDATION
        if(valid) {
            rowNum += 1; //you'd normally get this ID from the DB
            //addSrcDb(source, url, rating, tag, description);
            const template = nonEditableRow(rowNum, source, url, rating, tag, description);
            tabBody.innerHTML += template;
            document.getElementById("addSourceForm").reset(); //reset the fields in the form
            } 
        else { 
            //change text inside modal dialog
            document.getElementById('errText').innerHTML = "This URL is invalid. Try copy & pasting the URL.";
            //create modal 
            var errorModal = new bootstrap.Modal(document.getElementById('errModal'));
            //show the modal
            errorModal.show();
        }
    }
})

//we have split this out as we'll be reusing it
function nonEditableRow(rowNum, source, url, rating, tag, description){
    return `<tr data-row-id="${rowNum}"> 
    <td id="rn_${rowNum}">${rowNum}</td>
    <td id="src_${rowNum}">${source}</td>
    <td id="url_${rowNum}"><a href="${url}" target="_blank">${getParam(url)}</a></td>
    <td id="rtg_${rowNum}">${rating}</td>
    <td id="tag_${rowNum}">${tag}</td>
    <td id="desc_${rowNum}">${description}</td>
    <td><button type="button" class="btn btn-danger col" id="delResourceBtn">Delete</button>
    <button type="button" class="btn btn-warning" id="editResourceBtn">Edit</button></td>
</tr>`;
}

//this is our editable row, we just need to pass the parameters to it
//QUESTION - HOW DO WE DO VALIDATION ON EDITING?????
function editableRow(rowNum, source, url, rating, tag, description){
    return `<tr data-row-id="${rowNum}"> 
    <td>${rowNum}</td>
    <td><input type="text" class="form-control">${source}</input></td>
    <td><input type="text" class="form-control">${url}</input></td>
    <td><input type="text" class="form-control">${rating}</input></td>
    <td><input type="text" class="form-control">${tag}</input></td>
    <td><input type="text" class="form-control">${description}</input></td>
    <td><button type="button" class="btn btn-danger col" id="cancelResourceBtn">Cancel</button>
    <button type="button" class="btn btn-warning" id="saveResourceBtn">Save</button></td>
</tr>`;
}

//REMOVE OR EDIT A SOURCE
resourceTab.addEventListener('click', (e) => {
    //CHANGED to use the element id rather than class
    //because id is supposed to be unique, we could always append the
    //rowNum to the ID, and check with "startsWith" rather than ==
    //but this is good enough for now

    const btn = e.target;

    switch(e.target.getAttribute("id")){
        case 'delResourceBtn':
            btn.closest('tr').remove();
            rowNum -= 1;
            break;
        case 'editResourceBtn':
            var fullRow = btn.closest('tr');
            var rowId = fullRow.getAttribute('data-row-id'); //data attributes are very useful...
            btn.closest('tr').innerHTML = editableRow(rowId,"","","","",""); //need to populate with the right values we get from the row....
            break;
        case 'cancelResourceBtn':
            //HOW DO WE CANCEL? DO WE NEED TO STORE THE DATA FROM EDIT AND REVERT?
            //QUESTIOn - WHAT HAPPENS IF WE HAVE MANY ROWS EDITING AT THE SAME TIME?.....
            break;
        case 'saveResourtceBtn':
            //NEED TO SAVE HERE
            break;
        default:
            return;
    }
})