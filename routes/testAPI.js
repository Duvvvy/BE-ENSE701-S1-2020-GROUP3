var express = require("express");
var router=express.Router();

/**
 * Connect to postgresql
 */
const pg = require('pg');
const {Pool} = require('pg');

let conString = process.env.DATABASE_URL || 'postgres://negtxomvpyukav:2cccea68c2c3ba807464803955c4e91fadce7e98aab3537d61072910b5aafc4b@ec2-34-195-169-25.compute-1.amazonaws.com:5432/d519qj82c2p87g';

const pool = new Pool({
  connectionString: conString,
  ssl: {
    rejectUnauthorized: false
  }
});


router.get("/",function(err, client, next ) {
  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Can not connect to the DB" + err);
    }
    else{
      console.log("connected");
    }

    client.query('SELECT * FROM information_schema.tables;', function(err, result) {
      done();
      if(err)
      {
        console.log(err);
      }
      else
      {
        for (let row of result.rows) {
          console.log(JSON.stringify(row));
        }
      }
    });
  });
});

module.exports=router;