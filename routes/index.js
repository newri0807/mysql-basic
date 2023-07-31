var express = require("express");
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get("/", function (req, res, next) {
//   res.render("sections", { title: "섹션 목록" });
// });

//sql setting
var sql = require("../database/sql");

const sectionIcons = ["🍚", "🍿", "🍜", "🍣", "🥩", "☕", "🍰"];

router.get("/", async function (req, res, next) {
  const sections = await sql.getSections();
  sections.map((item) => {
    item.icon = sectionIcons[item.section_id - 1];
  });

  res.render("sections", {
    title: "섹션 목록",
    sections,
  });
});

const statusKorMap = {
  OPN: "영업중",
  CLS: "폐업",
  VCT: "휴가중",
  RMD: "리모델링",
};

router.get("/biz-simple", async function (req, res, next) {
  //console.log(req, "request 지금확인!");
  const businesses = await sql.getBusinessesJoined(req.query);
  businesses.map((item) => {
    item.status_kor = statusKorMap[item.status];
    return item;
  });

  res.render("biz-simple", {
    title: "단순 식당 목록",
    businesses,
  });
});

// 필터링
router.get("/biz-adv", async function (req, res, next) {
  console.log(`req.query`, req.query);
  const businesses = await sql.getBusinessesJoined(req.query);
  businesses.map((item) => {
    item.status_kor = statusKorMap[item.status];
    return item;
  });

  res.render("biz-adv", {
    title: "고급 식당 목록",
    q: req.query,
    businesses,
  });
});

// 세부 페이지 이동
router.get("/business/:id", async function (req, res, next) {
  const biz = await sql.getSingleBusinessJoined(req.params.id);
  biz.status_kor = statusKorMap[biz.status];
  biz.icon = sectionIcons[biz.section_id - 1];

  const menus = await sql.getMenusOfBusiness(req.params.id);
  const ratings = await sql.getRatingsOfBusiness(req.params.id);

  res.render("detail", {
    biz,
    menus,
    ratings,
  });
});

// 좋아요 수정
router.put("/menus/:id", async function (req, res, next) {
  const result = await sql.updateMenuLikes(req.params.id, req.body.like);
  res.send(result);
});

// 별점과 코멘트 달기 구현
router.post("/ratings", async function (req, res, next) {
  const result = await sql.addRating(
    req.body.business_id,
    req.body.stars,
    req.body.comment
  );
  res.send(result);
});

router.delete("/ratings/:id", async function (req, res, next) {
  const result = await sql.removeRating(req.params.id);
  res.send(result);
});

module.exports = router;
