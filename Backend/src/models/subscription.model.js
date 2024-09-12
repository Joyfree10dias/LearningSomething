import mongoose, { Schema, model, SchemaTypes } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: SchemaTypes.ObjectId,
        ref: "User"
    },
    channel : {
        type: SchemaTypes.ObjectId,
        ref: "User"
    }
}, { timestamps: true});

export const Subscription = model("Sunscription", subscriptionSchema); 