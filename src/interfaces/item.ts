import { Document, ObjectId } from "mongoose";

export default interface IItem extends Document {
    title: string;
    price: string;
    url: string;
    img: string;
    search_id: string;
}
