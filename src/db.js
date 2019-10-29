var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mernapp";
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit">');
  res.write('</form>');
  return res.end();
}).listen(8080);
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mernapp");
    dbo.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mernapp");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  
//console.log(__dirname +'/../src/')
//publicpath=path.join(__dirname +'/../src/');
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = [
      { name: 'John', address: 'Highway 71'},
      { name: 'Peter', address: 'Lowstreet 4'},
      { name: 'Amy', address: 'Apple st 652'},
      { name: 'Hannah', address: 'Mountain 21'},
      { name: 'Michael', address: 'Valley 345'},
      { name: 'Sandy', address: 'Ocean blvd 2'},
      { name: 'Betty', address: 'Green Grass 1'},
      { name: 'Richard', address: 'Sky st 331'},
      { name: 'Susan', address: 'One way 98'},
      { name: 'Vicky', address: 'Yellow Garden 2'},
      { name: 'Ben', address: 'Park Lane 38'},
      { name: 'William', address: 'Central st 954'},
      { name: 'Chuck', address: 'Main Road 989'},
      { name: 'Viola', address: 'Sideway 1633'}
    ];
    dbo.collection("customers").insertMany(myobj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });

  var url = "mongodb://localhost:27017/mernapp";

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mernapp");
    var myobj = { email: "Company@nc.fr", username: "youness", password: "2037"  };
    dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
