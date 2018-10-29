import React from 'react';
import { effects, util } from 'ferp';

import { connect } from '../index.js';

// Models

const createIdGenerator = () => ({
  done: false,
  next: () => Math.random().toString(36).substr(2, 9),
});

const createColorGenerator = () => ({
  done: false,
  next: () => `#${Math.random().toString(16).substr(2, 6)}`,
});

const createPost = (id, author, content, createdAt, color) => {
  return {
    id,
    author,
    content,
    createdAt,
    color,
    children: [],
    reply: '',
  };
};

// Reducers

const reduceIdentity = value => [value, effects.none()];

const postsReducer = (message, posts, parentId, author) => util.combineReducers(posts.map(
  post => postReducer(message, post, parentId, author)
));

const postReducer = (message, post, parentId, author) => {
  const action = [message.type, message.postId].join('.');

  switch (action) {
    case `POST_SET_REPLY.${post ? post.id : ''}`:
      return util.combineReducers({
        id: reduceIdentity(post.id),
        author: reduceIdentity(post.author),
        content: reduceIdentity(post.content),
        color: reduceIdentity(post.color),
        createdAt: reduceIdentity(post.createdAt),
        children: postsReducer(message, post.children, post.id, author),
        reply: reduceIdentity(message.reply),
      });

    case `POST_CREATE.${post ? post.id : ''}`:
      return util.combineReducers({
        id: reduceIdentity(post.id),
        author: reduceIdentity(post.author),
        content: reduceIdentity(message.content),
        color: reduceIdentity(post.color),
        createdAt: reduceIdentity(post.createdAt),
        children: postsReducer(message, post.children.concat(createPost(message.id, author, post.reply, Date.now(), message.color)), post.id, author),
        reply: reduceIdentity(''),
      });

    default:
      return util.combineReducers({
        id: reduceIdentity(post.id),
        author: reduceIdentity(post.author),
        content: reduceIdentity(post.content),
        color: reduceIdentity(post.color),
        createdAt: reduceIdentity(post.createdAt),
        children: postsReducer(message, post.children, post.id, author),
      });
  }
};

const authorReducer = (message, author) => {
  switch (message.type) {
    case 'SET_AUTHOR':
      return reduceIdentity(message.author);

    default:
      return reduceIdentity(author);
  }
};


// Initial State

const ids = createIdGenerator();
const initialActivePostId = ids.next();
const colors = createColorGenerator();

export const initialState = {
  root: createPost(initialActivePostId, 'ROOT', 'Discuss your business here', Date.now(), colors.next()),
  author: 'Anonymous',
  idGenerator: ids,
  colorGenerator: colors,
  activePostId: initialActivePostId,
};

// Update

export const update = (message, state) => util.combineReducers({
  root: postReducer(message, state.root, null, state.author),
  author: authorReducer(message, state.author),
  idGenerator: reduceIdentity(state.idGenerator),
  colorGenerator: reduceIdentity(state.colorGenerator),
});

const PostCollection = connect(({ replyText, containerStyle, post, collection, dispatch, state }) => (
  <div style={containerStyle}>
    {collection.map(childPost => <Post key={childPost.id} post={childPost} parentId={post.id} />)}

    {true && <div>
      <textarea
        className="threads-post__collection-textarea"
        cols="50"
        rows="1"
        onChange={e => dispatch({ type: 'POST_SET_REPLY', postId: post ? post.id : null, reply: e.target.value })}
        value={post.reply}
      />
      <button
        disabled={!post.reply}
        onClick={() => dispatch({
          type: 'POST_CREATE',
          postId: post ? post.id : null,
          id: state.idGenerator.next(),
          color: state.colorGenerator.next(),
        })}
      >
        {replyText}
      </button>
    </div>}
  </div>
));

const Post = ({ post, parentId }) => (
  <section style={{ borderLeft: `1px ${post.color} solid`, paddingLeft: '8px', marginBottom: '8px' }}>
    <div className="threads-post">
      <header><i>{post.author} - {parseInt((Date.now() - post.createdAt) / 1000, 10)}s ago</i></header>

      <article>{post.content}</article>
    </div>

    <PostCollection
      replyText={parentId ? "Reply to Thread" : "New Thread"}
      containerStyle={{ margin: '16px 0 0 16px', paddingLeft: '4px' }}
      post={post}
      collection={post.children}
    />
  </section>
);

export const Component = connect(({ state, dispatch }) => (
  <div className="threads">
    <div>
      <label>
        User Name:
        <input type="text" value={state.author} onChange={e => dispatch({ type: 'SET_AUTHOR', author: e.target.value })} />
      </label>
    </div>

    <Post post={state.root} />
  </div>
));
