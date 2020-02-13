import Sequelize from 'sequelize';


// eslint-disable-next-line import/no-named-as-default
import User from '../app/models/Users';
import Files from '../app/models/Files';
import Appointments from '../app/models/Appointments';

import databaseConfig from '../config/database';

const models = [User, Files, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb+srv://douglas:Valira251092@cluster0-uayve.mongodb.net/gobarber?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
