const express = require("express");
const multer = require("multer");
const router = express.Router()
const cloudinary = require("cloudinary")
const upload = multer({ dest: "uploads/" })
const fs = require("fs");
const ImageUpload = require("../Schema/Image");
const FetchUser = require("./FetchUser");
require("dotenv").config();
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
class Error {
    constructor({ type, msg, code }) {
        this.error_type = type;
        this.error_msg = msg;
        this.status_code = code;
    }
}
router.post("/upload/image", upload.single("image"), FetchUser, async (req, res) => {
    cloudinary.v2.uploader.upload("uploads/" + req.file.filename, { public_id: req.file.filename }).then((result) => {
        if (result) {
            ImageUpload.create({
                image: result.secure_url,
                uploaded_by: user.username,
                delete_id: result.public_id
            })
            res.send("Uploaded successfully")
            fs.unlinkSync("uploads/" + result.public_id)
            return
        }
    }).catch((err) => {
        res.send(err.error.message)
        fs.unlinkSync("uploads/" + result.public_id)
        return console.log(err)
    })
})
router.post("/all/image/", async (req, res) => {
    let page = req.query.page;
    const limit = req.query.limit;
    let isNextPage;
    const allimage = await ImageUpload.find({});
    if (!allimage || allimage.length < 1) {
        return res.status(404).json({
            error: {
                error_type: "No images available",
                error_msg: "No images available",
                status_code: 404
            }
        })
    }
    const allImage = await ImageUpload.find({}).limit(limit).skip(limit * (page - 1));
    // .slice(limit * (page-1), (limit*page)+1);
    if (allimage[allimage.length - 1]._id.toString() === allImage[allImage.length - 1]._id.toString()) {
        isNextPage = false;
    } else {
        isNextPage = true;
    }
    res.json({
        post: allImage,
        isNextPage,
    });
}
)
router.delete("/image/delete/:id", FetchUser, async (req, res) => {
    let find_post = await ImageUpload.findById(req.params.id);
    if (!find_post) {
        return res.status(404).json({
            error: new Error({
                type: "Image Not found",
                msg: "Image not found",
                code: 404
            })
        })
    }
    if (find_post.uploaded_by !== user.username) {
        return res.status(401).json({
            error: new Error({
                type: "User deleting someon else's image",
                msg: "Unauthorized action",
                code: 401
            })
        })
    }
    find_post = await ImageUpload.findByIdAndDelete(req.params.id);
    cloudinary.uploader.destroy(find_post.delete_id).then((result) => {
        console.log(result)
        return
    }).catch((err) => {
        return console.log(err)
    })
    res.json(find_post);
})
router.put("/like/:id", FetchUser, async (req, res) => {
    const find_image = await ImageUpload.findById(req.params.id);
    if (!find_image) {
        return res.status(404).json({
            error: new Error({
                type: "Image Not found",
                msg: "Image not found",
                code: 404
            })
        })
    }
    const like = await ImageUpload.findByIdAndUpdate(req.params.id, { $push: { likes: user.username } }, { new: true });
    res.json(like);
})
router.put("/dislike/:id", FetchUser, async (req, res) => {
    const find_image = await ImageUpload.findById(req.params.id);
    if (!find_image) {
        return res.status(404).json({
            error: new Error({
                type: "Image Not found",
                msg: "Image not found",
                code: 404
            })
        })
    }
    const like = await ImageUpload.findByIdAndUpdate(req.params.id, { $pull: { likes: user.username } }, { new: true });
    res.json(like);
})
router.post("/like/images/", FetchUser, async (req, res) => {
    let page = req.query.page;
    const limit = req.query.limit;
    let isNextPage;
    let allimage = await ImageUpload.find({});
    let allImage = await ImageUpload.find({}).limit(limit).skip(limit * (page - 1));
    allImage = allImage.filter((e) => {
        return e.likes.includes(user.username);
    })
    allimage = allimage.filter((e) => {
        return e.likes.includes(user.username);
    })
    if (!allImage || allImage.length < 1) {
        res.json({
            post: allImage,
            isNextPage,
        });
        return
    };
    if (allimage[allimage.length - 1]._id.toString() === allImage[allImage.length - 1]._id.toString()) {
        isNextPage = false;
    } else {
        isNextPage = true;
    }
    if (!allImage || allImage.length < 1) {
        return res.status(404).json({
            error: new Error({
                type: "No liked images",
                msg: "No liked images found",
                code: 404
            })
        })
    }
    res.json({
        post: allImage,
        isNextPage,
        allImage,
        allimage
    });
})
router.put("/save/:id", FetchUser, async (req, res) => {
    const find_image = await ImageUpload.findById(req.params.id);
    if (!find_image) {
        return res.status(404).json({
            error: new Error({
                type: "Image Not found",
                msg: "Image not found",
                code: 404
            })
        })
    }
    const save = await ImageUpload.findByIdAndUpdate(req.params.id, { $push: { saves: user.username } }, { new: true });
    res.json(save);
})
router.put("/unsave/:id", FetchUser, async (req, res) => {
    const find_image = await ImageUpload.findById(req.params.id);
    if (!find_image) {
        return res.status(404).json({
            error: new Error({
                type: "Image Not found",
                msg: "Image not found",
                code: 404
            })
        })
    }
    const save = await ImageUpload.findByIdAndUpdate(req.params.id, { $pull: { saves: user.username } }, { new: true });
    res.json(save);
})
router.post("/saved/images/", FetchUser, async (req, res) => {
    let page = req.query.page;
    const limit = req.query.limit;
    let isNextPage;
    let allimage = await ImageUpload.find({});
    let allImage = await ImageUpload.find({}).limit(limit).skip(limit * (page - 1));
    allImage = allImage.filter((e) => {
        return e.saves.includes(user.username);
    })
    allimage = allimage.filter((e) => {
        return e.saves.includes(user.username);
    })
    if (!allImage || allImage.length < 1) {
        res.json({
            post: allImage,
            isNextPage,
        });
        return
    };
    if (allimage[allimage.length - 1]._id.toString() === allImage[allImage.length - 1]._id.toString()) {
        isNextPage = false;
    } else {
        isNextPage = true;
    }
    if (!allImage || allImage.length < 1) {
        return res.status(404).json({
            error: new Error({
                type: "No Saved images",
                msg: "No Saved images found",
                code: 404
            })
        })
    }
    res.json({
        post: allImage,
        isNextPage,
    });
})
module.exports = router;