const addResourceBtn = document.querySelector('#addResourceBtn');
const resourceTable = document.querySelector('#tableBody')
let rowNum = 0;

const srcName = document.querySelector('#srcInput')
const urlInput = document.querySelector('#urlInput')
const ratingInput = document.querySelector('#ratingInput')
const tagInput = document.querySelector('#tagInput')
const descInput = document.querySelector('#descInput')

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
        `<tr> 
            <th scope="row">${rowNum}</th>
            <td>${source}</td>
            <td><a href="${url} target="_blank">${getParam(url)}</a></td>
            <td>${rating}</td>
            <td>${tag}</td>
            <td>${description}</td>
        </tr>
        `

        resourceTable.innerHTML += template;
        } alert("This URL is invalid. Try copy & pasting the URL.")
})