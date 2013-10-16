describe('helper functions', function() {

    // setup..
    var thing = function() {
      this.yep = 'value';
      this.maybe = function() {};
    };

    thing.prototype.nope = function() {};




  // and away we go!
  describe('each()', function() {

    it('should fire a callback for each item in the array', function() {
      var i = 0;
      each([1, 2, 3], function() {
        i += 1;
      });
      expect(i).to.equal(3);
    });

    it('should pass in the value of the current iteration into the callback', function() {
      var sum = 0;
      each([1, 2, 3], function(value) {
        sum += value;
      });
      expect(sum).to.equal(6);
    });

    it('should pass in the index of the current iteration into the callback', function() {
      var counter = 0;
      each([1, 2, 3, 4, 'cat'], function(value, i) {
        expect(counter++).to.equal(i);
      });
    });

    it('should pass in the array being iterated over into the callback', function() {
      var things = ['cat', 3, {}, false];
      each(things, function(thing, i, stuff) {
        expect(stuff).to.equal(things);
      });
    });

    it('should break the loop if the callback returns false', function() {
      var iterations = 0;
      each([1, 2, 3], function(value, i) {
        iterations += 1;
        return i !== 1;
      });
      expect(iterations).to.equal(2);
    });

    it('should change the context of "this" when specified', function() {
      var context = { test: 'Hello!' };
      each([1, 2, 3], function() {
        expect(this).to.equal(context);
      }, context);
    });

  });




  describe('extend()', function() {

    var target;

    beforeEach(function() {
      target = {};
    });

    it('should perform a shallow copy of one object to another', function() {
      var obj = { hello: 'world', test: { hello: 'goodbye' } };
      extend(target, obj);
      expect(target.hello).to.equal('world');
      expect(target).to.not.equal(obj);
      expect(target.test).to.equal(obj.test);
    });

    it('should copy an ifinite number of objects', function() {
      extend(target, { hello: 'goodbye' }, { test: true }, { sum: 17 }, { method: function() {} });

      expect(target.hello).to.equal('goodbye');
      expect(target.test).to.be.true;
      expect(target.sum).to.equal(17);
      expect(target.method).to.be.a('function');
    });

    it('should let the last object with a certain property name take precedence', function() {
      extend(target, { hello: 'world' }, { hello: 'goodbye'});
      expect(target.hello).to.equal('goodbye');
    });

    it('should return a the target object upon completion', function() {
      var result = extend(target, { yee: 'haw' });
      expect(result).to.equal(target);
    });

  });



  
  describe('has()', function() {

    it('should check if the supplied object has the supplied key', function() {
      expect(has(new thing, 'yep')).to.be.true;
      expect(has(new thing, 'maybe')).to.be.true;
      expect(has(new thing, 'nope')).to.be.false;
      expect(has(new thing, 'what!')).to.be.false;
    });

  });




  describe('pick()', function() {

    var things = {
      'roses': 'red',
      'violets': 'blue',
      'all our base': 'belong to you',
      'yep': 'nope'
    };

    it('should create a new object, copying the values specified by the keys array', function() {
      var result = pick(things, ['roses', 'violets']);
      expect(result.roses).to.equal('red');
      expect(result.violets).to.equal('blue');
      expect(result['all our base']).to.be.undefined;
      expect(result.yep).to.be.undefined;
    });

  });




  describe('props()', function() {

    it('should only pull out own-property non-function values', function() {
      var result = props(new thing);
      expect(result.yep).to.equal('value');
      expect(result.maybe).to.be.undefined;
      expect(result.nope).to.be.undefined;
    })

  });


  

});