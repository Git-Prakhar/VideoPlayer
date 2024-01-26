import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: [true, "Provide Video File"]
    },
    thumbnail: {
        type: String,
        required: [true, "Provide Video Thumbnail"]
    },
    title: {
        type: String,
        required: [true, "Enter Video Title"],
        maxchars: 100,
        minchars: 30,
    },
    description: {
        type: String,
        required: [true, "Enter Video Description"],
        maxchars: 1000,
        minchars: 200,
    },
    duration: {
        type: Number
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);