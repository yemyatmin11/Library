import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import useFirestore from '../hooks/useFirestore';
import { useEffect } from 'react';

export default function NoteForm({type = 'create', setEditNote, editNote}) {

    let { id } = useParams();
    let [body, setBody] = useState('');
    

    let { addCollection, updateDocument } = useFirestore();

    useEffect(() => {
        if(type === 'update') {
            setBody(editNote.body);
        }
    }, [type])

    let submit = async (e) => {
        e.preventDefault();
        if(type === 'create') {
            let data = {
                body,
                bookUid : id
            }
            await addCollection('notes', data);
        } 
        else {
            editNote.body = body;
            await updateDocument('notes', editNote.id, editNote, false);
            setEditNote(null);
        }
        setBody('');
    }
  return (
    <form onSubmit={submit}>
        <textarea value={body} onChange={e => setBody(e.target.value)} className='w-full bg-gray-50 p-3 shadow-md border-2' name="" id="" cols="30" rows="5"></textarea>
        <div className='flex space-x-3'>
            <button type='submit' className='text-white bg-primary rounded-lg px-3 py-2 flex items-center gap-1 my-3'>                       
                <span>{type == 'create' ? 'Add' : 'Update'} Note</span>
            </button>
            {type == 'update' && <button type='button' onClick={() => setEditNote(null)} className='border-2 border-primary rounded-lg px-3 py-2 flex items-center gap-1 my-3'>                       
                cancel
            </button>}
        </div>
    </form>
  )
}
