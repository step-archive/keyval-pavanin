const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const Parsed=require(src('parsed.js'));
const assert= require('chai').assert;
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos) {
  return function(err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      return true;
    return false;
  }
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let kvParser=new StrictParser(["name"]);
    assert.throws(
      () => {
        var p=kvParser.parse("age=23");
      },
      "invalid key")
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    let expected=new Parsed();
    expected["name"]="john";
    expected["age"]="23";
    assert.deepEqual(expected,actual);
    assert.throws(
      () => {
        var p=kvParser.parse("color=blue");
      },
      "invalid key")
  });

  it("should throw an error when one of the keys is not valid",function(){
    assert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("name=john color=blue age=23");
      },
      "invalid key")
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    assert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("color   = blue");
      },
      "invalid key")
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    assert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("color   = \"blue\"");
      },
      "invalid key")
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    assert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("name = john color   = \"light blue\"");
      },
      "invalid key")
  });

  it("should throw an error when no valid keys are specified",function(){
    assert.throws(
      () => {
        let kvParser=new StrictParser([]);
        kvParser.parse("name=john");
      },
      "invalid key")
  });

  it("should throw an error when no array is passed",function(){
    assert.throws(
      () => {
        let kvParser=new StrictParser();
        kvParser.parse("name=john");
      },
      "invalid key")
  });

});
