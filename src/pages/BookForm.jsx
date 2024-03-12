import React, { useContext, useState } from 'react';
// import useFetch from '../hooks/useFetch';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from '../contexts/AuthContext';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function Create() {

  let { id } = useParams();
  let [title, setTitle] = useState('');
  let [description, setDescription] = useState('');
  let [newCategory, setNewCategory] = useState('');
  let [categories, setCategories] = useState([]);
  let [isEdit, setIsEdit] = useState(false);
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState('');

  let { addCollection, updateDocument} = useFirestore();

  useEffect(() => {
    // edit form
    if(id) {
      setIsEdit(true);
      let ref = doc(db, 'books', id);
      getDoc(ref).then(doc => {
        if(doc.exists()) {
          let { title, description, categories} = doc.data();
          setTitle(title);
          setDescription(description);
          setCategories(categories);
        }
      })
    // create form  
    } else {
      setIsEdit(false);
      setTitle('');
      setDescription('');
      setNewCategory('');
    }
  }, [id])


  // for json-sever
  // let {setPostData, data : book} = useFetch("http://localhost:3000/books", "POST"); 

  let navigate = useNavigate();

  let addCategory = (e) => {
    if(newCategory && categories.includes(newCategory)) {
      setNewCategory('');
      return;
    }
    setCategories(prev => [newCategory, ...prev]);
    setNewCategory('');
  }

  let handlePhotoChange = (e) => {
    setFile(e.target.files[0]);
  } 

  let handlePreviewImage = (file) => {
    let reader = new FileReader;
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result)
    }
  }

  useEffect(() => {
    if(file) {
      handlePreviewImage(file);
    }
  }, [file])

  let { user } = useContext(AuthContext);

  let uploadToFirebase = async (file) => {
    let uniqueImageName = Date.now().toString() + '-' + file.name;
    let path = '/covers/' + user.uid + '/' + uniqueImageName;
    let storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  let submitForm = async (e) => {
    e.preventDefault();
    let url = await uploadToFirebase(file);
    let data = {
      title,
      description,
      categories,
      uid : user.uid,
      cover : url
    }
    // for firebase-server
    if(isEdit) {
      await updateDocument('books', id, data);
    } 
    else {
      await addCollection('books', data);
    }
    navigate("/");
    // setPostData(data); // for json-server
  }

  // for json-server
  // useEffect(() => {
  //   if(book) {
  //     navigate("/");
  //   }
  // }, [book])

  let { isDark } = useTheme();

  return (
    <div className='h-screen'>
      <form className="w-full max-w-lg mx-auto mt-5" onSubmit={submitForm}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark ? 'text-white' : ''}`}>
              Book title 
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 
            px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type='text' placeholder="Book Title"/>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark ? 'text-white' : ''}`}>
              Book description 
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} 
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 
            px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type='text' placeholder="Book Description"/>
            <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark ? 'text-white' : ''}`}>
              Categories
            </label>
            <div className='flex items-center space-x-3'>
              <input value={newCategory} onChange={e => setNewCategory(e.target.value)} 
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 
              px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type='text' placeholder="Book Category"/>
              <button type='button' onClick={addCategory} className='mb-3 bg-primary p-1 rounded-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap">
                {categories.map((c) => (
                    <span key={c} className="text-sm mx-1 my-1 bg-blue-600 text-white rounded-full px-2 py-1">{c}</span>
                ))}
              </div>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${isDark ? 'text-white' : ''}`}>
              Book description 
            </label>
            <input type='file' onChange={handlePhotoChange}/>
            {!!preview && <img src={preview} alt="" className='my-3' width={500} height={500}/>}
          </div>
        </div>

        <button className='text-white bg-primary rounded-2xl px-3 py-2 flex justify-center items-center gap-1 w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <span className='hidden md:block'>{isEdit ? 'Update' : 'Create'} Book</span>
        </button>
      </form> 
    </div>
  )
}
