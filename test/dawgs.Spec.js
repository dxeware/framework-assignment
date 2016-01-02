"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var app = require('../server');
var port = 3000;

chai.use(chaiHttp);

function chaiRequest() {
  return chai.request(`localhost:${port}`);
}

describe('HTTP Framework', function() {

  before(function(done) {
    app.listen(port, done);
  });

  it('GET /dawgs request should respond with no dawgs (empty array)', function(done) {
    chaiRequest()
      .get('/dawgs')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('[]');
        done();
      });
  });

  it('POST /dawgs request should add 1st dog to array and GET should return 1 dog', function(done) {
    chaiRequest()
      .post('/dawgs')
      .send({ name: 'Al', breed: 'labrador retriever'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('SUCCESS');

        chaiRequest()
          .get('/dawgs')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            //expect(res.text).to.be.equal('[{"name":"Al","breed":"labrador retriever"}]');
            expect(res.text).to.be.equal('[' +
              '{"name":"Al","breed":"labrador retriever"}' +
            ']');
            done();
          });
      });
  });

  it('POST /dawgs request should add 2nd dog to array and GET should return 2 dogs', function(done) {
    chaiRequest()
      .post('/dawgs')
      .send({ name: 'Gumbo', breed: 'bulldog'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('SUCCESS');

        chaiRequest()
          .get('/dawgs')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.text).to.be.equal('[' +
              '{"name":"Al","breed":"labrador retriever"},' +
              '{"name":"Gumbo","breed":"bulldog"}' +
            ']');
            done();
          });
      });
  });

  it('GET /dawgs/Al request should respond with Al', function(done) {
    chaiRequest()
      .get('/dawgs/Al')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{' +
          '"name":"Al","breed":"labrador retriever"' +
        '}');
        done();
      });
  });

  it('GET /dawgs/Gumbo request should respond with Gumbo', function(done) {
    chaiRequest()
      .get('/dawgs/Gumbo')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{' +
          '"name":"Gumbo","breed":"bulldog"' +
        '}');
        done();
      });
  });

  it('DELETE /dawgs request should respond with 404', function(done) {
    chaiRequest()
      .delete('/dawgs')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it('DELETE /dawgs/Dixie request should respond with "NO DAWG"', function(done) {
    chaiRequest()
      .delete('/dawgs/Dixie')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('NO DAWG');
        done();
      });
  });

  it('DELETE /dawgs/Al request should respond with Al deleted and GET return only Gumbo', function(done) {
    chaiRequest()
      .delete('/dawgs/Al')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{' +
          '"name":"Al","breed":"labrador retriever"' +
        '}');

        chaiRequest()
          .get('/dawgs')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.text).to.be.equal('[{' +
              '"name":"Gumbo","breed":"bulldog"' +
            '}]');
            done();
          });
      });
  });

  it('PUT /dawgs request should respond with 404', function(done) {
    chaiRequest()
      .put('/dawgs')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it('PUT /dawgs/Gumbo request with NO BODY should respond with 404', function(done) {
    chaiRequest()
      .put('/dawgs/Dixie')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it('PUT /dawgs/Gumbo request should respond with Gumbo as "english bulldog"', function(done) {
    chaiRequest()
      .put('/dawgs/Gumbo')
      .send({ name: 'Gumbo', breed: 'english bulldog'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('{' +
          '"name":"Gumbo","breed":"english bulldog"' +
        '}');
        done();
      });
  });

  it('PUT /dawgs/Al request should respond with "NO DAWG"', function(done) {
    chaiRequest()
      .put('/dawgs/Al')
      .send({ name: 'Al', breed: 'golden retriever'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('NO DAWG');
        done();
      });
  });

  it('GET /dawgs/XXX request should respond with "NO DAWG"', function(done) {
    chaiRequest()
      .get('/dawgs/XXX')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('NO DAWG');
        done();
      });
  });

  it('GET /XXX request should respond with 404', function(done) {
    chaiRequest()
      .get('/XXX')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it('TRACE request should respond with 404', function(done) {
    chaiRequest()
      .get('')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });
});