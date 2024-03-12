import React, { useState } from 'react'
import useFirestore from '../hooks/useFirestore';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment/moment';
import trashIcon from '../assets/trash.svg';
import editIcon from '../assets/edit.svg';
import NoteForm from './NoteForm';


export default function NoteList() {

    let { id } = useParams();

    let { getCollection, deleteDocument } = useFirestore();
    let {error, data : notes, loading} = getCollection('notes', ['bookUid', '==', id]);
    let [editNote, setEditNote] = useState(null);

    let deleteNote = async (id) => {
        await deleteDocument('notes', id);
    }
    
  return (
    !!notes.length && (
        notes.map(note => (
            <div key={note.id} className='p-3 shadow-lg border-2 my-3'>
                <div className='flex justify-between'>
                    <div className='flex space-x-3'>
                        <img className='w-12 h-12 rounded-full' src="https://lh3.googleusercontent.com/a/ACg8ocJr-AGd9hUJr23yjVH_myKXuaBOeTnCw1IRJoeEOj6SmE4=s96-c" alt="" />
                        <div>
                            <h1>Ye Myat Min</h1>
                            <p className='text-gray-400'>{moment(note?.date?.seconds * 1000).fromNow()}</p>
                        </div>
                    </div>
                    <div className='flex space-x-3'>
                        <img className='cursor-pointer' onClick={() => setEditNote(note)} src={editIcon} alt="" />
                        <img className='cursor-pointer' onClick={() => deleteNote(note.id)} src={trashIcon} alt="" width={25}/>
                    </div>
                </div>
                <div className='mt-3'>
                    {editNote?.id !== note.id && note.body}
                    {editNote?.id == note.id && <NoteForm type='update' setEditNote={setEditNote} editNote={editNote}/>}
                </div>                
            </div>
        ))
    )
          
  )
}
