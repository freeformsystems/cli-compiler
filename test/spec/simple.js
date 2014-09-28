var expect = require('chai').expect
  , define = require('cli-define')
  , Program = define.Program
  , Command = define.Command
  , Option = define.Option
  , Flag = define.Flag
  , compiler = require('../..').compiler
  , mock = require('../util/mock')

describe('cli-compiler:', function() {

  it('should compile simple program', function(done) {
    var opts = mock.opts.simple;
    compiler(opts, function(err, req) {
      expect(req).to.be.an('object');
      expect(req.program).to.be.an('object');
      expect(req.program.options()).to.be.an('object');
      expect(req.program.commands()).to.be.an('object');

      // basic test on the compiled program (in-memory)
      var options = req.program.options();
      var output = options.mockOption;
      expect(output).to.be.an('object');
      expect(output.key()).to.eql('mockOption');
      expect(output.names()).to.eql(['-o', '--mock-option']);

      // run an empty program against the compiled
      // closure loaded from disc
      mock.run(opts, function(err, prg) {

        expect(err).to.eql(null);
        expect(prg).to.be.an('object');
        expect(prg).to.be.an.instanceof(Program);
        expect(prg.name()).to.eql('simple-mock-program');
        expect(prg.version()).to.eql('1.0.0');
        var des = prg.description();
        expect(des).to.be.an('object');
        expect(des.txt).to.eql('Simple program.');
        expect(des.md).to.eql('*Simple* program.');

        var det = prg.detail();
        expect(det).to.be.an('object');
        expect(det.txt).to.eql('Mock detail about the program.');
        expect(det.md).to.eql('Mock `detail` about the program.');

        var opts = prg.options()
          , cmds = prg.commands();

        expect(opts).to.be.an('object');
        expect(cmds).to.be.an('object');

        expect(Object.keys(opts)).to.eql(['mockOption', 'mockFlag']);
        expect(Object.keys(cmds)).to.eql(['mockCommand']);

        expect(cmds.mockCommand).to.be.instanceof(Command);
        expect(opts.mockOption).to.be.instanceof(Option);
        expect(opts.mockFlag).to.be.instanceof(Flag);

        done();
      });
    });
  });
})
