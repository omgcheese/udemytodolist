var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var PORT = process.env.PORT || 3000;


//Example todo list
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());

//Main page
app.get('/', function (req, res){
	res.send('Todo API Root');
});

// GET /todos
// return all todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
// return requested todo list
app.get('/todos/:id', function (req, res){
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo;
	//iterate of todos array. Find the match

	todos.forEach(function (todo) {
		if (todoID === todo.id) {
			matchedTodo = todo;
			res.json(matchedTodo);
		}
	});	

	if (!matchedTodo) {
		res.status(404).send();
	}
	//res.send('Asking for todo with id of ' + req.params.id)
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = req.body;
	//add id field
	body.id = todoNextID++;

	//push body into array
	todos.push(body);

	console.log('description: ' + body.description);



	res.json(body);
});






//confirmation console log
app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT);
});