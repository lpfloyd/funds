const expect = require("chai").expect;
const assert = require("chai").assert;

const Token = require("../models/user/token/token");

describe("The Token schema attribute", function() {
  it("_id (address) is invalid if empty", function(done) {
    var t = new Token();

    t.validate(function(err) {
      expect(err.errors._id).to.exist;
      done();
    });
  });

  it("name is valid if empty", function(done) {
    var t = new Token();

    t.validate(function(err) {
      expect(err.errors.name).to.not.exist;
      done();
    });
  });

  it("privateKey is invalid if empty", function(done) {
    var t = new Token();

    t.validate(function(err) {
      expect(err.errors.privateKey).to.exist;
      done();
    });
  });

  it("balance is valid if empty", function(done) {
    var t = new Token();

    t.validate(function(err) {
      expect(err.errors.balance).to.not.exist;
      done();
    });
  });

  it("name defaults to VET if empty", function(done) {
    var t = new Token();
    assert.equal(t.name, "VET");
    done();
  });

  it("_id (address) must be alphanumeric", function(done) {
    var t = new Token({
      address: "0x123abc"
    });

    t.validate(function(err) {
      expect(err.errors.address).to.not.exist;
      done();
    });
  });

  it("_id (address) must be uppercase", function(done) {
    var t = new Token({
      address: "0x123abc"
    });

    assert.equal(t._id, "0X123ABC");
    done();
  });

  it("privateKey must be alphanumeric", function(done) {
    var t = new Token({
        privateKey: "0x123abc"
    });

    t.validate(function(err) {
      expect(err.errors.privateKey).to.not.exist;
      done();
    });
  });

  it("privateKey must be uppercase", function(done) {
    var t = new Token({
        privateKey: "0x123abc"
    });

    assert.equal(t.privateKey, "0X123ABC");
    done();
  });

  it("name can only contain the recommended Token names (under enums)", function(done) {
    var t = new Token({
      name: "VET"
    });

    var t1 = new Token({
      name: "OCE"
    });

    var t2 = new Token({
      name: "PLA"
    });

    var t3 = new Token({
      name: "SHA"
    });

    assert.equal(t.name, "VET");
    assert.equal(t1.name, "OCE");
    assert.equal(t2.name, "PLA");
    assert.equal(t3.name, "SHA");
    done();
  });

  it("name cannot contain invalid token names (under enums)", function(done) {
    var t = new Token({
      name: "ECH"
    });

    t.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });
  });

  it("name cannot be shorter than 3 characters", function(done) {
    var t = new Token({
      name: "EC"
    });

    t.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });
  });

  it("balance should be more than 0", function(done) {
    // test lower boundary
    var t = new Token({
      balance: -1
    });

    t.validate(function(err) {
      expect(err.errors.balance).to.exist;
    });

    // test
    var t = new Token({
        balance: 0
    });
    t.validate(function(err) {
        expect(err.errors.balance).to.not.exist;
    });

    // test upper boundary
    var t = new Token({
        balance: 1
    });
    t.validate(function(err) {
        expect(err.errors.balance).to.not.exist;
    });

    done();

  });

});
