
import { getPosts } from '../js/api.mjs';

window.app = (() => {
  function posts() {
    return {
      data: null,
      isFetched: false,
      isLoading: false,
      fetch() {
        this.isLoading = true;
        return getPosts()
          .then((posts) => {
            this.isFetched = true;
            this.data = posts;
            return posts;
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    };
  }

  return {
    posts,
  };
})();
