// const database = require("./database.js");

const addResourceBtn = document.querySelector("#addResourceBtn");
const tabBody = document.querySelector("#tableBody");
const resourceTab = document.querySelector("#resourceTable");
let rowId = tabBody.childElementCount;

const srcName = document.querySelector("#srcInput");
const urlInput = document.querySelector("#urlInput");
const ratingInput = document.querySelector("#ratingInput");
const tagInput = document.querySelector("#tagInput");
const descInput = document.querySelector("#descInput");

//URL EXTRACTION
const getParam = (url) => {
  let parameter = new URL(url);
  return parameter.hostname;
};

//ADDING A RESOURCE
addResourceBtn.addEventListener("click", (e) => {
  // prevent default form submit if valid, otherwise, not prevent default behaviour so the HTML5 validation behaviour can take place
  if (document.getElementById("addSourceForm").checkValidity()) {
    e.preventDefault();
    const url = urlInput.value;
    const source = srcName.value;
    const rating = ratingInput.value;
    const tag = tagInput.value;
    const description = descInput.value;
    let valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);

    //Wouldn't it be great to run this validation onBlur? Might be an option...
    //URL VALIDATION
    if (valid) {
      const template = nonEditableRow(
        rowId,
        source,
        url,
        rating,
        tag,
        description
      );
      tabBody.innerHTML += template;
      postSource(source, url, rating, tag, description);
      document.getElementById("addSourceForm").reset(); //reset the fields in the form
    } else {
      //change text inside modal dialog
      document.getElementById("errText").innerHTML =
        "This URL is invalid. Try copy & pasting the URL.";
      //create modal
      var errorModal = new bootstrap.Modal(document.getElementById("errModal"));
      //show the modal
      errorModal.show();
    }
  }
});

//we have split this out as we'll be reusing it
function nonEditableRow(rowId, source, url, rating, tag, description) {
  return `<tr data-row-id="${rowId}" data-row-src="${source}" data-row-url="${url}" data-row-rating="${rating}" data-row-tag="${tag}" data-row-desc="${description}"> 
    <td id="rn_${rowId}">${rowId}</td>
    <td id="src_${rowId}">${source}</td>
    <td id="url_${rowId}"><a href="${url}" target="_blank">${getParam(
    url
  )}</a></td>
    <td id="rtg_${rowId}">${rating}</td>
    <td id="tag_${rowId}">${tag}</td>
    <td id="desc_${rowId}">${description}</td>
    <td><button type="button" class="btn btn-danger col" id="delResourceBtn">Delete</button>
    <button type="button" class="btn btn-warning" id="editResourceBtn">Edit</button></td>
</tr>`;
}

//this is our editable row, we just need to pass the parameters to it
//QUESTION - HOW DO WE DO VALIDATION ON EDITING?????
function editableRow(rowId, source, url, rating, tag, description) {
  return `<tr data-row-id="${rowId}"> 
    <td>${rowId}</td>
    <td><input id="source${rowId}" type="text" class="form-control" value="${source}"></input></td>
    <td><input id="url${rowId}" type="text" class="form-control" value="${url}"></input></td>
    <td><input id="rating${rowId}" type="text" class="form-control" value="${rating}"></input></td>
    <td><input id="tag${rowId}" type="text" class="form-control" value="${tag}"></input></td>
    <td><input id="description${rowId}" type="text" class="form-control" value="${description}"></input></td>
    <td><button type="button" class="btn btn-danger col" id="cancelResourceBtn">Cancel</button>
    <button type="button" class="btn btn-warning" id="saveResourceBtn">Save</button></td>
</tr>`;
}

