import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// import useFetch from '../hooks/useFetch';
import useTheme from '../hooks/useTheme';
import useFirestore from '../hooks/useFirestore';
import { addDoc, collection } from 'firebase/firestore';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';


export default function BookDetails() {
    
    let {id} = useParams();

    // for json-server
    // let {data : book, loading, error} = useFetch(`http://localhost:3000/books/${id}`);


    // for firebase server
    let { getDocument } = useFirestore();
    let { error, data : book, loading} = getDocument('books',id);
    

    let {isDark} = useTheme();


  return (
    <>
        {error && <p>{error}</p>}
        {loading && <p>Loading...</p>}
        {!!book && (
            <>
                <div className={`grid grid-cols-2 ${isDark ? 'text-white' : ''}`}>
                    <div>
                        <img src={book.cover} alt="" className='w-[80%]'/>
                    </div>

                    <div className='space-y-4'>
                        <h1 className='font-bold text-3xl'>{book.title}</h1>
                        <div className='space-x-3'>
                            {book.categories.map(category => (
                                <span key={category} className='bg-blue-500 text-white text-sm px-2 py-1 rounded-full '>{category}</span>
                            ))}
                        </div>
                        <p>{book.description}</p>
                    </div>
                </div>

                <div>
                    <h3 className='font-bold text-primary text-center text-xl my-3'>My Notes</h3>
                    <NoteForm/>
                    <NoteList/>
                </div>
            </>
        )}
    </>
  )
}
