const mysql = require('mysql')
//connection pool
const pool = mysql.createPool({
    add
});


exports.nav = (req, res) => {
    res.render('nav');
}
//view users
exports.view = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM user WHERE status ="active" ORDER BY id', (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                let removedUser = req.query.removed;
                res.render('home', { rows, removedUser });
            } else {
                console.log(err);
            }
            
        });
    });
}

//find user by search 
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);

        let searchTerms = req.body.search;
        console.log(searchTerms)
        //User the connection
        connection.query('SELECT * FROM user WHERE First_name LIKE ? OR Last_name LIKE ?', ['%' + searchTerms + '%', '%' + searchTerms + '%'], (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('home', { rows });
            } else {
                console.log(err);
            }
            
        });
    });
}

exports.form = (req, res) => {
    res.render('add-user');
}


//Add users
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments} = req.body
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);

        //User the connection
        connection.query('INSERT INTO user SET First_name = ?, Last_name = ?, email = ?, phone = ?,comments = ?,status ="active"', [first_name, last_name, email, phone, comments], (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('add-user', { alert: 'User added successfully.' });
            } else {
                console.log(err);
            }
            
        });
    });
}

//Edit users
exports.edit = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                res.render('edit-user', { rows });
            } else {
                console.log(err);
            }
            
        });
    });
}

//update user
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);

        //User the connection
        connection.query('UPDATE user SET First_name = ?, Last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            //when done with the connection, release it
            connection.release();
            if (!err) {
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('Connected as ID' + connection.threadId);

                    //User the connection
                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                        //when done with the connection, release it
                        connection.release();
                        if (!err) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
                        } else {
                            console.log(err);
                        }
                        
                    });
                });
            } else {
                console.log(err);
            }
            
        });
    });
}

// Delete user
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);

        //User the connection
        connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with the connection, release it
            //connection.release();
            if (!err) {
                let removedUser = encodeURIComponent('User Successfully removed');
                res.redirect('/?removed=' + removedUser);
            } else {
                console.log(err);
            }
            
        });
    });
}

exports.viewUser = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            //when done with the connection, release it
            //connection.release();
            if (!err) {
                res.render('view-user', {rows});
            } else {
                console.log(err);
            }
            
        });
    });
   
}