
let serverUrl = 'http://localhost:5000/api' //Local
serverUrl = 'https://pure-hollows-59166.herokuapp.com/api' //Production

let total = 0

//Select html elements
const main = document.querySelector('main#reviews')
const modal = document.querySelector('div#modal')
const form = modal.querySelector('form')
const cancel = modal.querySelector('#cancel')


//Create html elements
const div = document.createElement('div')
div.className = "review"
const h3 = document.createElement('h3')
h3.className = "name"
h3.innerText = "The Minimilist Entrepeneur"
const totalDiv = document.createElement('div')
totalDiv.className = "total"

const button = document.createElement('button')
button.innerText = 'Add Review'
button.onclick = addReview //Open modal on click

const label = document.createElement('label')
label.innerText = "Reviews"

//Add all html elements to document
div.append(h3, totalDiv, button, label)
main.append(div)

//On load get reviews from backend
window.onload = getReviews;

function getReviews() {
    fetch(serverUrl)
        .then(res => res.json())
        .then(reviews => constructReviews(reviews))
}


function constructReviews(reviews) {


    let ul = document.createElement('ul')

    //Loop thru reviews data
    for (let review of reviews) {
        let li = document.createElement('li')
        li.append(`${review.rating}  ${review.message}`)

        total += Number(review.rating)
        li.innerHTML += makeStars(review.rating)

        ul.append(li)
    }
    let avg = (total / (reviews.length + div.querySelectorAll('li').length)).toFixed(1)

    totalDiv.innerHTML = `<span>${avg}</span><span>${makeStars(avg)}</span>`

    //Add list items to dom
    div.append(ul)
}


function makeStars(rating) {
    let i = 0;
    let stars = ''

    while (i < 5) {
        i < Number(rating) ? stars += `<span style="color:gold";}}>★</span>` : stars += `<span style="color:lightgray">★</span>`
        i++
    }
    return `<div>${stars}</div>`
}

function addReview() {
    modal.className = 'open'
}

//Add new review
form.onsubmit = submitReview

function submitReview(e) {
    e.preventDefault()
    //Shrink modal
    modal.className = ''

    //Get values of rating and message
    let message = this.querySelector('textarea').value
    let rating = this.querySelector('.rate input:checked').value

    //Save review to backend
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, rating })
    }).then(res => res.json()).then(newRating => constructReviews([newRating])).catch(console.error)
}

//Shrink modal when clicking cancel or off form
[modal, cancel].forEach(item => item.onclick = (e) => {
    e.target.id === 'modal' || e.target.id === 'cancel' ? modal.className = '' : null
})


