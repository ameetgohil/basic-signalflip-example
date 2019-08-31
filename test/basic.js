//imports dut that was compiled with verilator wrapped with N-API. All top level signals are accessible via this import
const dut = require('../build/Release/dut.node');
//Sim manages tasks and advances time
//RisingEdge/FallingEdge - wait under rising/falling edge detect on a given signal
const {Sim, SimUtils, RisingEdge, RisingEdges, FallingEdge, FallingEdges, Edge, Edges, Interfaces} = require('signalflip-js');
const { Clock, Intf } = SimUtils;
//A nice to have utililty to deal with arrays
const _ = require('lodash');

let sim;

describe('Test', () => {
  let setup = (name) => {
    // set up the environment
    dut.init(name); // Init dut
    sim = new Sim(dut);

    // TODO: Create clock
    let clk = new Clock(dut.clk, 1)
    sim.addClock(clk)

    // Init input signals
    dut.rstf(0);
    dut.en(0);
    
    // RESET task -- assert reset for 5 clock cycles
    sim.addTask(function* () {
      dut.rstf(0);
      yield* RisingEdges(dut.clk, 5);
      dut.rstf(1);
      yield* RisingEdge(dut.clk);
    }(), 'RESET');

    // TODO: Add post_run tasks (test checking)
    // sim.addTask(() => { /* post_run function */}, 'POST_RUN'});

  };
  it('Test 1', function () {
    this.timeout(10000); // Set timeout to expected run time of the test in ms
    setup('top_test1');
    function* drive() {
      dut.en(1);
      yield* RisingEdges(dut.clk, 10);
      dut.en(0);
    }
    sim.addTask(drive());
    // Run simulation for 50 ticks
    sim.run(50); //run for 50 ticks
  });

  it('Test 2', function () {
    this.timeout(10000);
    setup('top_test2');
    function* drive() {
      dut.en(1);
      yield* RisingEdges(dut.clk, 5);
      dut.en(0);
      yield* RisingEdges(dut.clk, 5);
      dut.en(1);
    }
    sim.addTask(drive());
    // Run simulaltion for 50 ticks
    sim.run(50); //run for 50 ticks
  });
});

