
import { getPost } from '../js/api.mjs';

window.app = (() => {
  function post() {
    return {
      data: null,
      isFetched: false,
      isLoading: false,
      fetch() {
        this.isLoading = true;
        return getPost(new URLSearchParams(location.search).get('id'))
          .then((post) => {
            this.isFetched = true;
            this.data = post;
            return post;
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    };
  }

  return {
    post,
  };
})();
