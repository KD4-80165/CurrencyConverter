const dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");
getButton = document.querySelector("form button");

const apiKey = "b86f0e5ca69035888cd4961d"; // storing the API Key in a variable

for (let i = 0; i < dropList.length; i++) {
    // selecting USD by default as FROM and NPR as TO currency
    for (currency_code in country_code) {
        let selected;
        if (i == 0) {
            selected = currency_code == "USD" ? "selected" : "";
        } else if (i == 1) {
            selected = currency_code == "NPR" ? "selected" : "";
        }
        // creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}"${selected}>${currency_code}</option>`;
        // inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag)
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // calling loadFlag with passing target element as an argument
    });

}

function loadFlag(element){
    for(code in country_code){
        if(code == element.value){  // if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); // selecting img tag of particular drop list
            imgTag.src = `https://flagicons.lipis.dev/flags/4x3/${country_code[code]}.svg`
        }
    }
}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault();     // preventing FORM from submmiting
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value;  // temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value;  // passing TO currency code to FROM currency code
    toCurrency.value = tempCode;  // passing temporary currency code to TO currency code
    loadFlag(fromCurrency);  //calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency);  //calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate();
});

function getExchangeRate() {
    const amount = document.querySelector(".amount input");
    let amountVal = amount.value,
    exchangeRateTxt = document.querySelector(".exchange-rate");
    // if user don't enter any value or enter 0 then we'll put 1 value by default in the input field
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting Exchange Rate...."
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;    // store the API in a variable and then use it this way. Never put API in js codes because it's client side language and your viewers can easily get your key

    // fetching api response and returning it with parsing into js obj and in another then method receiving that obj
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerHTML = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() => {  // if user is offline or any other error occured while fetching data then catch fuction will run
        exchangeRateTxt.innerText = "Oops! Something Went Wrong";
    });
}