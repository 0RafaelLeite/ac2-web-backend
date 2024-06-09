const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Access denied');
    }

    const [,token] = authHeader.split(" ")

    try{
        const password = process.env.JWT_SECRET;
        req.user = jwt.verify(token, password)
        await jwt.verify(token, password);
        next()
    }catch(error){
        return res.status(401).json({message: "Invalid token"})
    }
};

module.exports = auth