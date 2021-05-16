import { Request, Response } from "express";
import mongoose from "mongoose";
import Item from "../models/item";
import Search from "../models/search";

const createItem = async (req: Request, res: Response) => {
  const items = req.body;
  let { search_id } = req.params;

  try {
    let results: any = [];

    if(Array.isArray(items) && items.length > 0 ) {

      const a = items.map(async (x) => {
        const item = new Item({
          _id: new mongoose.Types.ObjectId(),
          title: x.title,
          price: x.price,
          url: x.url,
          img: x.img,
          search_id,
        });

        const result = await item.save();

        await Search.updateOne(
          { _id: search_id },
          { $push: { items: result._id } }
        ).exec();

        results.push(result);
      });

      await Promise.all(a);

      return res.status(201).json({
        item: results,
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const deleteItem = async (req: Request, res: Response) => {
  let { id } = req.params;

  try {
    const result = await Item.findByIdAndDelete(id).exec();

    if (!result) {
      return res.sendStatus(404);
    } else {
      await Search.updateOne({ _id: result.search_id }, { $pull: { items: id } }).exec();

      return res.status(200).json({
        done: `Item whith id: ${id} deleted.`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default { createItem, deleteItem };
