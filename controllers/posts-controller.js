const Post = require("../models/post");
const paginate = require("express-paginate");
const Comment = require("../models/comment");

const addOne = async(req, res) => {
    const newRecord = new Post({
        ...req.body,
        createdBy: req.user._id,
    });

    try {
        if (!newRecord.slug) {
            newRecord.slug = generateSlug(newRecord.title);
        }
        await newRecord.save();
        return res.status(201).json({
            message: "Item successfully created",
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

const removeOne = async(req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                message: "Item not found",
                success: false,
            });
        }
        return res.status(204).json({
            message: "Item successfully deleted",
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

const updateOne = async(req, res) => {
    try {
        let post = req.body;
        post.slug = generateSlug(post.title);
        await Post.findByIdAndUpdate(req.params.id, post);
        return res.status(201).json({
            message: "Item successfully updated",
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

const getAll = async(req, res) => {
    try {
        const [results, itemCount] = await
        Promise.all([
            Post.find({})
            .populate("categoy", "title")
            .sort({ createdAt: -1 })
            .limit(req.query.limit)
            .skip(req.skip)
            .lean()
            .exec(),
            Post.count({}),
        ]);
        const pageCount = Math.ceil(itemCount / req.query.limit);
        return res.status(201).json({
            object: "list",
            has_more: paginate.hasNextPages(req)(pageCount),
            data: results,
            pageCount,
            itemCount,
            currentPage: req.query.page,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

const getOne = async(req, res) => {
    try {
        let item = await Post.findByIdAndUpdate(req.params.id, {
            $inc: { viewsCount: 1 },
        }).populate("category", "title");
        if (item) {
            item.comments = await Comment.find({ post: item._id });
            return res.status(200).json(item);
        }
        return res.status(404).json({
            message: "Item not found",
            success: false,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

const getTopposts = async(req, res) => {
    try {
        let result = await Post.find({})
            .populate("category", "title")
            .sort({ viewsCount: -1 })
            .limit(3)
            .lean()
            .exec();

        return res.status(201).json({
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

const getOneBySlug = async(req, res) => {
    try {
        let item = await Post.findOneAndUpdate({ slug: req.params.slug }, {
            $inc: { viewsCount: 1 },
        }).populate("category", "title");
        if (item) {
            item.comments = await Comment.find({ post: item._id });
            return res.status(200).json(item);
        }
        return res.status(404).json({
            message: "Item not found",
            success: false,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

const generateSlug = (title) => {
    const slugText = title.toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");

    return slugText;
}

module.exports = {
    addOne,
    removeOne,
    updateOne,
    getAll,
    getOne,
    getTopposts,
    getOneBySlug
}