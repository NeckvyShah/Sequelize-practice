const Sequelize = require("sequelize");
const { DataTypes, Object } = Sequelize;

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

const User = sequelize.define(
  "userApp",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Post = sequelize.define(
  "post",
  {
    post_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    post_description: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

User.hasMany(Post);
Post.belongsTo(User);

let user, post;

sequelize
  .sync({ alter: true })
  .then(() => {
    return User.findOne({
      where: {
        userName: "neckvy",
      },
    });
  })
  .then((data) => {
    user = data;
    console.log(user.user_id);
    return Post.findOne({
      where: {
        post_id: user.user_id,
      },
    });
  })
  .then((data) => {
    post = data;
    return user.removePost(post);
  })
  .then(() => {
    console.log("ok");
  })
  .catch((err) => {
    console.log(err);
  });
