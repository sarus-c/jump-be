import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Search from "../models/search";
import Item from "../models/item";

const createSearch = async (req: Request, res: Response) => {
  let { title, url } = req.body;

  const search = new Search({
    _id: new mongoose.Types.ObjectId(),
    title,
    url,
  });

  try {
    const result = await search.save();
    return res.status(201).json({
      search: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getSearches = async (req: Request, res: Response) => {
  try {
    const result = await Search.find().populate("items").exec();

    return res.status(200).json({
      searches: result,
      count: result.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getSearcheById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Search.findById(id).exec();

    return res.status(200).json({
      searche: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const deleteSearchAndItems = async (req: Request, res: Response) => {
  let { id } = req.params;

  try {
    const result = await Search.findByIdAndDelete(id).exec();
    if (!result) {
      return res.sendStatus(404);
    } else {
      await Item.deleteMany({ search_id: id }).exec();

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

export default {
  createSearch,
  getSearches,
  deleteSearchAndItems,
  getSearcheById,
};
