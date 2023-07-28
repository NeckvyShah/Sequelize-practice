const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;

const sequelize = new Sequelize("sequelize_practice", "root", "Simform@123", {
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log("errror connecting", err);
  });

const Customer = sequelize.define(
  "customer",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Product = sequelize.define(
  "product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const CustomerProduct = sequelize.define(
  "customerProduct",
  {
    customerProductId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

Customer.belongsToMany(Product, {
  foreignKey: "customer_id",
  through: CustomerProduct,
});
Product.belongsToMany(Customer, {
  foreignKey: "product_id",
  through: CustomerProduct,
});

let product, customer;

sequelize
  .sync({ alter: true })
  .then(() => {
    return Customer.findOne({
      where: {
        customer_name: "Bob",
      },
    });
  })
  .then((data) => {
    customer = data;
    return Product.findOne({
      where: {
        product_name: "Microwave",
      },
    });
  })
  .then((data) => {
    product = data;
    customer.addProduct(product);
  })
  .then(() => {
    console.log("ok");
  })
  .catch((err) => {
    console.log(err);
  });
