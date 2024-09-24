const service = require("./restaurants.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function averageRating(req, res, next) {
  // your solution here
  const answer = await service.averageRating();
  answer[0].average_rating = Number(answer[0].average_rating)
  res.json({ data: answer[0] });
}

async function list(req, res) {
  res.json({ data: await service.list() });
}

async function count(req, res, next) {
  // your solution here
  const answer = await service.count();
  answer[0].count = parseInt(answer[0].count, 10)
  res.json({ data: answer[0] });
}

async function create(req, res, next) {
  const newRestaurant = ({
    restaurant_name,
    address,
    cuisine,
    rating,
  } = req.body.data);
  const createdRestaurant = await service.create(newRestaurant);
  res.status(201).json({ data: createdRestaurant });
}

async function read(req, res) {
  res.json({ data: res.locals.restaurant });
}

async function readHighestRating(req, res, next) {
  // your solution here
  const answer = await service.readHighestRating();
  res.json({ data: answer[0] });
}

async function restaurantExists(req, res, next) {
  const restaurant = await service.read(req.params.restaurantId);

  if (restaurant) {
    res.locals.restaurant = restaurant;
    return next();
  }
  next({ status: 404, message: `Restaurant cannot be found.` });
}

async function update(req, res) {
  const updatedRestaurant = {
    ...req.body.data,
    restaurant_id: res.locals.restaurant.restaurant_id,
  };

  const data = await service.update(updatedRestaurant);
  res.json({ data });
}

async function destroy(req, res) {
  await service.delete(res.locals.restaurant.restaurant_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  count: asyncErrorBoundary(count),
  averageRating: asyncErrorBoundary(averageRating),
  readHighestRating: asyncErrorBoundary(readHighestRating),
  create: asyncErrorBoundary(create),
  update: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(restaurantExists), asyncErrorBoundary(destroy)],
  read: [asyncErrorBoundary(restaurantExists), read],
};
