const searchbutton = document.querySelector("#searchbutton")

const search = document.querySelector("#Search")

const list = document.querySelector("#list")

let suchverlauf = document.querySelector("#Suchverlauf")

let sprache = document.querySelector("#sprache")

let page = document.querySelector("#page")
console.log(page)


/*let highliting = document.querySelector("#highliting")

highliting.addEventListener("click", function(event){
    if (highliting == "click"){
        highlghit(searchvalue)
    }
})*/


searchbutton.addEventListener("click", function(){
    handlesearch(search.value)
})
search.addEventListener("keydown", function(event){
    if (event.key == "Enter"){
        handlesearch()
    }
})

function highlight(searchvalue, text) {
    console.log(searchvalue)
    console.log(text)
    if (text == null){
        return text
    }
    let matchedtextstart = text.search(searchvalue)
    if (matchedtextstart < 0){
        return text
    }
    let matchedtextend = searchvalue.length + matchedtextstart
    let matchedtext = text.substring(matchedtextstart, matchedtextend)
    let bevormatchedtext = text.substring(0, matchedtextstart)
    let aftermatchedtext = text.substring(matchedtextend, text.length)
    console.log("matchedtextend", matchedtextstart)
    console.log("aftermetchedtext", aftermatchedtext)
    return `<div class="matchedtext">${bevormatchedtext}<div class="highlight">${matchedtext}</div>${aftermatchedtext}</div>`
  }

async function handlesearch(searchvalue) {
    try{
        list.innerHTML = `<div id="loader"></div>`
        const pages = await loadartikels(searchvalue)
        console.log("pages",pages)
        mapartiklestohtml(pages)
        if (pages.length <1){
            list.innerHTML = `<div>Nothing found</div>`
        }
    }catch(error){
        console.log(error)
        list.innerHTML = `<div>ERROR</div>`
    }

}


function mapartiklestohtml(pages) {
    let artikleshtml = []
    for (let i = 0; i < pages.length; i++){
        const page = pages[i]
        let highlightettitle = highlight(search.value,page.key)
        let highlightetdescription = highlight(search.value,page.description)
        let highlightetexcerpt = highlight(search.value,page.excerpt)
        artikleshtml[i] = `
        <li class="listitem">
            <a href = "https://de.wikipedia.org/wiki/${(page.key)}" class = "description">${(highlightettitle)}</a>
            <h5 class = "description">${(highlightetdescription)}</h5>
            <div id = "lastline">${(highlightetexcerpt)}</div>
        </li>`
        
    }
    list.innerHTML = artikleshtml.join("")
    //suchverlauf.innerHTML = `<option>${(search.value)}</option>`
}

async function loadartikels(searchvalue){
        let url = `https://api.wikimedia.org/core/v1/wikipedia/${sprache.value}/search/page?q=${searchvalue}&limit=${page.value}`;
        let response = await  fetch(url);
        let json = await response.json()
        let historyshtml = []
        let history = localStorage.getItem("history") ??""
        let historyarray = history.split(',')
        console.log("historynew", historyarray)
        console.log("history", history)
        let newhistory = historyarray.push(searchvalue)
        console.log("newhistory",newhistory)
        localStorage.setItem("history", newhistory.join(","))
        for (let i = 0; i < historyarray.length; i++){
            const historyentri = historyarray[i]
            historyshtml[i] = `<option class = "suchverlaufbutton">${historyentri}</option>`
            //console.log(history)
        }
        suchverlauf.innerHTML = historyshtml.join("")

        let suchverlaufbuttons = document.querySelectorAll(".suchverlaufbutton")
        console.log(suchverlaufbuttons)
        for (let i = 0; i < suchverlaufbuttons.length; i++){
            const suchverlaufbuttoneinzahl = suchverlaufbuttons[i]
            suchverlaufbuttoneinzahl.addEventListener("click", async function(){
                const pages = await handlesearch(suchverlaufbuttoneinzahl.value)
                mapartiklestohtml(pages)
                console.log(suchverlaufbuttoneinzahl.value)
            })
        }
        return json.pages
}
