const app = require("./app");
const PORT  = process.env.PORT || 5500;


const StartApp = () => {
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
};
 StartApp();

