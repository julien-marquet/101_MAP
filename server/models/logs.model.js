var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    var LogSchema = new Schema({
        content: String
    });
    
    // save the model
    var Log = mongoose.model('Log', LogSchema);
var test = new Log({ content: 'test' }); 
test.save(function (err) { 
    if (err) {
        console.log(err);
    }
    console.log("saved");
     // saved! 
     Log.find({}, function (err, log) {
          if (err) return handleError(err);
        console.log(log)
     });
})