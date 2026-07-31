const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    const [likedFoods, savedFoods] = await Promise.all([
        likeModel.find({ user: req.user._id }).select('food'),
        saveModel.find({ user: req.user._id }).select('food')
    ])

    const likedFoodIds = new Set(likedFoods.map((item) => item.food.toString()))
    const savedFoodIds = new Set(savedFoods.map((item) => item.food.toString()))

    const itemsWithState = foodItems.map((item) => ({
        ...item.toObject(),
        isLiked: likedFoodIds.has(item._id.toString()),
        isSaved: savedFoodIds.has(item._id.toString())
    }))

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: itemsWithState
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully",
            isLiked: false
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like,
        isLiked: true
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully",
            isSaved: false
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save,
        isSaved: true
    })

}

async function getSaveFood(req, res) {
    const savedFoods = await saveModel
        .find({ user: req.user._id })
        .populate("food");

    res.status(200).json({
        message: "Saved foods fetched successfully",
        savedFoods
    });
}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}