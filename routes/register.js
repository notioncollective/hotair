
/*
 * POST register form handler.
 */

exports.register = function(req, res) {
  var data = req.body;

  // Check if username is in use
  db.get(data.username, function(err, doc) {
    if(doc) {
      res.render('add', {flash: 'Username is in use'});

    // Check if confirm password does not match
    } else if(data.password != data.confirm_password) {
      res.render('add', {flash: 'Password does not match'});

    // Create user in database
    } else {
      delete data.confirm_password;
      db.save(data.username, data,
        function(db_err, db_res) {
          res.render('add', {flash: 'User created'});
        });
    }
  });
};