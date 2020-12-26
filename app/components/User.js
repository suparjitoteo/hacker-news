import React from "react";
import queryString from "query-string"
import { fetchUser, fetchPosts } from "../utils/api";
import Loading from "./Loading";
import PostList from "./PostList";

import { ThemeConsumer } from "../context/theme";
import { formatDate } from "../utils/helpers";

export default class User extends React.Component {
  state = {
    user: null,
    posts: null,
    error: null,
    loadingUser: true,
    loadingPosts: true,
  }

  componentDidMount() {
    const { id } = queryString.parse(this.props.location.search)
    fetchUser(id)
    .then((user) => {
      this.setState({
        user: user,
        loadingUser: false,
      })
      return fetchPosts(user.submitted ? user.submitted.slice(0,25) : [])
    }) 
    .then((posts) => {
      this.setState({
        posts: posts,
        loadingPosts: false,
      })
    })
    .catch(({ message }) => this.setState({
      error: message,
      loadingPosts: false,
      loadingUser: false,
    }))
  }

  render() {
    const { user, posts, loadingUser, loadingPosts, error } = this.state

    if (error) {
      return <p className='center-text error'>{error}</p>
    }

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <React.Fragment>
          { loadingUser && <Loading text="Fetching User" /> }
          { user && (
            <React.Fragment>
              <h1 className='header'>{user.id}</h1>
              <div className={`meta-info-${theme}`}>
                <span>joined <b>{formatDate(user.created)}</b></span>
                <span>has <b>{user.karma.toLocaleString()}</b> karma</span>
              </div>
              <p dangerouslySetInnerHTML={{__html: user.about}} />
            </React.Fragment>
          )}
  
          { !loadingUser && loadingPosts && <Loading text="Fetching Posts" /> }
          { posts && (
            <React.Fragment>
              <h2>Posts</h2>
              <PostList posts={posts} />
            </React.Fragment>
          )}
        </React.Fragment>
        )}
      </ThemeConsumer>
    )
  }
}