import mongoose from 'mongoose';
import postInterface from './post.interface';
const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  title: String,
});

const postModel = mongoose.model<postInterface & mongoose.Document>(
  'Post',
  postSchema
);

export default postModel;
