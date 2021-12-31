class Website {
  constructor(private url: string) {
  }

  getUrl() {
    return this.url;
  }
}

class User {
  constructor(private username: string) {
  }

  getUsername() {
    return this.username;
  }
}

class BlogPost {
  constructor(private author: User, private id: string) {
  }

  getId() {
    return this.id;
  }

  getAuthorName() {
    return this.author.getUsername();
  }
}

function generatePostLink(website: Website, post: BlogPost) {
  let url = website.getUrl();
  let name = post.getAuthorName();
  let postId = post.getId();
  return url + name + postId;
}
