import { useNavigate } from "react-router-dom"
import { useContent } from "../context/Contentcontext";
import { useAuth } from "../context/Authcontext";
import { useEffect, useState } from "react";
import { isNotEmpty } from "../utils/validation";

export default function Addcontext() {
  const navigate = useNavigate();
  const {addContent} = useContent();
  const {user} = useAuth();

  const [title, setTitle]= useState('');
  const [body, setBody]=useState('');
  const [category, setCategory] =useState('Misc');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem('contentDraft');
    if(draft){
      try{
        const {title, body, category} = JSON.parse(draft);
        setTitle(title || '');
        setBody(body|| '');
        setCategory(category|| 'Misc');
      }catch(error){
        console.log("Error in parsing draft", error);
      }
    }
  },[]);

  function handleSubmit(e) {
    e.preventDefault();
    if(!isNotEmpty(title) || !isNotEmpty(body)){
      setError("Please fill title and body for article")
      return;
    }
    const newContent = {
      id: Date.now(),
      title,
      body,
      category,
      date: new Date().toISOString(),
      author: user.username,
    }

    addContent(newContent);
    setTitle('');
    setBody('');
    setCategory('Misc');
    setError('');
    localStorage.removeItem('contentDraft');    // if draft with key contentDraft exist than remove it.
    navigate("/view");
  }


  return (
    <div className="panel">
      <h2>Add Content</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id = "title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body:</label>
          <textarea
            id = "body"
            placeholder="Enter body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select 
          name="category" 
          id="category"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}>
            <option value="News">News</option>
            <option value="Blog">Blog</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Misc">Misc</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={showPreview}
              onChange={()=>setShowPreview(prev => !prev)}
              />
              Show Preview
          </label>
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">
          Add
        </button>
      </form>
      {showPreview && (
        <div className="preview">
          <h3>Preview</h3>
          <h4>{title || 'Title'}</h4>
          <p>{body || 'Content Preview'}</p>
          <small>Category: {category}</small>
        </div>
      )}
    </div>
  )
}
