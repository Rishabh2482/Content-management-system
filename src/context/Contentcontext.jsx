import { createContext, useContext, useEffect, useState } from 'react'

const ContentContext=createContext();

export default function ContentProvider({children}) {
    const [contents, setContents] = useState(()=>{
        const storedData = localStorage.getItem('content');
        return storedData ? JSON.parse(storedData) : [];
    })

    function addContent(content){
        setContents((previousContent)=> [...previousContent, {...content, comments: []}]);
    }

    function editContent(updatedContent){
        setContents((previousContent)=> {
            return previousContent.map((item)=>{
               return item.id === updatedContent.id ? {...updatedContent, comments: item.comments}: item;
            })
        })
    }

    function deleteContent(id){
        setContents((pre) => pre.filter((item)=> item.id !== id));
    }

    function addComment(contentId, comment){
        setContents((prev)=> prev.map((item)=> item.id===contentId ? {...item, comments: [...item.comments, comment]} : item))
    }
    
    useEffect(()=>{
        localStorage.setItem('content', JSON.stringify(contents))
    },[contents])


  return (
    <ContentContext.Provider value={{contents, addContent, editContent, deleteContent, addComment}}>
        {children}
    </ContentContext.Provider>
  )
}


export const useContent = () => useContext(ContentContext);