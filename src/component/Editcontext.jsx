import { useNavigate, useParams } from "react-router-dom"
import { useContent } from "../context/Contentcontext";
import { useAuth } from "../context/Authcontext";
import { useEffect, useState } from "react";
import { isNotEmpty } from "../utils/validation";
export default function Editcontext() {

  const {id} = useParams();
  const navigate = useNavigate();
  const {editContent,contents} = useContent();
  const {user} = useAuth();
  const contentToEdit = contents.find((content) => content.id === Number(id));

  const [title, setTitle]= useState(contentToEdit?.title || '');
  const [body, setBody]=useState(contentToEdit?.body || '');
  const [category, setCategory] =useState(contentToEdit?.category || 'Misc');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(()=>{
    if(!contentToEdit){
      navigate('/view');
    }
  },[contentToEdit,navigate])

  function handleSubmit(e) {
    e.preventDefault();
    if(!isNotEmpty(title) || !isNotEmpty(body)){
      setError("Please fill title and body for article")
      return;
    }
    const newUpdatedContent = {
      id: contentToEdit.id,
      title,
      body,
      category,
      date: new Date().toISOString(),
      author: user.username,
    }

    editContent(newUpdatedContent);
    setTitle('');
    setBody('');
    setCategory('Misc');
    setError('');
    navigate("/view");
  }

  return (
    <div className="panel">
      <h2>Add Content</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="edit-title">edit-Title:</label>
          <input
            id = "edit-title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-body">edit-Body:</label>
          <textarea
            id = "edit-body"
            placeholder="Enter body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-category">edit-Category:</label>
          <select 
          name="category" 
          id="edit-category"
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
