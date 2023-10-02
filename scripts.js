import { authors, books, genres, BOOKS_PER_PAGE } from "./data.js"

const appButtons = {
    search: document.querySelector('[data-header-search]'),
    settings: document.querySelector('[data-header-settings]'),
    showMoreButton: document.querySelector('[data-list-button]'),
    searchcancel: document.querySelector('[data-search-cancel]'),
    settingcancel: document.querySelector('[data-settings-cancel]'),
    descriptionclose: document.querySelector('[data-list-close]')

};
const appoverlays = {
    searchOverlay: document.querySelector('[data-search-overlay]'),
    settingsOverlay: document.querySelector('[data-settings-overlay]'),
    previewOverlay: document.querySelector('[data-list-active]')
};

const matches = books
let page = 1;


// if (!books && !Array.isArray(books)) throw new Error('Source required') 
// if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

/**** Day to night style settings  ****/
const day = {
    dark: '10, 10, 20',
     light: '255, 255, 255',
 }

const night = {
     dark: '255, 255, 255',
     light: '10, 10, 20',
 }
/**** Day to night style settings  ****/


const createpreview = ({ author, image, title, id, description, published}) => {
    const divPreview = document.createElement('div') 
    divPreview.classList.add("preview")
    divPreview.id = id
   const htmlblock = /*html*/`
   <img class= "preview__image" data-image-${id} src="${image}" id= "${id}">
   <div class= "preview__info" data-info-${id} id= "${id}">
         <h2 class= "preview__title" data-title-${id} id= "${id}">${title}</h2>
         <h3 class= "preview__author" data-author-${id}  id= "${id}">${authors[author]}</h3>
         <dialog data-description-${id}>${description}</dialog>
         <dialog data-subtitle-${id}>${published}</dialog>
    </div>`
         
         divPreview.innerHTML = htmlblock
         
     return divPreview                       
};



 const fragment = document.createDocumentFragment()
 let extracted = books.slice(0, 36)

/** Creating the discription that will toggle on when a certain book is pressed **/

const displayDiscription = (event) => {
   appoverlays.previewOverlay.show()
   const hero = document.querySelector('[data-list-blur]')
   const cover = document.querySelector('[data-list-image]')
   const picture = document.querySelector(`[data-image-${event.target.id}]`).getAttribute('src')
   const bookTitle = document.querySelector('[data-list-title]')
   const description = document.querySelector('[data-list-description]')
   const subTitle = document.querySelector('[data-list-subtitle]')
   cover.setAttribute('src', picture)
   hero.setAttribute('src', picture)
   bookTitle.innerHTML = document.querySelector(`[data-title-${event.target.id}]`).innerHTML 
   description.innerHTML = document.querySelector(`[data-description-${event.target.id}]`).innerHTML
   const year = new Date(document.querySelector(`[data-subtitle-${event.target.id}]`).innerHTML).getFullYear()
   const name = document.querySelector(`[data-author-${event.target.id}]`).innerHTML

   subTitle.innerHTML = `${name}(${year})`
} 
/** Creating the discription that will toggle on when a certain book is pressed **/



for (let { author, image, title, id, description, published} of extracted) {
    const preview = createpreview({
        author,
        image,
        title,
        id,
        description,
        published
    })
    
    preview.addEventListener('click', displayDiscription)
    fragment.appendChild(preview)
};




document.querySelector('[data-list-items]').appendChild(fragment)


/************ options for genres and authors **************/
const genresFrag = document.createDocumentFragment()
const elementGenres = document.createElement('option')
elementGenres.value = 'any'
elementGenres.innerText = 'All Genres'
genresFrag.appendChild(elementGenres);

for (let [id, name] of Object.entries(genres)) {
      const element = document.createElement('option')
      element.value = id
      element.innerText = name
      genresFrag.appendChild(element)
};

document.querySelector('[data-search-genres]').appendChild(genresFrag)

const authorsfrag = document.createDocumentFragment()
const elementAuthors = document.createElement('option')
elementAuthors.value = 'any'
elementAuthors.innerText = 'All Authors'
authorsfrag.appendChild(elementAuthors)

