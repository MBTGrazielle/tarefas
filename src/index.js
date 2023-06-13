const servidor = require("./servidor");
require("dotenv").config();

servidor.listen(3008, () => console.log({ Produto: "TO DO LIST" }));
