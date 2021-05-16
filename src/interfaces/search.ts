import { Document, ObjectId } from "mongoose";

export default interface ISearch extends Document {
  title: string;
  url: string;
  items: ObjectId[];
}
