/**
 * @typedef TPost
 * 
 * @property { number } userId
 * @property { number } id
 * @property { string } title
 * @property { string } body
 */

class Post {
  /**
   * 
   * @param {TPost} post
   */
  constructor({ userId, id, title, body }) {
    this.userId = userId;
    this.id = id;
    this.title = title;
    this.body = body;
  }

  htmlBody() {
    return this.body.replace(/\n/g, "<br>");
  }
}

/**
 * 
 * @returns { Promise<Post[]> }
 */
export function getPosts() {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((posts) => posts.map((post) => new Post(post)));
}

/**
 * @param { number } id
 * @returns { Promise<Post[]> }
 */
export function getPost(id) {
  return fetch("https://jsonplaceholder.typicode.com/posts/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((post) => new Post(post));
}