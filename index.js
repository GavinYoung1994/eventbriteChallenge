var server = require('./server');

var PORT = 5000;

server.listen(PORT, function () {
    console.log('Server started on port ' + PORT.toString());
});