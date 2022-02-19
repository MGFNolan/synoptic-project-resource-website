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
addResourceBtn.addEventListener('click', () => {
    const url = urlInput.value;    
    const source = srcName.value;
    const rating = ratingInput.value;
    const tag = tagInput.value;
    const description = descInput.value;
    let valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url)
    
    //URL VALIDATION
    if(valid) {
        rowNum += 1;

        const template = 
        `<tr id="tabRow"> 
            <th scope="row">${rowNum}</th>
            <td>${source}</td>
            <td><a href="${url} target="_blank">${getParam(url)}</a></td>
            <td>${rating}</td>
            <td>${tag}</td>
            <td>${description}</td>
            <td><button type="button" class="btn btn-danger delResourceBtn">Delete</button>
            <button type="button" class="btn btn-warning editResourceBtn">Edit</button></td>
        </tr>
        `

        tabBody.innerHTML += template;
        } else { alert("This URL is invalid. Try copy & pasting the URL.")
    }
})

//REMOVE A SOURCE
resourceTab.addEventListener('click', (e) => {
    if(!e.target.classList.contains('delResourceBtn')) {
        return;
    }
    const btn = e.target;
    btn.closest('tr').remove();
    rowNum -= 1;
})