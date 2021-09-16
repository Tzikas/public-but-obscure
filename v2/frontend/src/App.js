import { useEffect, useState } from 'react'
import axios from 'axios'

import io from "socket.io-client";



//Define Server
const serverUrl = process.env.NODE_ENV === 'production' ? 'https://pure-hollows-59166.herokuapp.com/api' : 'http://localhost:8000/api'

//Connect to Socket
const socket = io(serverUrl.replace("/api", ""))

function App() {

  const [reviews, setReviews] = useState([])
  let [message, setMessage] = useState('')
  let [rating, setRating] = useState(null)
  let [name, setName] = useState('')
  let [mClass, setMClass] = useState('')
  let [total, setTotal] = useState(0)

  useEffect(async () => {

    let res = await axios.get(serverUrl)
    console.log(res)
    setReviews(res.data)
    setTotal(res.data.reduce((val, cur) => val + cur.rating, 0))


  }, [])

  useEffect(() => {
    socket.on('review', function (review) {
      console.log(reviews, review, review.name)
      let newReviews = [...reviews]
      newReviews.push(review)
      setReviews(newReviews)
      setTotal(newReviews.reduce((val, cur) => val + cur.rating, 0))

    })
    return () => socket.off('review')
  }, [reviews])


  const handleClick = () => e => {
    setMClass('open')
  }


  const ShowReviews = () => (
    reviews.map(each => (
      <li key={each._id}>{each.rating} {each.message}

        <div className="star-ratings" style={{ pointerEvents: 'none' }} >
          {[...new Array(10)].map((x, i) => {
            console.log(i / 2, each.rating)
            return (
              <input key={i} defaultChecked={(10 - i) / 2 === each.rating} type="radio" name={`rating_${each._id}`} />
            )
          })}
        </div>
      </li>
    )
    )
  )

  const submitReview = async (e) => {
    e.preventDefault()
    let res = await axios.post(serverUrl, { name, message, rating })
    // let newReviews = { ...reviews }
    // newReviews[name].push(res.data)
    // setReviews(newReviews)
    setMClass('')
    setMessage('')

  }

  return (
    <div className="App">

      <main id="reviews" >


        <div className="review">
          <h3 className="name">The Minimalist Entrepeneur</h3>
          <div className="total">
            <span>{(total / reviews.length).toFixed(1)}</span>
            <div className="star-ratings" style={{ pointerEvents: 'none' }} >
              {[...new Array(10)].map((x, i) => {
                return (  //Check true 'cause math and stuff 
                  <input key={i} checked={(10 - i) / 2 <= (total / reviews.length) && !((total / reviews.length) - .499 > (10 - i) / 2)} type="radio" name="total" />
                )
              })}
            </div>
          </div>
          <button onClick={handleClick()}>Add Review</button>
          <label>Reviews</label>
          <ul>
            <ShowReviews />
          </ul>
        </div>
      </main>
      <div id="modal" className={mClass} onClick={(e) => e.target.id == "modal" && setMClass('')}>
        <form onSubmit={submitReview}>
          <button type="button" onClick={() => setMClass('')} id="cancel">X</button>
          <h2>What's your rating?</h2>
          <h4>Rating</h4>

          <div className="star-ratings">
            {[...new Array(10)].map((x, i) => <input key={i} type="radio" name="rating" onClick={() => setRating((10 - i) / 2)} />)}
          </div>
          <br></br> <br></br>
          <br></br>
          <br></br>

          <h4>Review</h4>


          <textarea placeholder="Start typing..." value={message} onChange={e => setMessage(e.target.value)}></textarea>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div >
  );
}


export default App;
