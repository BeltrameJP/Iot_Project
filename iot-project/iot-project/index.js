var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var db_connect = require('./include/databaseconnect.js');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/whoInShower', function (req,res){
	var sql_query = "SELECT User.name, section.timestart, currentsection.active from User, section, currentsection";
	db_connect.con.query(sql_query, function(err, result){
		if (err){
			console.log(err);
		}else{
			res.send(result);
		}
	})
})

app.get('/*.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/include/' + req.params[0] + '.html'));
})

app.post('/cadastroUsuario.js', function(req,res){
	if(db_connect.InsertUser(req.body.nome, req.body.rfid)){
 		res.send({ status: 'SUCCESS' });
	}else res.send({ status: 'FAILED' });;
})

app.get('/whoInShower', function (req,res){

})



app.listen(3000, function () {
  console.log('Porta aberta em 3000!');
})

/////////////////////////////////////////////////////////////////////////////////////////

app.post('/adicionarSecao.js', function(req,res){
	db_connect.InsertSection(req.body.rfid, function(result){
		res.send(result);
	});
});


app.get('/*.*', function(req,res){
	res.sendFile(path.join(__dirname + '/include/' + req.params[0] + '.' + req.params[1]))
})