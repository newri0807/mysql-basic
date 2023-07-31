const mysql = require("mysql2");
require("dotenv").config(); // nodejs에선 npm install dotenv 설치 해줘야함
const { DB_SCHEMA_NAME, DB_PASSWORD } = process.env;

const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: "localhost",
    user: "root",
    database: DB_SCHEMA_NAME, // 스키마 명
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
);
const promisePool = pool.promise();

const sql = {
  getSections: async () => {
    const [rows] = await promisePool.query(`
      SELECT * FROM sections
    `);
    return rows;
  },
  // 필터링
  getBusinessesJoined: async (query) => {
    //console.log(query, "지금확인---");
    const sqlQuery = `
      SELECT * FROM sections S
      LEFT JOIN businesses B
        ON S.section_id = B.fk_section_id
      WHERE TRUE
        ${query.section ? "AND section_id = " + query.section : ""}
        ${query.floor ? "AND floor = " + query.floor : ""}
        ${query.status ? "AND status = '" + query.status + "'" : ""}
      ORDER BY
         ${query.order ? query.order : "business_id"}
    `;
    console.log(sqlQuery);

    const [rows] = await promisePool.query(sqlQuery);
    return rows;
  },
  // 상세페이지
  getSingleBusinessJoined: async (business_id) => {
    const [rows] = await promisePool.query(`
      SELECT * FROM sections S
      LEFT JOIN businesses B
        ON S.section_id = B.fk_section_id
      WHERE business_id = ${business_id}
    `);
    return rows[0];
  },

  getMenusOfBusiness: async (business_id) => {
    const [rows] = await promisePool.query(`
      SELECT * FROM menus
      WHERE fk_business_id = ${business_id}
    `);
    return rows;
  },

  getRatingsOfBusiness: async (business_id) => {
    const [rows] = await promisePool.query(`
      SELECT rating_id, stars, comment,
      DATE_FORMAT(
        created, '%y년 %m월 %d일 %p %h시 %i분 %s초'
      ) AS created_fmt
      FROM ratings
      WHERE fk_business_id = ${business_id}
    `);
    return rows;
  },
  // 좋아요 수 변경
  updateMenuLikes: async (id, like) => {
    return await promisePool.query(`
      UPDATE menus
      SET likes = likes + ${like}
      WHERE menu_id = ${id}
    `);
  },

  // 별점과 코멘트 달기  구현
  addRating: async (business_id, stars, comment) => {
    return await promisePool.query(`
      INSERT INTO ratings
      (fk_business_id, stars, comment)
      VALUES
      (${business_id}, '${stars}', '${comment}')
    `);
  },

  removeRating: async (rating_id) => {
    return await promisePool.query(`
      DELETE FROM ratings
      WHERE rating_id = ${rating_id}
    `);
  },
};

module.exports = sql;
