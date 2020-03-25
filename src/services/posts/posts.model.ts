import mongoose from 'mongoose';
import postInterface from './post.interface';
const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  title: String,
});

const postModel = mongoose.model<post & mongoose.Document>('Post', postSchema);

export default postModel;
