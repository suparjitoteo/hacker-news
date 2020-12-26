import React from "react";
import queryString from "query-string"
import { fetchItem, fetchComments } from "../utils/api";
import Loading from "./Loading";
import Comment from "./Comment";
import Title from "./Title";
import PostMetaInfo from "./PostMetaInfo";

export default class Post extends React.Component {
  state = {
    post: null,
    comments: [],
    error: null,
    loadingPost: true,
    loadingComments: true,
  }

  componentDidMount() {
    const { id } = queryString.parse(this.props.location.search)
    fetchItem(id)
    .then((post) => {
      this.setState({
        post: post,
        loadingPost: false,
      })
      return fetchComments(post.kids ? post.kids.slice(0,25) : [])
    }) 
    .then((comments) => {
      this.setState({
        comments: comments,
        loadingComments: false,
      })
    })
    .catch(({ message }) => this.setState({
      error: message,
      loadingPost: false,
      loadingComments: false,
    }))
  }

  render() {
    const { post, comments, loadingPost, loadingComments, error } = this.state

    if (error) {
      return <p className="center-text error">{error}</p>
    }

    return (
      <React.Fragment>
        { loadingPost && <Loading text="Fetching Post" /> }
        { post && (
          <React.Fragment>
            <h1 className='header'>
              <Title url={post.url} title={post.title} id={post.id} />
            </h1>
            <PostMetaInfo
              by={post.by}
              time={post.time}
              id={post.id}
              descendants={post.descendants}
            />
          </React.Fragment>
        )}

        { !loadingPost && loadingComments && <Loading text="Fetching Comments" /> }
        { comments.length > 0 && (
          <div>
            <h2>Comments</h2>
            <ul>
              { comments.map((comment) => 
                <Comment key={comment.id} comment={comment} />
              )}
            </ul>
          </div>
        )}
      </React.Fragment>
    )
  }
}