const express = require('express');
const router = express.Router();
const Shop = require('../../models/Shop')
const SearchDB = require('../../util/searchbarconfig')

router.get('/search',async (req,res,next)=>{
    const query = req.query.query;
    
    try{
        const results = SearchDB.searchInDB(query);
        res.json(results);
    }
    catch(error){
        next(error)
    }

})


module.exports = router;