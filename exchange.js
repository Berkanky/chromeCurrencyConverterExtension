const amountInput = document.getElementById('amount');
const currency = document.getElementById('currency');
const convertcurrency = document.getElementById('convertcurrency')
const convert = document.getElementById('convert');
const result = document.getElementById('result');
const locationButton = document.getElementById('locationButton')
const changeButton = document.getElementById('changeButton')
const clearResult = document.getElementById('clearResult')
const clearresulticon = document.getElementById('clearresulticon')





const openCageData = {
    openCageApi : 'a7ac3cc8ba514f0287f82a6a306eabc8',
    api_url : 'https://api.opencagedata.com/geocode/v1/json',
    language:'tr',
    pretty:'1'
}



const gethistoricalrates =async () => {
    const allData = {
        apiKey:'fca_live_fMBb8xfAQi6oTL1kaEVSLcIdL1DVHelnEytcUBJZ',
        pureUrl:'https://api.freecurrencyapi.com/v1/historical?'
    }


    const url = `${allData.pureUrl}apikey=${allData.apiKey}&date_from=2022-11-11&date_to=2023-01-01&base_currency=USD&currencies=AUD,CAD,EUR`
    Object.assign(allData,{url:url})
    const res = await fetch(allData.url)
    const resData = await res.json()
    console.log('gethistoricalrates',resData)
}


const changeclasslocationwhenclick = () =>{

    const oldclassname = 'btn btn-danger text-light'

    const newclassname = 'btn btn-success text-light'
    const newclass = document.querySelector('#locationButton')
    newclass.className = newclassname
    setTimeout(() => {
        newclass.className = oldclassname
    },3000)
}


const getcurrentlocationdetails = () =>{


    const dataSets = {
        openCageApi : 'a7ac3cc8ba514f0287f82a6a306eabc8',
        api_url : 'https://api.opencagedata.com/geocode/v1/json',
        language:'tr',
        pretty:'1'
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const query = position.coords.latitude + ',' + position.coords.longitude
        Object.assign(dataSets,{query:query})

        const urlData = {
            url:`https://api.opencagedata.com/geocode/v1/json?q=${dataSets.query}&key=${dataSets.openCageApi}&language=${dataSets.language}&pretty=${dataSets.pretty}`
        }

        Object.assign(dataSets,{
            queryUrl:urlData.url
        })

        const res = await fetch(dataSets.queryUrl)
        const resData =await res.json()
        console.log(resData)


        const currencyData = resData.results[0].annotations.currency
        console.log(currencyData)
        currency.value = currencyData.iso_code
        changeclasslocationwhenclick()
    })
}

const getCountryCode = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      // Get the user's country code.
        //console.log(position)
        Object.assign(openCageData,{
            lat:position.coords.latitude,
            lng:position.coords.longitude,
            query:position.coords.latitude + ',' + position.coords.longitude

        })

        var request_url = openCageData.api_url
        + '?'
        + 'key=' + openCageData.openCageApi
        + '&q=' + encodeURIComponent(openCageData.query)
        + '&pretty=1'
        + '&no_annotations=1';

        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);
        request.onload = function() {
            // see full list of possible response codes:
            // https://opencagedata.com/api#codes
        
            if (request.status === 200){
              // Success!
              var data = JSON.parse(request.responseText);
              alert(data.results[0].formatted); // print the location
                console.log(data)
            } else if (request.status <= 500){
              // We reached our target server, but it returned an error
        
              console.log("unable to geocode! Response code: " + request.status);
              var data = JSON.parse(request.responseText);
              console.log('error msg: ' + data.status.message);
            } else {
              console.log("server error");
            }
          };
        
          request.onerror = function() {
            // There was a connection error of some sort
            console.log("unable to connect to server");
          };
        
          request.send();
        console.log(openCageData)
      // Do something with the user's country code.
    });
  };





