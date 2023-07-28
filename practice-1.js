const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;

// creating instance of constructor function
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

const Student = sequelize.define(
  "student",
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 20],
      },
    },

    favourite_class: {
      type: DataTypes.STRING,
      defaultValue: "Computer Science",
    },

    school_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subscribed_to_course: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// creating the table and inserting the values
// Student.sync({ alter: true })
//   .then(() => {
//     return Student.bulkCreate(
//       [
//         {
//           name: "Neckvy",
//           favourite_class: "English",
//           school_year: 2018,
//           subscribed_to_course: true,
//         },
//         {
//           name: "Jeel",
//           favourite_class: "Maths",
//           school_year: 2019,
//           subscribed_to_course: false,
//         },
//         {
//           name: "Harshit",
//           favourite_class: "Computer",
//           school_year: 2020,
//           subscribed_to_course: true,
//         },
//         {
//           name: "Sahil",
//           school_year: 2021,
//           subscribed_to_course: true,
//         },
//         {
//           name: "Jayyy",
//           favourite_class: "Geography",
//           school_year: 2022,
//           subscribed_to_course: false,
//         },
//       ],
//       {
//         validate: true,
//       }
//     );
//   })
//   .then((data) => {
//     data.forEach((element) => {
//       console.log(element.toJSON());
//     });
//   })
//   .catch((err) => {
//     console.log("Error", err);
//   });

// Retrieve the name of every student whose favourite class is computer science or they are subscribed to course
// Student.sync()
//   .then(() => {
//     return Student.findAll({
//       attributes: ["name"],
//       where: {
//         [Op.or]: {
//           favourite_class: "Computer Science",
//           subscribed_to_course: true,
//         },
//       },
//     });
//   })
//   .then((data) => {
//     data.forEach((element) => {
//       console.log(element.toJSON());
//     });
//   })
//   .catch((err) => {
//     console.log("error", err);
//   });

// Count the total number of students in each school year and give the returned column the alias num_students

Student.sync()
  .then(() => {
    return Student.findAll({
      attributes: [
        "school_year",
        [sequelize.fn("COUNT", sequelize.col("school_year")), "num_students"],
      ],
      group: "school_year",
    });
  })
  .then((data) => {
    data.forEach((element) => {
      console.log(element.toJSON());
    });
  })
  .catch((err) => {
    console.log("error", err);
  });
