var express = require("express");
var router=express.Router();

/**
 * Connect to postgresql
 */
const pg = require('pg');
const {Pool} = require('pg');

let conString = process.env.DATABASE_URL || 'postgres://mjlrcdotwouger:9234e9e5235b549e9389d1aab578a2c144306c4ab61b1acd052dfb87ffc645c1@ec2-35-174-127-63.compute-1.amazonaws.com:5432/da9rg6k174929g';

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