const getonlycurrencynames = async () => {
    const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/USD`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'e2880f91d9mshfb17a8e0244a72ep13079cjsn4b92a900ff35',
            'X-RapidAPI-Host': 'exchangerate-api.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const res = await response.json()

        const allBody = {currencies:res.rates}
        let newList = []
        for(const [key, value] of Object.entries(allBody.currencies)){
            newList.push(key)
        }
        console.log('getonlycurrencynames',newList)


        const df = document.createDocumentFragment();

        for (let opt of newList) {
          const option = document.createElement('option');
          option.value = opt;
          option.appendChild(document.createTextNode(opt));
          df.appendChild(option);
        }
    
        convertcurrency.appendChild(df)

        const secondDf = document.createDocumentFragment();

        const defaultOption = document.createElement('option');
        defaultOption.value = 'TRY';
        defaultOption.appendChild(document.createTextNode(defaultOption.value));
        secondDf.appendChild(defaultOption);

        for (let opt of newList) {
            const option = document.createElement('option');
            option.value = opt;
            option.appendChild(document.createTextNode(opt));
            secondDf.appendChild(option);
        }

        currency.appendChild(secondDf);
    }catch(err){
        console.log(err)
    }

}

getonlycurrencynames()


const setdefaultvalues = () => {
    amountInput.value = 1
    

}

setdefaultvalues()


const setdefaultresult = () => {
    const defaultVal = 'Select Currencies and Exchange Them !'
   // result.innerHTML = defaultVal
   result.value = defaultVal
}

setdefaultresult()


const getalllatestcurrencies = async () => {
    const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/${currency.value}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'e2880f91d9mshfb17a8e0244a72ep13079cjsn4b92a900ff35',
            'X-RapidAPI-Host': 'exchangerate-api.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const res = await response.json()

        const allBody = {currencies:res.rates}

        const resultconvert = {}
        for(const [key, value] of Object.entries(res.rates)) {
            if(String(key) === String(convertcurrency.value)){
                Object.assign(resultconvert,{currency:key,amount:value})
            }
        }
        console.log('res,rates',res.rates);
        console.log('resultconvert',resultconvert)
        //console.log(result.value)
        resultconvert.amount = resultconvert.amount * amountInput.value

        //result.innerHTML = resultconvert.currency + ' : ' + resultconvert.amount
        result.value = resultconvert.currency + ' : ' + resultconvert.amount
        const newclasstypeclearresult = 'btn btn-danger text-light'
        const newicontype = 'fa-solid fa-minus fa-fade'
        const newClasstypes = document.querySelector('#clearResult')
        newClasstypes.className = newclasstypeclearresult
        const newclasstypeforiconclearresult = document.querySelector('#clearresulticon')
        newclasstypeforiconclearresult.className = newicontype
    } catch (error) {
        console.error(error);
    }
}

const changeButtonfunction = (e) => {
    const getcurrencyval = currency.value
    const getsecondcurrencyval = convertcurrency.value


    currency.value = getsecondcurrencyval
    convertcurrency.value = getcurrencyval
    getalllatestcurrencies()
}

const convertfunction = () => {
    getalllatestcurrencies()
    //gethistoricalrates()
    //result.innerHTML = currency.value
}


const setdefaultresultclass = () => {
    const newclasstypeclearresult = 'btn btn-info text-light'
    const newicontype = 'fa-solid fa-dollar-sign fa-fade'
    const newClasstypes = document.querySelector('#clearResult')
    newClasstypes.className = newclasstypeclearresult
    const newclasstypeforiconclearresult = document.querySelector('#clearresulticon')
    newclasstypeforiconclearresult.className = newicontype
}

const clearfunction = () => {
    //result.innerHTML = ''
    result.value = ''
    getonlycurrencynames()
    setdefaultresult()
    setdefaultresultclass()
}

if (convert) {
    convert.addEventListener("click", convertfunction);
}

if(locationButton){
    locationButton.addEventListener('click',getcurrentlocationdetails)
}
if(changeButton){
    changeButton.addEventListener('click',changeButtonfunction)
}
if(clearResult){
    clearResult.addEventListener('click',clearfunction)
}
