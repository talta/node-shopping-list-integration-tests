const chai = require('chai');
const chaiHttp = require('chi-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function(){

	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});

	it('should return all recipes from GET', function(){
		return chai.request(app);
		.get('/')
		.then(function(res){
			res.should.have.a.status(200);
			res.should.be.json;
			res.body.should.be.a.array;
			
		})

	})




})