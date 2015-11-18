var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	//iterate of todos array. Find the match
	var matchedTodo = _.findWhere(todos, {id: todoID});
	//if matched send response in json format
	if (matchedTodo) {
		res.json(matchedTodo);
	}

	else  {
		//if not found, send 404 page
		res.status(404).send();
	}
	//res.send('Asking for todo with id of ' + req.params.id)
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = req.body;
	//._pick to only pick description and completed

	body = _.pick(body, 'completed', 'description');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(404).send();
	}

	//set body.description to be trimmed value
	body.description = body.description.trim();


	//add id field
	body.id = todoNextID++;

	//push body into array
	todos.push(body);

	console.log('description: ' + body.description);



	res.json(body);
});

//DELETE /todos/:id

app.delete('/todos/:id', function (req, res){
	var todoID = parseInt(req.params.id, 10);
	//iterate of todos array. Find the match
	//var matchedTodo = _.findWhere(todos, {id: todoID});
	var matchedTodo = _.findWhere(todos, {id: todoID});
	if (!matchedTodo) {
		res.status(404).json({"error": "No todo found with that ID"});
	}
	else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	

});

//PUT /todos/:id

app.put('/todos/:id', function (req, res) {
	// var todoID = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {id: todoID});
	// var body = req.body;
	// if (!matchedTodo) {
	// 	res.status(400).json({"error": "No todo found with that ID"});
	// }
	// else {
	// 	todos = _.without(todos, matchedTodo);

	// 	body.id = matchedTodo.id;
	// 	//console.log(req.body);

	// 	body = _.pick(body, 'completed', 'description', 'id');

	// 	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 		return res.status(400).send();
	// 	}

	// 	//set body.description to be trimmed value
	// 	body.description = body.description.trim();

	// 	todos.push(body);
	// 	res.json(body);


	// }

	var todoID = parseInt(req.params.id, 10);
	//iterate of todos array. Find the match
	//var matchedTodo = _.findWhere(todos, {id: todoID});
	var matchedTodo = _.findWhere(todos, {id: todoID});

	if (!matchedTodo) {
		return res.status(404).json({"error": "No todo found with that ID"});
	}


	var body = req.body;
	body = _.pick(body, 'completed', 'description');
	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} 
	else if (body.hasOwnProperty('completed')) {
		//bad
		return res.status(404).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} 
	else if (body.hasOwnProperty('description')) {
		//bad
		return res.status(404).send();
	}	

	 //_.extend(matchedTodo, validAttributes);
	 res.json(_.extend(matchedTodo, validAttributes));
});






//confirmation console log
app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT);
});