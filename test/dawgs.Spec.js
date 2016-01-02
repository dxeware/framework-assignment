"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var app = require('../server');
var port = 3000;

chai.use(chaiHttp);

// function findByName(res, name) {
//   for (var i=0; i < res.body.length; i++) {
//     if (res.body[i].name === name) {
//       return res.body[i]._id; 
//     }
//   }
// }

function chaiRequest() {
  return chai.request(`localhost:${port}`);
}

describe('HTTP Framework', function() {

  before(function(done) {

  //   // Connect to DB and then drop database
  //   var conn = db('mongodb://localhost/college_teams');
  //   conn.connection.on('open', function() {
  //     conn.connection.db.dropDatabase(function() {
  //       console.log('======Dropped DBs========\n');
        app.listen(port, done);

  //     });
  //   });
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

  it('POST /dawgs request should add 1st dog to array', function(done) {
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
  it('POST /dawgs request should add 2nd dog to array', function(done) {
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
  // it('POST /dawgs request should add 1st dog to array', function(done) {
  //   chaiRequest()
  //     .post('/dawgs')
  //     .send({ name: 'Al', breed: 'labrador retriever'})
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res.body.message).to.equal('SUCCESS');

  //       chaiRequest()
  //         .get('/dawgs')
  //         .end(function(err, res) {
  //           expect(err).to.be.null;
  //           expect(res).to.have.status(200);
  //           expect(res.body.pack).to.deep.equal([{ name: 'Al', breed: 'labrador retriever'}]);
  //           done();
  //         });
  //     });
  // });
  // // it('POST /collegeteams request should add a team to DB', function(done) {
  // //   chaiRequest()
  // //     .post('/collegeteams')
  // //     .send({ name: 'LSU', mascot: 'tiger' })
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body.message).to.equal('LSU added to DB');
  //       done();
  //     });
  // });

  // it('GET /collegeteams request should respond with LSU data after LSU was added to DB', function(done) {
  //   chaiRequest()
  //     .get('/collegeteams')
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body[0].name).to.equal('LSU');
  //       expect(res.body[0].mascot).to.equal('tiger');
  //       done();
  //     });
  // });

  // it('POST /collegeteams request should add a 2nd team to DB', function(done) {
  //   chaiRequest()
  //     .post('/collegeteams')
  //     .send({ name: 'Oregon', mascot: 'duck' })
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body.message).to.equal('Oregon added to DB');
  //       done();
  //     });
  // });

  // it('GET /collegeteams request should respond with LSU and Oregon data after Oregon is added to DB', function(done) {
  //   chaiRequest()
  //     .get('/collegeteams')
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body[0].name).to.equal('LSU');
  //       expect(res.body[0].mascot).to.equal('tiger');
  //       done();
  //     });
  // });

  // it('DELETE /collegeteams/:id should delete Oregon data after finding Oregon ID', function(done) {
  //   chaiRequest()
  //     .get('/collegeteams')
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       var id = findByName(res, 'Oregon');

  //       chaiRequest()
  //         .del('/collegeteams/' + id)
  //         .end(function(err, res) {
  //           expect(err).to.be.null;
  //           expect(res).to.have.status(200);
  //           expect(res).to.be.json;
  //           expect(res.body.message).to.equal('ID: ' + id + ' deleted from DB');
  //           done();
  //         });
  //     });
  // });

  // it('PUT /collegeteams/:id request should update LSU mascot data', function(done) {
  //   chaiRequest()
  //     .get('/collegeteams')
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       LSU_id = findByName(res, 'LSU');
        
  //       chaiRequest()
  //         .put('/collegeteams/' + LSU_id)
  //         .send({ name: 'LSU', mascot: 'Mike the Tiger' })
  //         .end(function(err, res) {
  //           expect(err).to.be.null;
  //           expect(res).to.have.status(200);
  //           expect(res).to.be.json;
  //           expect(res.body.message).to.equal('ID: ' + LSU_id + ' updated in DB');
  //           done();
  //         });
  //     });
  // });

  // it('GET /collegeteams/:id request should respond with NEW LSU data after LSU mascot was updated', function(done) {
  //   chaiRequest()
  //     .get('/collegeteams/' + LSU_id)
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body.name).to.equal('LSU');
  //       expect(res.body.mascot).to.equal('Mike the Tiger');
  //       done();
  //     });
  // });

  // it('GET request to UNKNOWN route should respond with 404', function(done) {
  //   chaiRequest()
  //     .get('/nflteams')
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(404);
  //       done();
  //     });
  // });

  // it('GET request to UNKNOWN ID should respond with an ERROR message', function(done) {
  //   chaiRequest()
  //     .get('/collegeteams/999999999999')
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.be.json;
  //       expect(res.body.error).to.equal('Error fetching ID');
  //       done();
  //     });
  // });

  // it('POST /collegeteams request FAILS due to DATA VALIDATION b/c mascot is required', function(done) {
  //   chaiRequest()
  //     .post('/collegeteams')
  //     .send({ name: 'Virginia' })
  //     .end(function(err, res) {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body.message).to.equal('CollegeTeam validation failed');
  //       done();
  //     });
  // }); 
});