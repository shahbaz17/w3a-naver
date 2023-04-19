require('dotenv').config(); // enables loading .env vars
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');

// Allow requests from client-side
app.use(cors({ origin: 'http://localhost:3000' }));

// create application/json parser
var jsonParser = bodyParser.json()

app.post('/api/token', jsonParser, async (req, res) => {
	const { clientId, accessToken, naverUser } = req.body;
	console.log("accessToken", accessToken)
	try {
		var privateKey = fs.readFileSync('privateKey.pem');
		var token = jwt.sign(
			{
				sub: naverUser.id,
				name: naverUser.name,
				email: naverUser.email,
				profileImage: naverUser.profile_image,
				aud: clientId, // -> to be used in Custom Authentication as JWT Field
				iss: 'https://web3auth.io', // -> to be used in Custom Authentication as JWT Field
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 60 * 60,
			},
			privateKey,
			{ algorithm: 'RS256', keyid: '955104a37fa903d9u2h3dinw45ec9e83edb29b0c45' },
		);
		console.log("token", token)
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const listener = app.listen(process.env.PORT || 8080, () =>
	console.log('Listening on port ' + listener.address().port),
);
