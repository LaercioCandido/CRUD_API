const express = require('express');

const server = express();
server.use(express.json());

const users = ['kelly', 'danni', 'marcos', 'lívia', 'júnior'];

server.use((req,res,next) => {
	console.time('Request');
	console.log(`Método: ${req.method}; URL: ${req.url}`);

	next();
	console.timeEnd('Request');
})

//middleware para checar se existe o índice pesquisado no array de usuarios
function checkUsersInArray(req, res, next) {
	const user = users[req.params.index];
	if (!user) {
		return res.status(400).json({error: `Index doesn't exists`});
	}
	req.user = user;
	return next();
}

//middleware para verificar se o nome passado existe ou se está vazio
function checkUsersExist(req, res, next) {
	if (!req.body.name){
		return res.status(401).json({error: `User name is invalid`});
	}
	return next();
}

server.get('/users/', (req, res) => {
  //return res.send('A rota esta up');
  return res.json(users);
});

server.get('/users/:index', checkUsersInArray, (req, res) => {
	//return res.json(user[req.params.index]);
	return res.json(req.user);
});

server.post('/users/', (req, res) => {
	const { name } = req.body;
	users.push(name);
	return res.status(201).json(users);
});

server.put('/users/:index', checkUsersInArray, checkUsersExist, (req, res) => {
	const { index } = req.params;
	const { name } = req.body;
	users[index] = name;
	return res.json(users);
});

server.delete('/users/:index', checkUsersInArray, (req, res) => {
	const { index } = req.params;
	users.splice(index, 1);
	return res.json(users);
})

server.listen(3001);

