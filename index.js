//constructor function that why CAPTIAL S
const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;
const bcrypt = require("bcrypt");
const zlib = require("zlib");

// creating instance of constructor function
const sequelize = new Sequelize("sequelize_practice", "root", "Simform@123", {
  dialect: "mysql",
});

// Connecting to our DB
// authenticate is an async function so .then()
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Error COnnecting to DB");
  });

// CREATING MODELS
const User = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false, //will not allow null values
      defaultValue: "Not specified",
      validate: {
        len: [4, 40],
      },
      get() {
        const rawValue = this.getDataValue("username");
        return rawValue.toUpperCase();
      },
    },

    password: {
      type: DataTypes.STRING,
      set(value) {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
      },
    },

    age: {
      type: DataTypes.INTEGER,
    },

    isCustomer: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    description: {
      type: DataTypes.STRING,
      set(value) {
        const compressed = zlib.deflateSync(value).toString("base64");
        this.setDataValue("description", compressed);
      },
      get() {
        const value = this.getDataValue("description");
        const uncompressed = zlib.inflateSync(Buffer.from(value, "base64"));
        return uncompressed.toString();
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);

User.sync({ alter: true })
  .then(() => {
    // querying data
    return User.create({
      username: "desc user",
      password: "password",
      description:
        "THis is my description. but it is very long. so dont try to read it. if you do and understand, thn let me know",
    });
  })
  .then((data) => {
    console.log(data.username);
    console.log(data.password);
  })
  .catch((err) => {
    console.log("Error syncing the table and model", err);
  });
