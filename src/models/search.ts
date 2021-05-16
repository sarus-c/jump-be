import mongoose, { Schema } from "mongoose";
import logging from "../config/logging";
import ISearch from "../interfaces/search";

const SearchSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  {
    timestamps: true,
  }
);

SearchSchema.post<ISearch>("save", function () {
  logging.info("Mongo", "Checkout the search term we just saved: ", this);
});

export default mongoose.model<ISearch>("Search", SearchSchema);
