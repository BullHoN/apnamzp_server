const express = require('express');
const router = express.Router();
const Shop = require('../../models/Shop')
const SearchDB = require('../../util/searchbarconfig')

router.get('/search',async (req,res)=>{
    const query = req.query.query;
    
    const results = SearchDB.searchInDB(query);
    res.json(results);
})


module.exports = router;