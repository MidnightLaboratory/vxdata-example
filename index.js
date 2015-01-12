var fs = require('fs');

var internals = {};
internals.processFile = function(input, cb) {
    fs.readFile('input/'+input.filename, function(err, contents) {
        if (err) throw err;
        console.log('data loaded from file');
        
        var output = {
            song: 'rebuild',
            artist: 'midnight laboratory',
            began_build: (new Date()).toString()
        };
        
        var power_spectrum = [];
        //split csv into separate lines
        var lines = contents.toString().split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line_data = {};
            line_data.frequency_data = [];
            var line = lines[i];
            var splitByComma = line.split(',');
            
            for (var j = 0; j < splitByComma.length; j++) {
                var element = splitByComma[j];
                if (j == 0) {
                    line_data.time = parseFloat(element);
                } else {
                    line_data.frequency_data.push(parseFloat(element));
                }
            }
            power_spectrum.push(line_data);
            if (input.breakpoint && line_data.time > input.breakpoint) {
                output.breakpoint = input.breakpoint;
                output.breakpoint_actual = line_data.time;
                break;
            }
        }
        
        output.power_spectrum = power_spectrum;
        output.finished_build = (new Date()).toString();
        
        cb(null, output);
    });
}

var filename = 'rebuild_powerspectrum.csv';
internals.processFile({ 
    filename: filename,
    breakpoint: 30 //in seconds
}, function(err, data) {
    console.log('done processing file');
    fs.writeFile('output/' + filename + '.json', JSON.stringify(data), function(err) {
        if (err) throw err;
        console.log('done writing file');
    });
});