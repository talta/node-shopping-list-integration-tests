const chai = require('chai');
const chaiHttp = require('chai-http');

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
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			res.should.have.a.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.at.least(1)
		});

	});
	it('should create new recipe with POST', function(){
		const newRecipe = {name: 'cake', ingredients: ['real butter', 'flour', 'sugar']}
		return chai.request(app)
			.post('/recipes')
			.send(newRecipe)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('name', 'ingredients');
				res.body.id.should.not.be.null
				res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
		});
	});
	it('should update the recipe with PUT', function(){
		const updateRecipe  = {
			name:'barry-cake',
			ingredients: ['real butter', 'flour', 'blueberries', 'sugar']
		}
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			updateRecipe.id = res.body[0].id;

			return chai.request(app)
				.put(`/recipes/${updateRecipe.id}`)
				.send(updateRecipe);
		})
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.deep.equal(updateRecipe);
		});
	});
	it('should delete recipe from DELETE', function(){
		return chai.request(app)
			.get('/recipes')
			.then(function(res){
				return chai.request(app)
					.delete(`/recipes/${res.body[0].id}`);
			})
			.then(function(res){
				res.should.have.status(204);
			});
	});
});