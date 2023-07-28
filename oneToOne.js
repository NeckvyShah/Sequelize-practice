const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize("sequelize_practice", "root", "Simform@123", {
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Error COnnecting to DB");
  });

const Country = sequelize.define(
  "country",
  {
    countryName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Capital = sequelize.define(
  "capital",
  {
    capitalName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

Country.hasOne(Capital);
Capital.belongsTo(Country);

let country, capital;

sequelize
  .sync({ alter: true })
  .then(() => {
    return Country.create({
      countryName: "USA",
    });
  })
  .then((data) => {
    country = data;
    return country.createCapital({ capitalName: "Washington,DC" });
  })
  .then((data) => {
    console.log(data.toJSON());
  })
  .catch((err) => {
    console.log(err);
  });
