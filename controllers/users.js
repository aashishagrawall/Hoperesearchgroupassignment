var fs = require('fs');
var User = require('../models/user.js')

var Db = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var assert = require('assert');
var jwt = require("jsonwebtoken");





exports.addAllUsers = function (req, res) {

  fs.readFile('./public/data/users.json', function (err, data) {  //read json file from static public directory
    if (err) {
      return console.error(err);
    }
    var tempstring = data.toString();
    var obj = JSON.parse(tempstring);
    obj.forEach(element => {
      element.password = element.username + '-' + element.username;
    });

    User.create(obj, function (err, users) {
      if (err)
        res.status(500).send({ error: err });
      else
        res.json(users);

    });
  });
}

exports.addAllPostAndComments = function (req, res) {
  var promises = ['./public/data/posts.json', './public/data/comments.json', './public/data/users.json'].map(function (_path) {
    return new Promise(function (resolve, reject) {
      fs.readFile(_path, 'utf8', function (err, data) {
        if (err) {
          console.log(err);
          resolve("");    //following the same code flow
        } else {
          resolve(data);
        }
      });
    })
  });

  Promise.all(promises).then(function (results) {
    var comments = JSON.parse(results[1]);
    var posts = JSON.parse(results[0]);
    var users = JSON.parse(results[2]);

    posts.map(function (post) {

      post.comments = [];
      comments.forEach(function (comment) {
        if (comment.postId === post.id)
          post.comments.push(comment);

      })

      return post;
    })

    addAll(posts, users).then(function (a) {
    res.json({success:"Added all post and comment to respective databases"});

    }).catch(function (err) {
      res.status(500).json({
        error: err
      })


    })
  })
}


async function addAll(posts, users) {

  try {
    let dbPromise = new Promise(function (resolve, reject) {
      MongoClient.connect('mongodb://localhost:27017', function (err, client) {
        assert.equal(null, err);
        console.log("connection sucessfull");
        if (err)
          reject(err)
        else
          resolve(client);

      });
    })
    let client = await dbPromise;
    let userPromise = users.map(async function (user) {
      var postArray = posts.filter(function (post) {
        return post.userId === user.id;
      })

      try {


        //let connectPromise= MongoClient.connect("mongodb:///" + user.username, {native_parser:true});
        user.username = user.username.replace(/[._]/g, "")

        let db = client.db(user.username);
        var createCollectionPromise = new Promise(function (resolve, reject) {
          db.createCollection("posts", function (err, collection) {
            if (err)
              reject(err);
            else
              resolve(collection);

          })

        })
        let postCollection = await createCollectionPromise;

        let insertPromise = new Promise(function (resolve, reject) {
          postCollection.insertMany(postArray, function (err, data) {
            if (err)
              reject(err);
            else {
              resolve(data);
            }
          })

        });

        let added = await insertPromise;
        return added;
      }
      catch (e) {
        throw new Error(e);

      }
    })
    var response = await Promise.all(userPromise);
    client.close();
    return response;
  }
  catch (e) {
    throw new Error(e);

  }

}


exports.signIn = function (req, res) {
  User.findOne({ username: req.body.username })
    .exec()
    .then(user => {
      if (user == null) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      } else if (user.password === req.body.password) {
        const token = jwt.sign({
          user: user.email,
          username: user.username

        }, "secret",
          {
            expiresIn: "200s"
          })
        return res.status(200).json({
          message: 'Auth Successful',
          token: token
        })

      } else {
        return res.status(401).json({
          message: 'Auth failed'
        })

      }



    }).catch(err => {
      console.log(err);
    })

}

exports.fetchAllUser = function (req, res) {

  User.find({}).exec().then(users => {
    res.json(users);

  }).catch(err => {
    res.status(500).send({ error: err });

  })
}

exports.fetchAllUserPost = function (req, res) {
  console.log(req.userData);

  MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    assert.equal(null, err);
    if (err) {
      return res.json("connot connect to mongoose")
    } else {
      let db = client.db(req.userData.username);
      db.collection("posts").find({}).toArray(function (err, posts) {
        if (err) {
          res.status(500).send({ error: err });

        } else {
          res.json(posts);
          client.close();
          console.log("how are you");

        }

      })

    }

  });

}

exports.updateUserPhone=function(req,res){


  if(!req.body.phone){
    return    res.status(500).send({ error: "please enter phone" });

  }

  User.findOneAndUpdate({username:req.userData.username}, { $set: { phone: req.body.phone }},function(err,updateduser){
    if(err)
    res.status(500).send({ error: err });
    else
    res.status(200).json({status:"user has been update"});



  })

}


