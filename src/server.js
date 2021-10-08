import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import session from 'express-session';
import session from 'session-file-store';

const FileStore = sessionFileStore(session);

const {json} = require("body-parser");
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		json(),
		sirv('static', { dev }),
        session({
            secret: 'serv',
            resave: false,
            saveUnitialized: true,
            cookie: {
                maxAge: 31536000
            },
            store: new FileStore({
                path: '.sessions'
                }),
            }),
            sapper.middleware({
                session: req => ({
                    user: req.session && req.session.user,
                    token: req.session && req.session.token
                })
            })
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});