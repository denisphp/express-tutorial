var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var authorRouter = require('./routes/author');
var bookRouter = require('./routes/book');
var bookinstanceRouter = require('./routes/bookinstance');
var genreRouter = require('./routes/genre');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/catalog/author', authorRouter);
app.use('/catalog/book', bookRouter);
app.use('/catalog/bookinstance', bookinstanceRouter);
app.use('/catalog/genre', genreRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

var mongoDB = 'mongodb://127.0.0.1/express_tutorial';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
