import { Router, Request, Response } from 'express';
import postsModel from './posts.model';
import postInterface from './post.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import createPostDto from './post.dto';

export default class PostController {
  public router: Router;
  public path: string = '/posts';
  constructor() {
    this.router = Router();
    this.handleRoutes();
  }

  private handleRoutes(): void {
    // Create a new post
    this.router.post(
      this.path,
      validationMiddleware(createPostDto),
      this.createPost
    );
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  /**
   * Create a new post
   * @param request
   * @param response
   *
   */
  private createPost(request: Request, response: Response): void {
    const postData: postInterface = request.body;
    const createPost = new postsModel(postData);
    createPost
      .save()
      .then((result: postInterface) => {
        console.log(result);
        response.send(result);
      })
      .catch((error: Error) => {
        response.status(500).send(error.message);
      });
  }
  /**
   * Get all existed posts
   * @param request
   * @param response
   */
  private async getAll(request: Request, response: Response): Promise<void> {
    try {
      const posts = await postsModel.find();
      response.send(posts);
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  /**
   * Get only one post by an id
   * @param request
   * @param response
   */

  private async getById(request: Request, response: Response): Promise<void> {
    try {
      const post = await postsModel.findById(request.params.id);
      response.send(post);
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  /**
   * Update an existing post
   */
  private async update(request: Request, response: Response): Promise<void> {
    try {
      const id = request.params.id;
      const postData: postInterface = request.body;
      const updatedPost = await postsModel.findByIdAndUpdate(id, postData, {
        new: true,
      });
      response.send(updatedPost);
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

  /**
   * Delete an existing post
   */

  private async delete(request: Request, response: Response): Promise<void> {
    try {
      const id = request.params.id;
      await postsModel.findByIdAndDelete(id);
      response.send('the post deleted successfully');
    } catch (error) {
      response.status(500).send(error.message);
    }
  }
}
