import mongoose,{ Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = Schema({
    videoFile: {
        type: String, // Going to store Cloudinary URL
        required: true,
    },
    thumbnail: {
        type: String, // Going to store Cloudinary URL
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        // required: true,
        default: 0
    },
    isPublic: {
        type: Boolean,
        // required: true,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = model("Video", videoSchema);