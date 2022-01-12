import data from "./loanProducts.json" assert { type: "json" };

const products = [];
let productsCheck = false;
let activeElementList = "";
let activeElementChangeFor = "";


const loanList = document.getElementById("product-item");
const buttonList = document.getElementById("btn-create-product");

// 1get data from json
const copyData = new Promise((res, rej) => {
  res(JSON.parse(JSON.stringify(data)));
})
  .then(
    (data) => data.forEach((el) => products.push(el)),
    (productsCheck = true)
  )
  .then((data) => insertData(products))
  // .then(()=>products.push(data))
  // .then(dt=>validateStore())
  .catch((e) => console.log(e));

// 2 insert data from json function to html
function insertData(data) {
  let productName = document.getElementById("product-item");
  for (let i = 0; i < data.length; i++) {
    let div = document.createElement("div");
    div.innerHTML = ` <div id="${data[i]["Loan-name"]}" class="product-item">
            <h6 class="item-title">${data[i]["Loan-name"]}</h6>
            <p class="item-date">${
              new Date().toJSON().slice(0, 10) || "or whatever date needs"
            }</p>
        </div>`;
    productName.appendChild(div);
  }

  validateProducts();
}

// 3 validate difference between el inside html and data to clear old el products or delete
function validateProducts() {
  const store = Array.from(document.querySelectorAll(".product-item")).map(
    (el) => el.id
  );
  const loanCheck = products.map((el) => {
    return el["Loan-name"];
  });
  for (let i = 0; i < store.length; i++) {
    if (!loanCheck.includes(store[i])) {
      let el = document.getElementById(store[i]);
      el.remove();
    }
  }
}

// 4 check difference between store(for new element) and push it to html
function validateStore() {
  const store = Array.from(document.querySelectorAll(".product-item")).map(
    (el) => el.id
  );
  const loanProducts = products.map((el) => {
    return el["Loan-name"];
  });
  let productName = document.getElementById("product-item");
  for (let i = 0; i < loanProducts.length; i++) {
    if (!store.includes(loanProducts[i])) {
      let div = document.createElement("div");
      div.innerHTML = ` <div id="${
        products[i]["Loan-name"]
      }" class="product-item">
            <h6 class="item-title">${products[i]["Loan-name"]}</h6>
            <p class="item-date">${
              new Date().toJSON().slice(0, 10) || "or whatever date needs"
            }</p>
        </div>`;
      productName.appendChild(div);
    }
  }
}

// show active block of el's in a list
loanList.addEventListener("click", (e) => listenForClickList(e));

function listenForClickList(e) {
  const element = e.target;

  if (!!activeElementList) {
    activeElementList.className = "product-item";
  }

  activeElementList = element.closest(".product-item");
  activeElementList.className += " product-item-active";

  activeElementChangeFor=activeElementList.id
  // send/show information to description part
  const productDescription = document.getElementById("description");
  productDescription.style = "display:flex";

  showDescriptionProduct();
}

// create product button
buttonList.addEventListener("click", listenForClickButtonList);

function listenForClickButtonList() {
  const productDescription = document.getElementById("description");
  productDescription.style = "display:flex";

  activeElementChangeFor=''
  insertProductInfo();
}

// description func to find element to show in form
function showDescriptionProduct() {
  const element = products.find((el) => {
    if (activeElementList.id === el["Loan-name"]) return el;
  });
  insertProductInfo(element);
}

// func to send data into html
function insertProductInfo(el) {
  const productName = document.getElementById("name");
  const productAmountMin = document.getElementById("min_amount");
  const productAmountMax = document.getElementById("max_amount");
  const productTermMin = document.getElementById("min_term");
  const productTermMax = document.getElementById("max_term");
  const productInterest = document.getElementById("interest");
  const titleLegend = document.getElementsByTagName("legend");
//   html
  if(!!el){
      titleLegend[0].innerHTML=`<b>Редактирование: ${el?.["Loan-name"]}</b>`
}else{
    titleLegend[0].innerHTML=`<b>Создать продукт:</b>`
}
  productName.value = el?.["Loan-name"] || null;
  productAmountMin.value = el?.Amount["min-amount"] || null;
  productAmountMax.value = el?.Amount["max-amount"] || null;
  productTermMin.value = el?.Term["min-term"] || null;
  productTermMax.value = el?.Term["max-term"] || null;
  productInterest.value = el?.["AI-rate"] || null;
}


// listener for form 
const sectForm=document.getElementById('description');
const buttonDescriptionSubmit=sectForm.getElementsByTagName('button');
sectForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    formData()
})

// get data from form 
function formData(){
    const data={}

    data['Loan-name']= document.getElementById('name').value;
    data.Amount={};
    data.Amount['min-amount'] = document.getElementById('min_amount').value;
    data.Amount['max-amount'] = document.getElementById('max_amount').value;
    data.Term={};
    data.Term['min-term'] = document.getElementById('min_term').value;
    data.Term['max-term']  = document.getElementById('max_term').value;
    data['AI-rate'] = document.getElementById('interest').value;

    if(!!activeElementChangeFor){
        let index=products.findIndex((el)=>el['Loan-name']===activeElementChangeFor)
        products.splice(index,1,data)
        validateProducts()
    }else{
        products.push(data)
    }
    validateStore();
    showDescriptionProduct();
}

