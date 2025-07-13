import { useMemo, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useContent } from "../context/Contentcontext"
import {isNotEmpty} from "../utils/validation"
import { Link } from "react-router-dom";

export default function Viewcontext() {
  const {deleteContent,contents,addComment} =useContent();
  const {user} = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');
  const [commentInput, setCommentInput] = useState({});

  function handleDelete(id){
    if(window.confirm("Are you sure you want to delete this content")){
      deleteContent(id);
    }
  }

  // handleCommentChange function work is to update the comment input value and set it as the user keeps on typing comment values.
  // for a perticular content we can add multiple comment and adding and updating each comment while typing will invoke the handleCommentChange.
  function handleCommentChange(contentId, value){
    setCommentInput((prev) => ({...prev, [contentId]: value}));
  }
  
  function handleCommentSubmit(e, contentId){
    e.preventDefault();
    const commentText = commentInput[contentId];
    if(!isNotEmpty(commentText)){
      return;
    }

    const newComment = {
      id: Date.now(),
      author: user.username,
      text: commentText,
      date: new Date().toISOString()
    }
    addComment(contentId,newComment);
    setCommentInput((prev) => ({...prev, [contentId]: ''}))
  }

  const filteredContent = useMemo(()=>contents.filter((item)=>{
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ==='All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
  }).sort((a,b) =>{
      switch (sortOption){
        case 'Newest':
          return new Date(b.date) - new Date(b.date);

        case 'Oldest':
          return new Date(a.date) - new Date(b.date);

        case 'Title A-Z':
          return a.title.localeCompare(b.title);

        case 'Title Z-A':
          return b.title.localeCompare(a.title);

        default:
          return 0;
      }
  }),[contents,sortOption,filterCategory,searchTerm]);


  return (
    <div className="panel">
      <h2>View Content</h2>
      <div className="controls">
        <div className="search-bar">
          <input
           type="text"
           placeholder="Seach by title.."
           value={searchTerm}
           onChange={(e)=> setSearchTerm(e.target.value)}
           />
        </div>
        <div className="filter-sort">
          <label>
            Filter by Category:
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All</option>
              <option value="News">News</option>
              <option value="Blog">Blog</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Misc">Misc</option>
            </select>
          </label>
          <label>
            Sort by:
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="Newst">Newst</option>
              <option value="Oldest">Oldest</option>
              <option value="Title A-Z">Title A-Z</option>
              <option value="Title Z-A">Title Z-A</option>
            </select>
          </label>
        </div>
      </div>
        {
          filteredContent.length === 0 ? (<p>No Content Available</p>) : (
            <ul className="content-list">
              {filteredContent.map((item)=>{
                
                return (<li key={item.id} className="content-item">
                            <div className="content-header">
                              <div>
                                <h3>{item.title}</h3>
                                <small>Category: {item.category} | Author: {item.author}</small>
                              </div>
                              { (user?.username === item.author)&&
                                 (<div className="content-actions">
                                <Link to={`/edit/${item.id}`} className="btn-edit">Edit</Link>
                                <button onClick={()=>handleDelete(item.id)} className="btn-delete">Delete</button>
                              </div>)}
                            </div>
                          <p>{item.body}</p>
                          <small>{new Date(item.date).toLocaleString()}</small>
                          <div className="comments-section">
                            <h4>Comments</h4>
                            {item.comments.map((comment) => {
                              return (
                                <li key={comment.id} className="comment-item">
                                  <p>
                                    <strong>{comment.author}</strong>: {comment.text}
                                  </p>
                                  <small>{new Date(comment.id).toLocaleString()}</small>
                                </li>
                              )
                            })}
                          </div>

                          { user && (
                          <form className="comment-form" onSubmit={(e)=> handleCommentSubmit(e,item.id)}>
                            <input
                             type="text"
                             placeholder="Add a Comment..."
                             value={commentInput[item.id] || ''}
                             onChange={(e) => handleCommentChange(item.id, e.target.value)}
                             />
                            <button className="btn" type="submit">Comment</button>
                          </form>)
                          }
                      </li>)
              }
              )}
            </ul>
          )
        }
      </div>
  )
}
