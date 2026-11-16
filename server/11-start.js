const internalPortBase = Number(process.env.INTERNAL_PORT_BASE) || config.internalPortBase || 9030
create('ffa', internalPortBase + 0)
create('2teams', internalPortBase + 1)
create('4teams', internalPortBase + 2)
create('crossroads', internalPortBase + 3)
create('sanctuary', internalPortBase + 4)
create('abyss', internalPortBase + 5)
create('void', internalPortBase + 6)
create('editor', internalPortBase + 7)
create('testing', internalPortBase + 8)
create('mg:survival', internalPortBase + 9)

process.on('exit', function(code){
  return console.log(`[main] Exiting with code ${code}`);
});
