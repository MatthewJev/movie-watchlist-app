const input = document.getElementById("input")
const resultContainer = document.getElementById("resultContainer")
const watchListContainer = document.getElementById("watchListContainer")
const inputBtn = document.getElementById("inputBtn")
const localStorageKey = "watchList"

let watchList = []


inputBtn.addEventListener("click", ()=>searchMovies(input.value))

async function searchMovies (query){

    try{
        const response = await fetch(`https://www.omdbapi.com/?apikey=thewdb&s=${query}`)

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        console.log(data)

        if(!data.Search){
          resultContainer.innerHTML = "no movies found"   
          return 
        }
        renderResults(data.Search)  
       
    }
    catch(error){
        console.error("Fetch error:", error.message)

    }
    
    input.value = ""
}


function saveWatchlist (){
    localStorage.setItem(localStorageKey, JSON.stringify(watchList))
}

function loadWatchlist(){
  

   let parsedData = JSON.parse( localStorage.getItem(localStorageKey))

   if (parsedData){
    watchList = parsedData
   }else{
    watchList =[]
   }
   
}

function renderWatchList(){
    watchListContainer.innerHTML = ""

    watchList.forEach((movie, index)=>{
        let removeBtn = document.createElement("button")
        let movieName = document.createElement("p")

        movieName.textContent = movie.Title
        removeBtn.textContent = "remove"

        watchListContainer.append(movieName, removeBtn)

        removeBtn.addEventListener("click",()=>removeMovie(index))
        
    })
}

function renderResults(movies){
    resultContainer.innerHTML = ""
    movies.forEach((movie, index)=>{ 
        let movieName = document.createElement("p")
        let addBtn = document.createElement("button")
        let div = document.createElement("div")

        movieName.textContent = movie.Title
        addBtn.textContent = "add to watchlist"

        div.append(movieName, addBtn)

        resultContainer.append(div)

        addBtn.addEventListener("click", ()=>addToWatchList(movie))
        

    })
    
   
    
}

function removeMovie(index){
    watchList.splice(index, 1)

    saveWatchlist()
    renderWatchList()
}


function addToWatchList(movie){
  let exsists= watchList.find(watchListMovie => watchListMovie.imdbID === movie.imdbID)

  if(exsists){
    return
  }else{
    watchList.push(movie)

  }
  saveWatchlist()
  renderWatchList()


}

loadWatchlist()
renderWatchList()

