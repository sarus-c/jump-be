import mongoose, { Schema } from "mongoose";
import logging from "../config/logging";
import IItem from "../interfaces/item";

const ItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    url: { type: String, required: true },
    img: { type: String, required: true },
    search_id: {
      type: Schema.Types.ObjectId,
      ref: "Search",
    },
  },
  {
    timestamps: true,
  }
);

ItemSchema.post<IItem>("save", function () {
  logging.info("Mongo", "Checkout the item we just saved: ", this);
});

export default mongoose.model<IItem>("Item", ItemSchema);
