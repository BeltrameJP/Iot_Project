var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "iot_shower"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


exports.InsertUser = function (name, rfid){
	var sql_query = "INSERT INTO user (name, rfid) values( '" + name + "'," + rfid + ")";
	con.query(sql_query, function (err, result){
		if (err){
			return false;
		}else{
			console.log("One Record Inserted!");
			return true;
		}
	});
};


exports.WhoInShower = function(callback){
	var sql_query = "SELECT User.name, section.timestart, section.timefinish, section.active, section.idSection from User, section ";
	sql_query += "where section.User_rfid = user.rfid ";
	sql_query += "ORDER BY section.idSection DESC LIMIT 1";
	con.query(sql_query, function(err, result){
		if (err){
			throw err
		}else{
			callback(result);
		}
	})
}


exports.FinishShower = function(callback){
	var sql_query =  "UPDATE Section SET active=0, timefinish=NOW() ORDER BY idSection DESC LIMIT 1";
	con.query(sql_query, function(err, result){
		if(err){
			callback("FAILED");
		}else{
			callback("SUCCESS");
		}
	})
}


exports.TimeShowerAndUsers = function(callback){
	var sql_query = "SELECT SUM(timediff) as soma, name from(";
	sql_query += " SELECT User.name as name, TIMESTAMPDIFF(SECOND, section.timestart, section.timefinish) as timediff, section.active as active, section.idSection as idSection from User, section";
	sql_query += " where section.User_rfid = user.rfid";
	sql_query += ") a ";
	sql_query += "GROUP BY name";
	con.query(sql_query, function(err,result){
		if(err){
			throw err
		}else{
			callback(result);
		}
	})
}

exports.TimeShowerUsed = function(callback){
	var sql_query = "SELECT name, SUM(tms) as total_seconds from ";
	sql_query += " (SELECT User.name as name, section.User_rfid, showerusing.time_seconds as tms from section, User, showerusing";
	sql_query += " where showerusing.Section_idsection = section.idSection and section.User_rfid = user.rfid)a";
	sql_query += " GROUP BY name";
	con.query(sql_query, function(err, result){
		if(err){
			throw err;
		}else{
			callback(result);
		}
	})
}

exports.InsertSection = function (userRfid, callback)
{
	var sql_query = "INSERT INTO Section (User_rfid, timestart ,active) values(" + userRfid + "," + "NOW()" + ", 1)" ;
	con.query(sql_query, function (err, result){
		if (err) 
			callback("FAILED");
			
		else
			callback("SUCCESS");
		
	});
}

function LastSection(callback){
	var sql_query = "SELECT idSection from Section ORDER BY idSection DESC LIMIT 1";
	con.query(sql_query, function(err, result){
		if(err)
			throw err;
		else
			callback(result[0]);
	});
}



exports.InsertShowerUsing = function(time, callback){
	LastSection(function(result){
		var sql_query = "INSERT INTO ShowerUsing (time_seconds, Section_idsection) values (" + time + ", " + result.idSection + ")";
		con.query(sql_query, function(err, result){
			if(err)
				throw err;
			else
				callback("SUCCESS");
		});
	})
	
}


////////////////////////////////////////////////////////

