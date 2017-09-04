var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var db_connect = require('./include/databaseconnect.js');

var secaoIniciada = false;
var rfidAtual = null;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/*.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/include/' + req.params[0] + '.html'));
})

app.get('/whoInShower', function (req,res){
	db_connect.WhoInShower(function(result){
		res.send(result[0]);
	})
})

app.get('/TimeShowerAndUsers', function(req,res){
	db_connect.TimeShowerAndUsers(function(result){
		res.send(result);
	})
})

app.get('/TimeShowerUsed', function(req,res){
	db_connect.TimeShowerUsed(function(result){
		res.send(result);
	});
})

app.post('/cadastroUsuario.js', function(req,res){
	if(db_connect.InsertUser(req.body.nome, req.body.rfid)){
 		res.send({ status: 'SUCCESS' });
	}else res.send({ status: 'FAILED' });;	
})

app.post('/adicionarSecao.js', function(req,res){
	db_connect.InsertSection(req.body.rfid, function(result){
		res.send({status: result});
		if(result == 'SUCCESS'){
			secaoIniciada = true;
			console.log("Seção Iniciada!");
			rfidAtual = req.body.rfid;
		}
	});
});

app.post('/adicionarTempoSecao.js', function(req,res){
	if(secaoIniciada){
		db_connect.InsertShowerUsing(req.body.time, function(result){
			res.send({status: result});
		});
	}else{
		res.send({status: 'FAILED'});
	}
});

app.post('/finalizarSecao.js', function(req,res){
	db_connect.FinishShower(function(result){
		res.send({status: result});
		if(result == 'SUCCESS'){
			secaoIniciada = false;
			console.log("Seção Finalizada!")
			rfidAtual = null;
		}
	})
})

app.get('/*.*', function(req,res){
	res.sendFile(path.join(__dirname + '/include/' + req.params[0] + '.' + req.params[1]))
})


app.listen(3000, function () {
  console.log('Porta aberta em 3000!');
})
