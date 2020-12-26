import React from "react"
import PropTypes from "prop-types";
import { fetchMainPosts } from "../utils/api";
import Loading from "./Loading";
import PostList from "./PostList";

export default class Posts extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['top', 'new'])
  }

  state = {
    loading: true,
    error: null,
    posts: [],
  }

  componentDidMount() {
    this.handleFetch()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      this.handleFetch()
    }
  }

  handleFetch () {
    this.setState({
      posts: null,
      error: null,
      loading: true
    })

    fetchMainPosts(this.props.type)
    .then((posts) => {
      this.setState({ 
        posts: posts,
        loading: false,
      })
    })
    .catch((error) => {
      console.log('Error fetching posts: ', error)
      this.setState({
        loading: false,
        error: `There was an error fetching the posts !`
      })
    })
  }

  render() {
    const { loading, error, posts } = this.state;

    if (loading) {
      return <Loading />
    }

    if (error) {
      return <p className='center-text error'>{error}</p>
    }

    return (
      <PostList posts={posts} />
    )
  }
}