for (let [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name 
    authorsfrag.appendChild(element)
}
document.querySelector('[data-search-authors]').appendChild(authorsfrag)
/************ options for genres and authors **************/


/********Day-Night toggle************/
const dataSettingsTheme = document.querySelector('[data-settings-theme]')
const saveButton = document.querySelector("body > dialog:nth-child(5) > div > div > button.overlay__button.overlay__button_primary")
saveButton.addEventListener('click', (event) =>{
    event.preventDefault()
  if (dataSettingsTheme.value === 'day') {
    document.querySelector('body').style.setProperty('--color-dark', day.dark)
    document.querySelector('body').style.setProperty('--color-light', day.light)
    appoverlays.settingsOverlay.close()
  }
  if (dataSettingsTheme.value === 'night') {
    document.querySelector('body').style.setProperty('--color-dark', night.dark)
    document.querySelector('body').style.setProperty('--color-light', night.light)
    appoverlays.settingsOverlay.close()
      }
      
} )
/********Day-Night toggle************/

/************ Show more feature ***********************/
appButtons.showMoreButton.innerHTML = /* html */ [
    `<span>Show more</span>
    <span class="list__remaining" data-list-remaining> (${books.length - 36})</span>`,
]
appButtons.showMoreButton.addEventListener('click', (event)=>{
    event.preventDefault()
    page += 1
    let rangeMax = page * BOOKS_PER_PAGE
    let rangeMin = rangeMax - 36 
    extracted = books.slice(rangeMin, rangeMax)

    for (let { author, image, title, id, description, published} of extracted) {
        const preview = createpreview({
            author,
            image,
            title,
            id,
            description,
            published
        })
        
        preview.addEventListener('click', displayDiscription)
        document.querySelector('[data-list-items]').appendChild(preview)
        document.querySelector('[data-list-remaining]').innerHTML = `(${matches.length - rangeMax > 0 ? matches.length - rangeMax : 0})`
    };


})
/************ Show more feature ***********************/


document.querySelector("body > dialog:nth-child(4) > div > div > button.overlay__button.overlay__button_primary").addEventListener('click', (event) => {
    event.preventDefault()

    appoverlays.searchOverlay.close()
    
    const formData = {
        authors: document.querySelector('[data-search-authors]').value,
        title: document.querySelector('[data-search-title]').value,
        genre: document.querySelector('[data-search-genres]').value
    }

    let result = []
    
    for (let book = 0; book < books.length; book++) {
      
        if (formData.authors === 'any' && formData.genre === 'any') {
            if (books[book].title.toLowerCase().includes(formData.title.toLowerCase())){
              result.push (books[book])
            }
           }

           if (formData.genre === 'any') {
            if (books[book].title.toLowerCase().includes(formData.title.toLowerCase()) && books[book].author === formData.authors){
             result.push(books[book]);
            }
           }

           if (formData.title === '') {
            if (books[book].author === formData.authors && books[book].genres.includes(formData.genre)){
             result.push(books[book]);
            }}

            if (formData.title === '' && formData.authors === 'any' ) {
                if (books[book].genres.includes(formData.genre)){
                 result.push(books[book]);
                }
               }
               
}
if (result.length === 0){
    document.querySelector('[data-list-message]').classList.add('list__message_show')
} else {
    document.querySelector('[data-list-message]').classList.remove('list__message_show')
}
let leftBooks = result.length - result.slice(0, 36).length
document.querySelector('[data-list-remaining]').innerHTML = `${leftBooks}`
    if (leftBooks <= 0)appButtons.showMoreButton.disabled = true

  const fragment = document.createDocumentFragment()
  document.querySelector('[data-list-items]').innerHTML = ''      
               for (let { author, image, title, id, description, published} of result) {
                const preview = createpreview({
                    author,
                    image,
                    title,
                    id,
                    description,
                    published
                })
                
                preview.addEventListener('click', displayDiscription)
                fragment.appendChild(preview)
            };
            document.querySelector('[data-list-items]').appendChild(fragment)
 })


appButtons.search.addEventListener('click', (event) => {
    appoverlays.searchOverlay.show() ;
    appButtons.search.focus();
    
})

appButtons.settings.addEventListener('click', (event) => {
    appoverlays.settingsOverlay.show() ;
    appButtons.settings.focus();
    
})

appButtons.searchcancel.addEventListener('click', (event)=>{
    appoverlays.searchOverlay.close()
})

appButtons.settingcancel.addEventListener('click', () =>{
    appoverlays.settingsOverlay.close()
})

appButtons.descriptionclose.addEventListener('click', ()=> {
    appoverlays.previewOverlay.close()
})
// data-search-form.click(filters) {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     result = []

//     for (book; booksList; i++) {
//         titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
//         authorMatch = filters.author = 'any' || book.author === filters.author

//         {
//             genreMatch = filters.genre = 'any'
//             for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
//         }

//         if titleMatch && authorMatch && genreMatch => result.push(book)
//     }

//     if display.length < 1 
//     data-list-message.class.add('list__message_show')
//     else data-list-message.class.remove('list__message_show')
    

//     data-list-items.innerHTML = ''
//     const fragment = document.createDocumentFragment()
//     const extracted = source.slice(range[0], range[1])

//     for ({ author, image, title, id }; extracted; i++) {
//         const { author: authorId, id, image, title } = props

//         element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)

//         element.innerHTML = /* html */ `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />
            
//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[authorId]}</div>
//             </div>
//         `

//         fragment.appendChild(element)
//     }
   
    
//     data-list-items.appendChild(fragments)
//     initial === matches.length - [page * BOOKS_PER_PAGE]
//     remaining === hasRemaining ? initial : 0
//     data-list-button.disabled = initial > 0

    // document.querySelector('[data-list-button]').innerHTML = /* html */ `
    //     <span>Show more</span>
    //     <span class="list__remaining">(${books.length})</span>
    // `

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
// }

// data-settings-overlay.submit; {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const result = Object.fromEntries(formData)
//     document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
//     document.documentElement.style.setProperty('--color-light', css[result.theme].light);
//     data-settings-overlay).open === false
// }

// data-list-items.click() {
//     pathArray = Array.from(event.path || event.composedPath())
//     active;

//     for (node; pathArray; i++) {
//         if active break;
//         const previewId = node?.dataset?.preview
    
//         for (const singleBook of books) {
//             if (singleBook.id === id) active = singleBook
//         } 
//     }
    
//     if !active return
//     data-list-active.open === true
//     data-list-blur + data-list-image === active.image
//     data-list-title === active.title
    
//     data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
//     data-list-description === active.description
// }
