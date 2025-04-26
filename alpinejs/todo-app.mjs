window.app = (() => {
  function todos($persist) {
    return {
      _todos: $persist ? $persist([]) : [],
      todos() {
        return this._todos.toSorted((a, b) => b.id - a.id);
      },
      add(e) {
        e.preventDefault();
        const title = e.target.title.value;
        this._todos.push({ id: Date.now(), title });
        e.target.reset();
      },
      remove(e) {
        const id = +e.target.dataset.id;
        this._todos = this._todos.filter((e) => e.id !== id);
      },
    };
  }

  return {
    todos,
  };
})();
