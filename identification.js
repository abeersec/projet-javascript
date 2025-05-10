const jwt = require('jsonwebtoken');

exports.identifiers = (req,res,next) =>{
   let token;
   if (req.headers['client-type'] === 'not-browser') {
      token = req.headers.authorization;
 } else {
      token = req.cookies.Authorization;
}

if (!token) {
return res.status(401).json({ success: false, message: 'Non autorisé' });
}

 try {
   const userToken = token.split(' ')[1];
   const decoded = jwt.verify(userToken, process.env.TOKEN_SECRET);
   req.user = decoded;
   next();
 } catch (error){
    res.status(401).json({ success: false, message: 'Token invalide'});  
 }
};