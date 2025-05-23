const mongoose = require('mongoose');

const connectDatabase = () => {
      mongoose.connect(process.env.DB_LOCAL_URI)
              .then(con => {
                console.log("E_Commerce Database Connected Successfully!");
              })
              
}

module.exports = connectDatabase;