//REMOVE OR EDIT A SOURCE
resourceTab.addEventListener("click", (e) => {
  const btn = e.target;

  switch (e.target.getAttribute("id")) {
    case "delResourceBtn":
      const fullRowDel = btn.closest("tr");
      const rowIdDel = fullRowDel.getAttribute("data-row-id");
      delSource(rowIdDel);
      btn.closest("tr").remove();
      break;
    case "editResourceBtn":
      const fullRowUpd = btn.closest("tr");
      const rowIdUpd = fullRowUpd.getAttribute("data-row-id");
      sessionStorage.setItem("id", rowIdUpd);

      const srcUpd = fullRowUpd.getAttribute("data-row-src");
      sessionStorage.setItem("source", srcUpd);

      const urlUpd = fullRowUpd.getAttribute("data-row-url");
      sessionStorage.setItem("url", urlUpd);

      const ratingUpd = fullRowUpd.getAttribute("data-row-rating");
      sessionStorage.setItem("rating", ratingUpd);

      const tagUpd = fullRowUpd.getAttribute("data-row-tag");
      sessionStorage.setItem("tags", tagUpd);

      const descUpd = fullRowUpd.getAttribute("data-row-desc");
      sessionStorage.setItem("description", descUpd);

      btn.closest("tr").innerHTML = editableRow(
        rowIdUpd,
        srcUpd,
        urlUpd,
        ratingUpd,
        tagUpd,
        descUpd
      );
      break;
    case "cancelResourceBtn":
      const rowIdCancel = sessionStorage.getItem("id");
      const srcCancel = sessionStorage.getItem("source");
      const urlCancel = sessionStorage.getItem("url");
      const ratingCancel = sessionStorage.getItem("rating");
      const tagCancel = sessionStorage.getItem("tags");
      const descCancel = sessionStorage.getItem("description");

      btn.closest("tr").innerHTML = nonEditableRow(
        rowIdCancel,
        srcCancel,
        urlCancel,
        ratingCancel,
        tagCancel,
        descCancel
      );
      sessionStorage.clear();
      break;
    case "saveResourceBtn":
      const fullRowSave = btn.closest("tr");
      const rowIdSave = fullRowSave.getAttribute("data-row-id");
      console.log(rowIdSave);
      const srcInputSave = document.querySelector(`#source${rowIdSave}`).value;
      const urlInputSave = document.querySelector(`#url${rowIdSave}`).value;
      const ratingInputSave = document.querySelector(
        `#rating${rowIdSave}`
      ).value;
      const tagInputSave = document.querySelector(`#tag${rowIdSave}`).value;
      const descInputSave = document.querySelector(
        `#description${rowIdSave}`
      ).value;

      btn.closest("tr").innerHTML = nonEditableRow(
        rowIdSave,
        srcInputSave,
        urlInputSave,
        ratingInputSave,
        tagInputSave,
        descInputSave
      );

      updateSource(
        srcInputSave,
        urlInputSave,
        ratingInputSave,
        tagInputSave,
        descInputSave,
        rowIdSave
      );

      break;
    default:
      return;
  }
});

async function postSource(source, url, rating, tag, description) {
  const response = await fetch("http://localhost:3000/item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: source,
      url: url,
      rating: rating,
      tag: tag,
      description: description,
    }),
  });
  const text = await response.json();
  console.log(text);
}

async function delSource(id) {
  const response = await fetch(`http://localhost:3000/item/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const text = await response.json();
  console.log(text);
}

async function updateSource(source, url, rating, tag, description, id) {
  const response = await fetch(`http://localhost:3000/item/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: source,
      url: url,
      rating: rating,
      tag: tag,
      description: description,
      id: id,
    }),
  });
  const text = await response.json();
  console.log(text);
}

document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("http://localhost:3000/list", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const text = await response.json();
  console.log(text);

  for (i = 0; i < text.length; i++) {
    rowId = text[i].id;
    source = text[i].source_name;
    url = text[i].url;
    rating = text[i].rating;
    tag = text[i].tags;
    description = text[i].description;

    const template = nonEditableRow(
      rowId,
      source,
      url,
      rating,
      tag,
      description
    );
    tabBody.innerHTML += template;
  }
});
