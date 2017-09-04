var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@131432imTB",
  database: "iot_shower"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


exports.InsertUser = function (name, rfid){
	var sql_query = "INSERT INTO User (name, rfid) values( '" + name + "'," + rfid + ")";
	con.query(sql_query, function (err, result){
		if (err){
			 throw err;
		}else{
			console.log("One Record Inserted!");
			return true;
		}
	});
};


exports.WhoInShower = function(){
	var sql_query = "SELECT User.name, section.timestart, currentsection.active from User, section, currentsection";
	sql_query += " where currentsection.Section_idSection = section.idSection and currentsection.Section_User_iduser = user.idUser";
	var resultado;
	con.query(sql_query, function(err, result){
		if (err){
			console.log(err);
		}else{
			return result;
		}
	});
}

exports.InsertSection = function (userRfid, callback)
{
	console.log("dbConnect.js");
	var sql_query = "INSERT INTO Section (User_rfid, timestart ,active) values(" + userRfid + "," + "NOW()" + ", 1)" ;
	con.query(sql_query, function (err, result){
		if (err) 
				callback("FAILED");
			
		else
				callback("SUCCESS");
		
	});
}