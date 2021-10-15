import * as api from 'api.js';

export async function post(req, res) {
    api.get('users/current', req.session.token).then(response => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    })
}