const express = require('express')
const router = express.Router()
const Review = require('./models/Review')


/**ALL OUR BACKEND ROUTES */


router.get('/', (req, res) => {
    const io = req.app.get("socketIo");

    Review.find().then(reviews => {
        res.json(reviews)
    }).catch(console.error)


})


router.post('/', (req, res) => {
    console.log(req.body)
    const io = req.app.get("socketIo");

    io.sockets.emit("review", req.body)
    Review.create(req.body).then(review => res.json(review)).catch(console.error)
})



// function groupByName(reviews) {
//     //Group by common name.  
//     return reviews.reduce((groups, item) => {
//         const group = (groups[item.name] || []);
//         group.push(item);
//         groups[item.name] = group;
//         return groups;
//     }, {});
// }
module.exports = router