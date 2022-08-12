import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

function startingMiddleware(app) {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: "You exceeded 100 requests in 15 minutes limit!",
    });

    // Apply the rate limiting middleware to all requests
    app.use(limiter);
    app.use(xss());
    app.use(mongoSanitize());
    app.use(compression());
    app.use(helmet());
    app.use(methodOverride('_method'));
    // Use helmet to secure Express headers
    app.disable('x-powered-by');
    app.use(morgan('dev'));
    app.use('/public', express.static('public'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors({
        origin: true,
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
        credentials: true,
        optionSuccessStatus: 200
    }));
    app.use(function (err, req, res, next) {
        console.error(err.message)
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).send(err.message || 'Something went wrong')
    })
}

export { startingMiddleware }